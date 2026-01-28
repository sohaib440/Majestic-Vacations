const express = require('express');
const vacationRentalInquiryController = require('../controllers/vacationRentalInquiry.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes - Anyone can create an inquiry
router.post('/', vacationRentalInquiryController.createVacationRentalInquiry);

// Get inquiries by email (public)
router.get('/email/:email', vacationRentalInquiryController.getInquiriesByEmail);

// Get inquiries by date range (public)
router.get('/date-range', vacationRentalInquiryController.getInquiriesByDateRange);

// Get single inquiry (public)
router.get('/:id', vacationRentalInquiryController.getVacationRentalInquiry);

// Protected routes - Admin only
router.use(protect);

// Get all inquiries (admin)
router.get('/', vacationRentalInquiryController.getAllVacationRentalInquiries);

// Update inquiry (admin)
router.patch('/:id', vacationRentalInquiryController.updateVacationRentalInquiry);

// Delete inquiry (admin)
router.delete('/:id', vacationRentalInquiryController.deleteVacationRentalInquiry);

module.exports = router;
