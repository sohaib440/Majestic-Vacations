// routes/tourRoutes.js
const express = require('express');
const tourController = require('../controllers/tourPackage.controller');
const { protect } = require('../middleware/auth');
const { uploadTourImages, uploadSingleTourImage } = require('../config/multer');

const router = express.Router();

// Public routes
router.route('/')
  .get(tourController.getAllTours);

router.route('/:id')
  .get(tourController.getTour);

router.route('/check/availability')
  .get(tourController.checkTourAvailability);

// PROTECTED ADMIN ROUTES
router.use(protect);
router.route('/')
  .post(uploadTourImages, tourController.createTour);

// Admin: Update & Delete tour
router.route('/:id')
  .patch(uploadTourImages, tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;