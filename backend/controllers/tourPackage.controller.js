// controllers/tourPackage.controller.js
const Tour = require('../models/tourSchema');

// Helper function to update available seats
const updateTourSeats = async (tourId, seatsToBook) => {
  try {
    // Use atomic operation with $inc
    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      { $inc: { bookedSeats: seatsToBook } },
      { new: true }
    );

    if (!updatedTour) {
      return { success: false, message: 'Tour not found' };
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

// Helper function to release seats
const releaseTourSeats = async (tourId, seatsToRelease) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      { $inc: { bookedSeats: -seatsToRelease } },
      { new: true }
    );

    if (!updatedTour) {
      return { success: false, message: 'Tour not found' };
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

// Get all tours (remove isActive filter since we removed that field)
const getAllTours = async (req, res) => {
  try {
    // Build filter object
    const filter = {};

    // Apply featured filter if provided
    if (req.query.featured !== undefined) {
      filter.featured = req.query.featured === 'true';
    }

    // Apply country filter if provided (exact match)
    if (req.query.country) {
      const validCountries = ['Dubai', 'Greece', 'Indonesia', 'Turkey', 'Thailand'];
      if (validCountries.includes(req.query.country)) {
        filter.country = req.query.country;
      }
    }

    // Apply title search filter if provided (case-insensitive partial match)
    if (req.query.title) {
      filter.title = { $regex: req.query.title, $options: 'i' };
    }

    // Apply destination filter if provided (case-insensitive partial match)
    if (req.query.destination) {
      filter.destination = { $regex: req.query.destination, $options: 'i' };
    }

    // Apply availability filter if provided
    if (req.query.availableOnly === 'true') {
      filter.availableSeats = { $gt: 0 };
    }

    // Apply price range filters
    if (req.query.minPrice) {
      filter.price = { $gte: parseFloat(req.query.minPrice) };
    }
    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.maxPrice) };
    }

    // Apply pricePerMonth range filters
    if (req.query.minMonthlyPrice) {
      filter.pricePerMonth = { $gte: parseFloat(req.query.minMonthlyPrice) };
    }
    if (req.query.maxMonthlyPrice) {
      filter.pricePerMonth = { ...filter.pricePerMonth, $lte: parseFloat(req.query.maxMonthlyPrice) };
    }

    // Build query
    let query = Tour.find(filter);

    // Apply sorting
    if (req.query.sort) {
      const sortOptions = {
        'price-asc': 'price',
        'price-desc': '-price',
        'pricePerMonth-asc': 'pricePerMonth',
        'pricePerMonth-desc': '-pricePerMonth',
        'rating-desc': '-rating',
        'date-asc': 'startDate', // Changed from 'date' to 'startDate'
        'available-asc': 'availableSeats',
        'available-desc': '-availableSeats'
      };

      const sortField = sortOptions[req.query.sort] || req.query.sort;
      query = query.sort(sortField);
    } else {
      query = query.sort('-createdAt'); // Default sort by newest first
    }

    // Apply pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Select fields (exclude __v)
    query = query.select('-__v');

    // Execute query
    const tours = await query;

    // Get total count for pagination
    const total = await Tour.countDocuments(filter);

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

// Get single tour with seat availability
const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).select('-__v');

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
        seatInfo: {
          totalSeats: tour.groupSize,
          bookedSeats: tour.bookedSeats,
          availableSeats: tour.availableSeats
        },
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

    const tour = await Tour.findById(tourId).select('title groupSize bookedSeats availableSeats');

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
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
        isAvailable: isAvailable,
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

