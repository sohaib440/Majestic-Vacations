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
    seatsBooked: { type: Number, required: true, min: 1, default: 1 },
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

bookingSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    const ts = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingReference = `BK-${ts}-${rnd}`;
  }
  next();
});

bookingSchema.methods.confirmBooking = async function () {
  if (this.bookingStatus === "confirmed") return this;

  const Tour = mongoose.model("Tour");
  const tour = await Tour.findById(this.tour);
  if (!tour) throw new Error("Tour not found");
  if (tour.availableSeats < this.seatsBooked) throw new Error("Not enough seats available");

  tour.bookedSeats += this.seatsBooked;
  await tour.save();

  this.bookingStatus = "confirmed";
  this.paymentStatus = "paid";
  return this.save();
};

module.exports = mongoose.model("Booking", bookingSchema);