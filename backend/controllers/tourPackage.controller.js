const Tour = require('../models/tourSchema');

// Helper functions
const updateTourSeats = async (tourId, seatsToBook) => {
  try {
    const updatedTour = await Tour.findOneAndUpdate(
      { _id: tourId, isActive: true, isDeleted: false },
      { $inc: { bookedSeats: seatsToBook } },
      { new: true }
    );

    if (!updatedTour) {
      return { success: false, message: 'Active tour not found' };
    }

    return {
      success: true,
      tour: updatedTour,
      bookedSeats: updatedTour.bookedSeats,
      availableSeats: updatedTour.availableSeats
    };
  } catch (error) {
    console.error('Error updating tour seats:', error);
    return { success: false, message: 'Error updating seats', error: error.message };
  }
};

const releaseTourSeats = async (tourId, seatsToRelease) => {
  try {
    const updatedTour = await Tour.findOneAndUpdate(
      { _id: tourId, isActive: true, isDeleted: false },
      { $inc: { bookedSeats: -seatsToRelease } },
      { new: true }
    );

    if (!updatedTour) {
      return { success: false, message: 'Active tour not found' };
    }

    return {
      success: true,
      tour: updatedTour,
      bookedSeats: updatedTour.bookedSeats,
      availableSeats: updatedTour.availableSeats
    };
  } catch (error) {
    console.error('Error releasing tour seats:', error);
    return { success: false, message: 'Error releasing seats', error: error.message };
  }
};

