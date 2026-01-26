const express = require("express");
const router = express.Router();
const { uploadTestimonialMedia } = require("../config/multer");
const {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  deleteTestimonialMedia,
} = require("../controllers/testimonial.controller");
const { protect } = require("../middleware/auth");

// Public Routes
// GET all testimonials
router.get("/", getAllTestimonials);

// GET single testimonial
router.get("/:id", getTestimonialById);

// CREATE testimonial
router.post("/", uploadTestimonialMedia, createTestimonial);

// UPDATE testimonial
router.put("/:id", uploadTestimonialMedia, updateTestimonial);

// DELETE testimonial
router.delete("/:id", deleteTestimonial);

// DELETE testimonial media
router.delete("/:id/media/:mediaIndex", deleteTestimonialMedia);

module.exports = router;
