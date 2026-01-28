const express = require('express');
const {
  createPackageInquiry,
  getAllPackageInquiries,
  getPackageInquiryById,
  updatePackageInquiry,
  deletePackageInquiry,
  deleteMedia,
  getByLocation,
  getUserInquiries,
  getPackageStats,
  searchPackageInquiries,
} = require('../controllers/inquiryPackages.controller');
const { protect, authorize } = require('../middleware/auth');
const { uploadPackageMedia } = require('../config/multer');

const router = express.Router();

// PUBLIC ROUTES

// @route   GET /api/package-inquiries/stats/overview
// @desc    Get package statistics
// @access  Public
router.get('/stats/overview', getPackageStats);

// @route   POST /api/package-inquiries/search
// @desc    Search package inquiries
// @access  Public
router.post('/search', searchPackageInquiries);

// @route   GET /api/package-inquiries/by-location/:location
// @desc    Get inquiries by location
// @access  Public
router.get('/by-location/:location', getByLocation);

// @route   GET /api/package-inquiries
// @desc    Get all package inquiries with filters
// @access  Public
router.get('/', getAllPackageInquiries);

// @route   GET /api/package-inquiries/:id
// @desc    Get single inquiry
// @access  Public
router.get('/:id', getPackageInquiryById);

// PROTECTED ROUTES
router.use(protect);

// @route   POST /api/package-inquiries
// @desc    Create a new package inquiry
// @access  Private
router.post('/', uploadPackageMedia, createPackageInquiry);

// @route   GET /api/package-inquiries/user/:userId
// @desc    Get user's inquiries
// @access  Private
router.get('/user/:userId', getUserInquiries);

// @route   PUT /api/package-inquiries/:id
// @desc    Update package inquiry
// @access  Private
router.put('/:id', uploadPackageMedia, updatePackageInquiry);
s
// @route   DELETE /api/package-inquiries/:id/media/:mediaIndex
// @desc    Delete media from inquiry
// @access  Private
router.delete('/:id/media/:mediaIndex', deleteMedia);

// @route   DELETE /api/package-inquiries/:id
// @desc    Delete package inquiry
// @access  Private
router.delete('/:id', deletePackageInquiry);

module.exports = router;