// Helper: Parse boolean from query
const parseBool = (value) => value === 'true';

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
    if (query.availableOnly === 'true') filter.availableSeats = { $gt: 0 };

    // Text search filters
    if (query.title) filter.title = { $regex: query.title, $options: 'i' };
    if (query.destination) filter.destination = { $regex: query.destination, $options: 'i' };

    // Country filter
    const validCountries = ['Dubai', 'Greece', 'Indonesia', 'Turkey', 'Thailand'];
    if (query.country && validCountries.includes(query.country)) {
      filter.country = query.country;
    }

    // Price filters
    const priceFilter = {};
    if (query.minPrice) priceFilter.$gte = parseNumber(query.minPrice);
    if (query.maxPrice) priceFilter.$lte = parseNumber(query.maxPrice);
    if (Object.keys(priceFilter).length > 0) filter.price = priceFilter;

    // Monthly price filters
    const monthlyPriceFilter = {};
    if (query.minMonthlyPrice) monthlyPriceFilter.$gte = parseNumber(query.minMonthlyPrice);
    if (query.maxMonthlyPrice) monthlyPriceFilter.$lte = parseNumber(query.maxMonthlyPrice);
    if (Object.keys(monthlyPriceFilter).length > 0) filter.pricePerMonth = monthlyPriceFilter;

    // Active/Deleted filters - SIMPLIFIED
    if (query.isActive !== undefined) {
      filter.isActive = parseBool(query.isActive);
    }

    if (query.isDeleted !== undefined) {
      filter.isDeleted = parseBool(query.isDeleted);
    } else if (!query.includeDeleted && !query.showAll) {
      // Default: show only non-deleted tours
      filter.isDeleted = false;
    }

    // Build query
    const dbQuery = Tour.find(filter);

    // Apply sorting
    const sortOptions = {
      'price-asc': 'price',
      'price-desc': '-price',
      'pricePerMonth-asc': 'pricePerMonth',
      'pricePerMonth-desc': '-pricePerMonth',
      'rating-desc': '-rating',
      'date-asc': 'startDate',
      'available-asc': 'availableSeats',
      'available-desc': '-availableSeats'
    };

    const sortField = query.sort ? (sortOptions[query.sort] || query.sort) : '-createdAt';
    dbQuery.sort(sortField);

    // Apply pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const skip = (page - 1) * limit;

    dbQuery.skip(skip).limit(limit).select('-__v');

    // Execute query
    const [tours, total] = await Promise.all([
      dbQuery.exec(),
      Tour.countDocuments(filter)
    ]);

    res.status(200).json({
      status: 'success',
      results: total,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Get single tour
const getTour = async (req, res) => {
  try {
    const { id } = req.params;
    // const includeDeleted = parseBool(req.query.includeDeleted);

    const query = Tour.findById(id);

    // if (!includeDeleted) {
      // query.find({ isDeleted: false, isActive: true });
    // }

    const tour = await query.select('-__v');

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    // Check if tour is active (unless admin is viewing)
    // if (!tour.isActive && !includeDeleted) {
    //   return res.status(404).json({
    //     status: 'fail',
    //     message: 'Tour is not active',
    //   });
    // }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
        seatInfo: tour.seatInfo,
        monthlyPaymentInfo: tour.monthlyPaymentInfo
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Check tour availability
const checkTourAvailability = async (req, res) => {
  try {
    const { tourId, requiredSeats } = req.query;

    if (!tourId || !requiredSeats) {
      return res.status(400).json({
        status: 'fail',
        message: 'Tour ID and required seats are required',
      });
    }

    const tour = await Tour.findOne({
      _id: tourId,
      isActive: true,
      isDeleted: false
    }).select('title groupSize bookedSeats availableSeats');

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Active tour not found',
      });
    }

    const seatsNeeded = parseInt(requiredSeats);
    const isAvailable = tour.availableSeats >= seatsNeeded;

    res.status(200).json({
      status: 'success',
      data: {
        tourId: tour._id,
        tourTitle: tour.title,
        totalSeats: tour.groupSize,
        bookedSeats: tour.bookedSeats,
        availableSeats: tour.availableSeats,
        requiredSeats: seatsNeeded,
        isAvailable,
        message: isAvailable
          ? `${seatsNeeded} seats are available for booking`
          : `Only ${tour.availableSeats} seats available (${seatsNeeded} needed)`
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// Create tour
const createTour = async (req, res) => {
  try {
    // Parse tour data
    const tourData = typeof req.body.tourData === 'string'
      ? JSON.parse(req.body.tourData)
      : req.body;

    // Handle images
    let images = [];
    if (req.files?.images) {
      images = req.files.images.map(file => `uploads/tour-packages/${file.filename}`);
    } else if (req.file) {
      images = [`uploads/tour-packages/${req.file.filename}`];
    }

    // Validate required fields
    if (!images.length) {
      return res.status(400).json({
        status: 'fail',
        message: 'At least one tour image is required',
      });
    }

    if (!tourData.pricePerMonth) {
      return res.status(400).json({
        status: 'fail',
        message: 'Price per month is required',
      });
    }

    // Validate country
    const validCountries = ['Dubai', 'Greece', 'Indonesia', 'Turkey', 'Thailand'];
    if (!validCountries.includes(tourData.country)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Country must be one of: Dubai, Greece, Indonesia, Turkey, Thailand',
      });
    }

    // Prepare tour data
    const newTourData = {
      ...tourData,
      startDate: tourData.startDate,
      images,
      groupSize: parseInt(tourData.groupSize) || 1,
      pricePerMonth: parseFloat(tourData.pricePerMonth) || 0,
      bookedSeats: 0,
      featured: parseBool(tourData.featured),
      rating: tourData.rating ? parseFloat(tourData.rating) : 4.8,
      originalPrice: tourData.originalPrice ? parseFloat(tourData.originalPrice) : undefined,
      isActive: tourData.isActive !== false,
      isDeleted: false,
      deletedAt: null,
    };

    // If inactive, mark as deleted
    if (newTourData.isActive === false) {
      newTourData.isDeleted = true;
      newTourData.deletedAt = new Date();
    }

    // Create tour
    const newTour = await Tour.create(newTourData);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
        seatInfo: newTour.seatInfo,
        monthlyPaymentInfo: newTour.monthlyPaymentInfo
      },
    });
  } catch (err) {
    console.error('❌ Create Tour Error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message || 'Failed to create tour',
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
        status: 'fail',
        message: 'Tour not found',
      });
    }

    // Parse tour data
    const tourData = typeof req.body.tourData === 'string'
      ? JSON.parse(req.body.tourData)
      : req.body;

    // Prepare update data
    const updateData = { ...tourData };

    // Handle images
    if (req.files?.images) {
      updateData.images = req.files.images.map(file => `uploads/tour-packages/${file.filename}`);
    }

    // Handle groupSize
    if (updateData.groupSize && typeof updateData.groupSize === 'string') {
      updateData.groupSize = parseInt(updateData.groupSize);

      if (updateData.groupSize < existingTour.bookedSeats) {
        return res.status(400).json({
          status: 'fail',
          message: `Cannot reduce group size below ${existingTour.bookedSeats} (currently booked seats)`,
        });
      }
    }

    // Handle pricing
    if (updateData.pricePerMonth && typeof updateData.pricePerMonth === 'string') {
      updateData.pricePerMonth = parseFloat(updateData.pricePerMonth);
    }

    updateData.featured = parseBool(tourData.featured);

    // Handle active/deleted status
    if (tourData.isActive !== undefined) {
      const isActive = parseBool(tourData.isActive);
      updateData.isActive = isActive;
      updateData.isDeleted = !isActive;
      updateData.deletedAt = isActive ? null : new Date();
    }

    // Update tour
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
        seatInfo: updatedTour.seatInfo,
        monthlyPaymentInfo: updatedTour.monthlyPaymentInfo
      },
    });
  } catch (err) {
    console.error('Update Tour Error:', err);
    res.status(400).json({
      status: 'fail',
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
        status: 'fail',
        message: 'Tour not found',
      });
    }

    // Soft delete
    tour.isDeleted = true;
    tour.isActive = false;
    tour.deletedAt = new Date();
    await tour.save();

    res.status(200).json({
      status: 'success',
      message: 'Tour soft deleted successfully',
      data: {
        tourId: tour._id,
        deletedAt: tour.deletedAt,
        isDeleted: tour.isDeleted,
        isActive: tour.isActive
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
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
      isDeleted: false
    })
      .select('-__v')
      .limit(6)
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: featuredTours.length,
      data: { tours: featuredTours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  getFeaturedTours,
  checkTourAvailability,
  createTour,
  updateTour,
  deleteTour,
  updateTourSeatsHelper: updateTourSeats,
  releaseTourSeatsHelper: releaseTourSeats
};