const express = require("express");
const {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
} = require("../controllers/inquiry.controller");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Public (Website) - no protection
router.post("/create", createInquiry);

// Admin - protected routes
router.get("/getall", protect, getAllInquiries);
router.get("/:id", protect, getInquiryById);
router.put("/:id", protect, updateInquiry);
router.delete("/:id", protect, deleteInquiry);

module.exports = router; // Use module.exports for CommonJS
