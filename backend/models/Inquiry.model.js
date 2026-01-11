const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true},
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    destination: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry; // ✅ CommonJS export
