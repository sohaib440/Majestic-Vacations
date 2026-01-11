const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/login", authController.login);
// Protected routes (require authentication)
router.get("/me", protect, authController.getMe);
module.exports = router;
