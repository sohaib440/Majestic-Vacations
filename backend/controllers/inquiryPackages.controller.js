const PackageInquiry = require('../models/inquiryPackages.model');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// @desc    Create a new package inquiry
// @route   POST /api/inquiry-packages
// @access  Private
exports.createPackageInquiry = async (req, res) => {
  try {
    const { packageName, packageDescription, location, packageAveragePrice } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!packageName) {
      return res.status(400).json({ error: 'Package name is required' });
    }

    // Handle media uploads
    const media = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const mediaItem = {
          type: file.mimetype.startsWith('video') ? 'video' : 'image',
          url: `/uploads/inquiry-packages/${file.filename}`,
        };
        
        // Add thumbnail for videos
        if (mediaItem.type === 'video' && req.body.thumbnails) {
          mediaItem.thumbnail = req.body.thumbnails[req.files.indexOf(file)];
        }
        
        media.push(mediaItem);
      });
    }

    // Create package inquiry
    const packageInquiry = new PackageInquiry({
      packageName: packageName.trim(),
      packageDescription: packageDescription?.trim() || '',
      location: location?.trim() || '',
      packageAveragePrice: packageAveragePrice || 0,
      media,
      createdBy: userId,
    });

    await packageInquiry.save();
    await packageInquiry.populate('createdBy', 'userName userEmail userRole _id');

    res.status(201).json({
      success: true,
      message: 'Package inquiry created successfully',
      data: packageInquiry,
    });
  } catch (error) {
    console.error('Create Package Inquiry Error:', error);
    res.status(500).json({
      error: 'Failed to create package inquiry',
      details: error.message,
    });
  }
};

// @desc    Get all package inquiries with filters, search, and pagination
// @route   GET /api/inquiry-packages
// @access  Public
exports.getAllPackageInquiries = async (req, res) => {
  try {
    const { search, location, minPrice, maxPrice, page = 1, limit = 12, sortBy = '-createdAt' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { isDeleated: false };

    if (search) {
      filter.$or = [
        { packageName: { $regex: search, $options: 'i' } },
        { packageDescription: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.packageAveragePrice = {};
      if (minPrice) filter.packageAveragePrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.packageAveragePrice.$lte = parseFloat(maxPrice);
    }

    // Get total count for pagination
    const total = await PackageInquiry.countDocuments(filter);

    // Fetch inquiries
    const inquiries = await PackageInquiry.find(filter)
      .populate('createdBy', 'userName userEmail userRole _id')
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get Package Inquiries Error:', error);
    res.status(500).json({
      error: 'Failed to fetch package inquiries',
      details: error.message,
    });
  }
};

// @desc    Get single package inquiry by ID
// @route   GET /api/inquiry-packages/:id
// @access  Public
exports.getPackageInquiryById = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await PackageInquiry.findOne({ _id: id, isDeleated: false })
      .populate('createdBy', 'userName userEmail userRole _id');

    if (!inquiry) {
      return res.status(404).json({ error: 'Package inquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    console.error('Get Package Inquiry Error:', error);
    res.status(500).json({
      error: 'Failed to fetch package inquiry',
      details: error.message,
    });
  }
};

// @desc    Update package inquiry
// @route   PUT /api/inquiry-packages/:id
// @access  Private
exports.updatePackageInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { packageName, packageDescription, location, packageAveragePrice } = req.body;
    const userId = req.user.id;

    // Find inquiry
    const inquiry = await PackageInquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Package inquiry not found' });
    }

    // Check authorization
    if (inquiry.createdBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this inquiry' });
    }

    // Update fields
    if (packageName) inquiry.packageName = packageName.trim();
    if (packageDescription !== undefined) inquiry.packageDescription = packageDescription?.trim() || '';
    if (location !== undefined) inquiry.location = location?.trim() || '';
    if (packageAveragePrice !== undefined) inquiry.packageAveragePrice = packageAveragePrice;

    // Handle new media uploads
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map((file) => ({
        type: file.mimetype.startsWith('video') ? 'video' : 'image',
        url: `/uploads/inquiry-packages/${file.filename}`,
        thumbnail: req.body.thumbnails ? req.body.thumbnails[req.files.indexOf(file)] : undefined,
      }));

      inquiry.media = [...inquiry.media, ...newMedia];
    }

    await inquiry.save();
    await inquiry.populate('createdBy', 'userName userEmail userRole _id');

    res.status(200).json({
      success: true,
      message: 'Package inquiry updated successfully',
      data: inquiry,
    });
  } catch (error) {
    console.error('Update Package Inquiry Error:', error);
    res.status(500).json({
      error: 'Failed to update package inquiry',
      details: error.message,
    });
  }
};