// Create tour (Admin) - UPDATED FOR MULTIPLE IMAGES
const createTour = async (req, res) => {
  try {
    // Get uploaded images paths (multiple files)
    let images = [];
    if (req.files && req.files.images) {
      // If multiple images
      images = req.files.images.map(file =>
        `uploads/tour-packages/${file.filename}`
      );
    } else if (req.file) {
      // If single image (backward compatibility)
      images = [`uploads/tour-packages/${req.file.filename}`];
    }

    // Get highlight media files if any
    let highlightMedia = [];
    if (req.files && req.files.highlightMedia) {
      highlightMedia = req.files.highlightMedia.map(file => ({
        filename: file.filename,
        path: `uploads/tour-highlights/${file.filename}`
      }));
    }

    // Parse tourData from JSON string
    let tourData = req.body;
    if (typeof req.body.tourData === 'string') {
      try {
        tourData = JSON.parse(req.body.tourData);
      } catch (parseErr) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid tourData JSON format',
        });
      }
    }

    // Validate required fields
    if (!images || images.length === 0) {
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

    const validCountries = ['Dubai', 'Greece', 'Indonesia', 'Turkey', 'Thailand'];
    if (!validCountries.includes(tourData.country)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Country must be one of: Dubai, Greece, Indonesia, Turkey, Thailand',
      });
    }

    // Convert groupSize to number if it's a string
    let groupSize = tourData.groupSize;
    if (typeof groupSize === 'string') {
      groupSize = parseInt(groupSize);
      if (isNaN(groupSize) || groupSize < 1) {
        return res.status(400).json({
          status: 'fail',
          message: 'Group size must be a positive number',
        });
      }
    }

    // Process highlights with media
    let processedHighlights = [];
    if (tourData.highlights && Array.isArray(tourData.highlights)) {
      processedHighlights = tourData.highlights.map((highlight, index) => {
        // If highlight is a string, convert to object
        if (typeof highlight === 'string') {
          return {
            text: highlight,
            media: null,
            mediaType: null
          };
        }

        // If highlight is an object with media reference
        if (highlight.mediaIndex !== undefined && highlightMedia[highlight.mediaIndex]) {
          return {
            text: highlight.text,
            media: highlightMedia[highlight.mediaIndex].path,
            mediaType: highlight.mediaType || 'image'
          };
        }

        return highlight;
      });
    }

    // Build the final object to save
    const newTourData = {
      ...tourData,
      startDate: tourData.startDate, // Changed from date to startDate
      images: images, // Changed from image to images (array)
      groupSize: groupSize,
      pricePerMonth: parseFloat(tourData.pricePerMonth) || 0,
      bookedSeats: 0, // Start with 0 booked seats
      featured: tourData.featured === true || tourData.featured === 'true',
      highlights: processedHighlights,
      rating: tourData.rating ? parseFloat(tourData.rating) : 4.8,
      originalPrice: tourData.originalPrice
        ? parseFloat(tourData.originalPrice)
        : undefined,
    };

    const newTour = await Tour.create(newTourData);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
        seatInfo: {
          totalSeats: newTour.groupSize,
          bookedSeats: newTour.bookedSeats,
          availableSeats: newTour.availableSeats
        },
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

// Update tour (Admin) - UPDATED FOR MULTIPLE IMAGES
const updateTour = async (req, res) => {
  try {
    const existingTour = await Tour.findById(req.params.id);
    if (!existingTour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    let tourData = req.body;
    if (typeof req.body.tourData === 'string') {
      tourData = JSON.parse(req.body.tourData);
    }

    const updateData = { ...tourData };

    // Handle multiple images update
    if (req.files && req.files.images) {
      updateData.images = req.files.images.map(file =>
        `uploads/tour-packages/${file.filename}`
      );
    } else if (req.file) {
      // If updating single image (append to existing)
      updateData.$push = updateData.$push || {};
      updateData.$push.images = `uploads/tour-packages/${req.file.filename}`;
    }

    // Handle highlight media files
    if (req.files && req.files.highlightMedia) {
      const highlightMedia = req.files.highlightMedia.map(file =>
        `uploads/tour-highlights/${file.filename}`
      );

      // Process highlights to add media
      if (tourData.highlights && Array.isArray(tourData.highlights)) {
        updateData.highlights = tourData.highlights.map((highlight, index) => {
          if (highlight.mediaIndex !== undefined && highlightMedia[highlight.mediaIndex]) {
            return {
              ...highlight,
              media: highlightMedia[highlight.mediaIndex]
            };
          }
          return highlight;
        });
      }
    }

    // Convert groupSize to number if it exists and is a string
    if (updateData.groupSize && typeof updateData.groupSize === 'string') {
      updateData.groupSize = parseInt(updateData.groupSize);
      if (isNaN(updateData.groupSize) || updateData.groupSize < 1) {
        return res.status(400).json({
          status: 'fail',
          message: 'Group size must be a positive number',
        });
      }

      // Ensure bookedSeats doesn't exceed new groupSize
      if (updateData.groupSize < existingTour.bookedSeats) {
        return res.status(400).json({
          status: 'fail',
          message: `Cannot reduce group size below ${existingTour.bookedSeats} (currently booked seats)`,
        });
      }
    }

    // Ensure pricePerMonth is a number
    if (updateData.pricePerMonth && typeof updateData.pricePerMonth === 'string') {
      updateData.pricePerMonth = parseFloat(updateData.pricePerMonth);
    }

    updateData.featured = tourData.featured === true || tourData.featured === 'true';

    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour,
        seatInfo: {
          totalSeats: updatedTour.groupSize,
          bookedSeats: updatedTour.bookedSeats,
          availableSeats: updatedTour.availableSeats
        },
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

// Delete tour (permanent delete since we removed soft delete)
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Tour deleted successfully',
      data: null,
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
    const featuredTours = await Tour.find({ featured: true })
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