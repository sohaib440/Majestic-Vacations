const VacationRentalInquiry = require('../models/vacationRentalInquries');

// Create a new vacation rental inquiry
const createVacationRentalInquiry = async (req, res) => {
  try {
    const { userName, userEmail, userPhone, packageName, numberOfDays, startDate, endDate, location, numberOfGuests } = req.body;

    // Validate required fields
    if (!userName || !userEmail || !packageName || !numberOfDays || !startDate || !endDate || !location || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: userName, userEmail, packageName, numberOfDays, startDate, endDate, location, numberOfGuests'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use valid date strings.'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    // Create inquiry
    const inquiry = await VacationRentalInquiry.create({
      userName,
      userEmail: userEmail.toLowerCase(),
      userPhone: userPhone || '',
      packageName,
      numberOfDays,
      startDate: start,
      endDate: end,
      location,
      numberOfGuests
    });

    res.status(201).json({
      success: true,
      message: 'Vacation rental inquiry created successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Error creating vacation rental inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating vacation rental inquiry',
      error: error.message
    });
  }
};

// Get all vacation rental inquiries (admin only)
const getAllVacationRentalInquiries = async (req, res) => {
  try {
    const { location, packageName, sortBy = 'createdAt' } = req.query;
    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (packageName) {
      filter.packageName = { $regex: packageName, $options: 'i' };
    }

    const inquiries = await VacationRentalInquiry.find(filter)
      .sort({ [sortBy]: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Error fetching vacation rental inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vacation rental inquiries',
      error: error.message
    });
  }
};

// Get a single vacation rental inquiry by ID
const getVacationRentalInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await VacationRentalInquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Vacation rental inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Error fetching vacation rental inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vacation rental inquiry',
      error: error.message
    });
  }
};

// Get inquiries by user email
const getInquiriesByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const inquiries = await VacationRentalInquiry.find({
      userEmail: email.toLowerCase()
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Error fetching inquiries by email:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries by email',
      error: error.message
    });
  }
};

// Update a vacation rental inquiry
const updateVacationRentalInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, userEmail, userPhone, packageName, numberOfDays, startDate, endDate, location, numberOfGuests } = req.body;

    const inquiry = await VacationRentalInquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Vacation rental inquiry not found'
      });
    }

    // Update fields
    if (userName) inquiry.userName = userName;
    if (userEmail) inquiry.userEmail = userEmail.toLowerCase();
    if (userPhone) inquiry.userPhone = userPhone;
    if (packageName) inquiry.packageName = packageName;
    if (numberOfDays) inquiry.numberOfDays = numberOfDays;
    if (startDate) inquiry.startDate = new Date(startDate);
    if (endDate) inquiry.endDate = new Date(endDate);
    if (location) inquiry.location = location;
    if (numberOfGuests) inquiry.numberOfGuests = numberOfGuests;

    const updatedInquiry = await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Vacation rental inquiry updated successfully',
      data: updatedInquiry
    });
  } catch (error) {
    console.error('Error updating vacation rental inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vacation rental inquiry',
      error: error.message
    });
  }
};

// Delete a vacation rental inquiry
const deleteVacationRentalInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await VacationRentalInquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Vacation rental inquiry not found'
      });
    }

    await VacationRentalInquiry.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Vacation rental inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vacation rental inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vacation rental inquiry',
      error: error.message
    });
  }
};

// Get inquiries by date range
const getInquiriesByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both startDate and endDate'
      });
    }

    const inquiries = await VacationRentalInquiry.find({
      startDate: { $gte: new Date(startDate) },
      endDate: { $lte: new Date(endDate) }
    }).sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    console.error('Error fetching inquiries by date range:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inquiries by date range',
      error: error.message
    });
  }
};

module.exports = {
  createVacationRentalInquiry,
  getAllVacationRentalInquiries,
  getVacationRentalInquiry,
  getInquiriesByEmail,
  updateVacationRentalInquiry,
  deleteVacationRentalInquiry,
  getInquiriesByDateRange
};