// @desc    Delete media from package inquiry
// @route   DELETE /api/inquiry-packages/:id/media/:mediaIndex
// @access  Private
exports.deleteMedia = async (req, res) => {
  try {
    const { id, mediaIndex } = req.params;
    const userId = req.user.id;
    const mediaIdx = parseInt(mediaIndex, 10);

    // Find inquiry
    const inquiry = await PackageInquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Package inquiry not found' });
    }

    // Check authorization
    if (inquiry.createdBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete media' });
    }

    // Check if media exists
    if (mediaIdx < 0 || mediaIdx >= inquiry.media.length) {
      return res.status(400).json({ error: 'Invalid media index' });
    }

    // Delete file from server
    const mediaUrl = inquiry.media[mediaIdx].url;
    const filePath = path.join(__dirname, '..', mediaUrl);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from array
    inquiry.media.splice(mediaIdx, 1);
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully',
      data: inquiry,
    });
  } catch (error) {
    console.error('Delete Media Error:', error);
    res.status(500).json({
      error: 'Failed to delete media',
      details: error.message,
    });
  }
};

// @desc    Soft delete package inquiry
// @route   DELETE /api/inquiry-packages/:id
// @access  Private
exports.deletePackageInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find inquiry
    const inquiry = await PackageInquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ error: 'Package inquiry not found' });
    }

    // Check authorization
    if (inquiry.createdBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this inquiry' });
    }

    // Soft delete
    inquiry.isDeleated = true;
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Package inquiry deleted successfully',
    });
  } catch (error) {
    console.error('Delete Package Inquiry Error:', error);
    res.status(500).json({
      error: 'Failed to delete package inquiry',
      details: error.message,
    });
  }
};

// @desc    Get package inquiries by location
// @route   GET /api/inquiry-packages/by-location/:location
// @access  Public
exports.getByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = {
      isDeleated: false,
      location: { $regex: location, $options: 'i' },
    };

    const total = await PackageInquiry.countDocuments(filter);
    const inquiries = await PackageInquiry.find(filter)
      .populate('createdBy', 'userName userEmail userRole _id')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get By Location Error:', error);
    res.status(500).json({
      error: 'Failed to fetch inquiries by location',
      details: error.message,
    });
  }
};

// @desc    Get user's package inquiries
// @route   GET /api/inquiry-packages/user/:userId
// @access  Private
exports.getUserInquiries = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await PackageInquiry.countDocuments({
      createdBy: userId,
      isDeleated: false,
    });

    const inquiries = await PackageInquiry.find({
      createdBy: userId,
      isDeleated: false,
    })
      .populate('createdBy', 'userName userEmail userRole _id')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: inquiries,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get User Inquiries Error:', error);
    res.status(500).json({
      error: 'Failed to fetch user inquiries',
      details: error.message,
    });
  }
};

// @desc    Get package statistics
// @route   GET /api/inquiry-packages/stats/overview
// @access  Public
exports.getPackageStats = async (req, res) => {
  try {
    const totalPackages = await PackageInquiry.countDocuments({ isDeleated: false });
    
    const avgPrice = await PackageInquiry.aggregate([
      { $match: { isDeleated: false } },
      { $group: { _id: null, average: { $avg: '$packageAveragePrice' } } },
    ]);

    const locationStats = await PackageInquiry.aggregate([
      { $match: { isDeleated: false } },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const recentPackages = await PackageInquiry.find({ isDeleated: false })
      .sort('-createdAt')
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        totalPackages,
        averagePrice: avgPrice[0]?.average || 0,
        locationStats,
        recentPackages,
      },
    });
  } catch (error) {
    console.error('Get Stats Error:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      details: error.message,
    });
  }
};

// @desc    Search package inquiries with advanced filters
// @route   POST /api/inquiry-packages/search
// @access  Public
exports.searchPackageInquiries = async (req, res) => {
  try {
    const { keyword, location, minPrice, maxPrice, page = 1, limit = 12 } = req.body;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { isDeleated: false };

    if (keyword) {
      filter.$or = [
        { packageName: { $regex: keyword, $options: 'i' } },
        { packageDescription: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (location && location.trim()) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.packageAveragePrice = {};
      if (minPrice) filter.packageAveragePrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.packageAveragePrice.$lte = parseFloat(maxPrice);
    }

    const total = await PackageInquiry.countDocuments(filter);
    const results = await PackageInquiry.find(filter)
      .populate('createdBy', 'userName userEmail userRole _id')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({
      error: 'Failed to search packages',
      details: error.message,
    });
  }
};
