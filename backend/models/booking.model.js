// models/booking.model.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true, index: true },
    bookingReference: { type: String, unique: true, index: true },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    customerInfo: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true, index: true },
      phone: { type: String, required: true, trim: true },
      nationality: String,
      passportNumber: String,
    },
    participants: [
      {
        ageGroup: {
          type: String,
          required: true,
        },
        count: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    pricing: {
      totalAmount: { type: Number, required: true, min: 1 },
      currency: { type: String, default: "USD" },
      paymentPlan: { type: String, enum: ["full", "monthly"], required: true },
      monthlyAmount: Number,
      monthsRequired: Number,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partial", "paid", "failed"],
      default: "unpaid",
      index: true,
    },
    adminNotes: { type: String, trim: true },
    termsAccepted: { type: Boolean, required: true, validate: v => v === true, message: "Terms must be accepted" },
  },
  { timestamps: true }
);

// Add a virtual property to get the total number of seats booked
bookingSchema.virtual("seatsBooked").get(function () {
  return this.participants.reduce((total, p) => total + p.count, 0);
});

// Generate booking reference
bookingSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    const ts = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingReference = `BK-${ts}-${rnd}`;
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
