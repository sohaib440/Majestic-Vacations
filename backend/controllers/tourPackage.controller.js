const Tour = require("../models/tourSchema");

// Helper: Validate price tiers structure
const validatePriceTiers = (priceTiers) => {
  if (!Array.isArray(priceTiers) || priceTiers.length === 0) {
    return "Price tiers must be a non-empty array.";
  }

  for (const tier of priceTiers) {
    if (typeof tier !== 'object' || tier === null) {
      return "Each price tier must be an object.";
    }
    if (!tier.ageGroup || typeof tier.ageGroup !== 'string') {
      return "Each price tier must have an 'ageGroup' (string).";
    }
    if (!tier.ageRange || typeof tier.ageRange !== 'string') {
      return "Each price tier must have an 'ageRange' (string).";
    }
    if (typeof tier.price !== 'number' || tier.price < 0) {
      return "Each price tier must have a non-negative 'price' (number).";
    }
  }
  return null; // No validation errors
};

// Helper: Parse boolean from query
const parseBool = (value) => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "boolean") return value; // Handle boolean
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return Boolean(value); // Fallback
};

// Helper: Parse number from query
const parseNumber = (value) => parseFloat(value) || undefined;

// Get all tours - Clean and simple
const getAllTours = async (req, res) => {
  try {
    const { query } = req;

    // Build filter step by step
    const filter = {};

    // Boolean filters
    if (query.featured !== undefined) filter.featured = parseBool(query.featured);
    if (query.availableOnly === "true") filter.remaining_seats = { $gt: 0 };

    // Text search filters
    if (query.title) filter.title = { $regex: query.title, $options: "i" };
    if (query.destination)
      filter.destination = { $regex: query.destination, $options: "i" };

    // Country filter
    const validCountries = [
      "Dubai",
      "Greece",
      "Indonesia",
      "Turkey",
      "Thailand",
    ];
    if (query.country && validCountries.includes(query.country)) {
      filter.country = query.country;
    }

    // Price filters for priceTiers
    const priceFilter = {};
    if (query.minPrice) priceFilter.$gte = parseNumber(query.minPrice);
    if (query.maxPrice) priceFilter.$lte = parseNumber(query.maxPrice);

    if (Object.keys(priceFilter).length > 0) {
      filter["priceTiers.price"] = priceFilter;
    }

    // Active/Deleted filters - ONLY apply if explicitly provided
    if (query.isActive !== undefined) {
      filter.isActive = parseBool(query.isActive);
    }

    if (query.isDeleted !== undefined) {
      filter.isDeleted = parseBool(query.isDeleted);
    }

    // Build query
    const dbQuery = Tour.find(filter);

    // Apply sorting
    const sortOptions = {
      "price-asc": { "priceTiers.price": 1 },
      "price-desc": { "priceTiers.price": -1 },
      "rating-desc": { rating: -1 },
      "date-asc": { startDate: 1 },
    };

    const sortField = query.sort ? sortOptions[query.sort] || { [query.sort]: 1 } : { createdAt: -1 };
    dbQuery.sort(sortField);

    // Apply pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const skip = (page - 1) * limit;

    dbQuery.skip(skip).limit(limit).select("-__v");

    // Execute query
    const [tours, total] = await Promise.all([
      dbQuery.exec(),
      Tour.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      results: total,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get single tour
const getTour = async (req, res) => {
  try {
    const { id } = req.params;
    const query = Tour.findById(id);
    const tour = await query.select("-__v");

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "Tour not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Create tour
const createTour = async (req, res) => {
  try {
    // Parse tour data
    const tourData =
      typeof req.body.tourData === "string"
        ? JSON.parse(req.body.tourData)
        : req.body;

    // Handle images
    let images = [];
    if (req.files?.images) {
      images = req.files.images.map(
        (file) => `uploads/tour-packages/${file.filename}`
      );
    } else if (req.file) {
      images = [`uploads/tour-packages/${req.file.filename}`];
    }

    // Validate required fields
    if (!images.length) {
      return res.status(400).json({
        status: "fail",
        message: "At least one tour image is required",
      });
    }

    // Validate country
    const validCountries = [
      "Dubai",
      "Greece",
      "Indonesia",
      "Turkey",
      "Thailand",
    ];
    if (!validCountries.includes(tourData.country)) {
      return res.status(400).json({
        status: "fail",
        message:
          "Country must be one of: Dubai, Greece, Indonesia, Turkey, Thailand",
      });
    }

    // Prepare tour data
    const newTourData = {
      ...tourData,
      images,
      remaining_seats: parseInt(tourData.remaining_seats) || 0,
      featured: parseBool(tourData.featured),
      rating: tourData.rating ? parseFloat(tourData.rating) : 4.8,
      isActive: tourData.isActive !== false,
      isDeleted: false,
      deletedAt: null,
    };
    if (tourData.priceTiers) {
      const parsedPriceTiers = typeof tourData.priceTiers === 'string'
        ? JSON.parse(tourData.priceTiers)
        : tourData.priceTiers;

      const validationError = validatePriceTiers(parsedPriceTiers);
      if (validationError) {
        return res.status(400).json({
          status: "fail",
          message: `Price Tiers validation error: ${validationError}`,
        });
      }
      newTourData.priceTiers = parsedPriceTiers;
    }

    // Create tour
    const newTour = await Tour.create(newTourData);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.error("❌ Create Tour Error:", err);
    res.status(400).json({
      status: "fail",
      message: err.message || "Failed to create tour",
    });
  }
};

// Update tour
const updateTour = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if tour exists
    const existingTour = await Tour.findById(id);
    if (!existingTour) {
      return res.status(404).json({
        status: "fail",
        message: "Tour not found",
      });
    }
    // Parse tour data
    const tourData =
      typeof req.body.tourData === "string"
        ? JSON.parse(req.body.tourData)
        : req.body;

    // Prepare update data
    const updateData = { ...tourData };

    // Handle images
    if (req.files?.images) {
      updateData.images = req.files.images.map(
        (file) => `uploads/tour-packages/${file.filename}`
      );
    }

    // Handle priceTiers
    if (tourData.priceTiers) {
      const parsedPriceTiers = typeof tourData.priceTiers === 'string'
        ? JSON.parse(tourData.priceTiers)
        : tourData.priceTiers;

      const validationError = validatePriceTiers(parsedPriceTiers);
      if (validationError) {
        return res.status(400).json({
          status: "fail",
          message: `Price Tiers validation error: ${validationError}`,
        });
      }
      updateData.priceTiers = parsedPriceTiers;
    }

    if (tourData.remaining_seats !== undefined) {
        updateData.remaining_seats = parseInt(tourData.remaining_seats);
    }

    updateData.featured = parseBool(tourData.featured);

    // FIXED LOGIC: Handle isActive and auto-set isDeleted
    if (tourData.isActive !== undefined) {
      const isActive = parseBool(tourData.isActive);
      updateData.isActive = isActive;

      // If making tour active, it should not be deleted
      if (isActive) {
        updateData.isDeleted = false;
        updateData.deletedAt = null;
      }
      // If making tour inactive, it should be marked as deleted
      else {
        updateData.isDeleted = true;
        updateData.deletedAt = new Date();
      }
    }

    // Also handle explicit isDeleted if provided (for admin override)
    if (tourData.isDeleted !== undefined) {
      const isDeleted = parseBool(tourData.isDeleted);
      updateData.isDeleted = isDeleted;
      updateData.deletedAt = isDeleted ? new Date() : null;

      // If explicitly setting isDeleted, also set isActive accordingly
      if (isDeleted) {
        updateData.isActive = false;
      } else {
        updateData.isActive = true;
      }
    }

    // Update tour
    const updatedTour = await Tour.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour: updatedTour,
      },
    });
  } catch (err) {
    console.error("Update Tour Error:", err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
// Soft delete tour
const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "Tour not found",
      });
    }

    // Soft delete
    tour.isDeleted = true;
    tour.isActive = false;
    tour.deletedAt = new Date();
    await tour.save();

    res.status(200).json({
      status: "success",
      message: "Tour soft deleted successfully",
      data: {
        tourId: tour._id,
        deletedAt: tour.deletedAt,
        isDeleted: tour.isDeleted,
        isActive: tour.isActive,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get featured tours
const getFeaturedTours = async (req, res) => {
  try {
    const featuredTours = await Tour.find({
      featured: true,
      isActive: true,
      isDeleted:false,
    })
      .select("-__v")
      .limit(6)
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: featuredTours.length,
      data: { tours: featuredTours },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  getFeaturedTours,
  createTour,
  updateTour,
  deleteTour,
};