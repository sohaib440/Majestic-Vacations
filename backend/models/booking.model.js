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

// Generate booking reference
bookingSchema.pre("save", function (next) {
  if (!this.bookingReference) {
    const ts = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingReference = `BK-${ts}-${rnd}`;
  }
  next();
});

// Confirm booking and allocate seats
bookingSchema.methods.confirmBooking = async function () {
  if (this.bookingStatus === "confirmed") {
    console.log(`Booking ${this.bookingReference} already confirmed`);
    return this;
  }

  const Tour = mongoose.model("Tour");
  const tour = await Tour.findById(this.tour);
  
  if (!tour) {
    throw new Error("Tour not found");
  }
  
  // Check seat availability
  const availableSeats = tour.groupSize - tour.bookedSeats;
  if (availableSeats < this.seatsBooked) {
    throw new Error(`Not enough seats available. Need ${this.seatsBooked}, but only ${availableSeats} left.`);
  }

  // Use atomic operation to prevent race conditions
  const updatedTour = await Tour.findByIdAndUpdate(
    this.tour,
    { $inc: { bookedSeats: this.seatsBooked } },
    { new: true }
  );

  if (!updatedTour) {
    throw new Error("Failed to update tour seats");
  }

  // Update booking status
  this.bookingStatus = "confirmed";
  this.paymentStatus = "paid";
  
  console.log(`✅ Booking confirmed: ${this.bookingReference}, seats allocated: ${this.seatsBooked}`);
  console.log(`   Tour ${tour.title} - Booked seats: ${updatedTour.bookedSeats}/${updatedTour.groupSize}`);
  
  return this.save();
};

// Release seats when booking is cancelled
bookingSchema.methods.releaseSeats = async function () {
  if (this.bookingStatus === "cancelled") {
    return this;
  }

  const Tour = mongoose.model("Tour");
  
  // Release seats only if they were previously confirmed
  if (this.bookingStatus === "confirmed") {
    await Tour.findByIdAndUpdate(
      this.tour,
      { $inc: { bookedSeats: -this.seatsBooked } },
      { new: true }
    );
    console.log(`🔄 Released ${this.seatsBooked} seats for booking ${this.bookingReference}`);
  }

  this.bookingStatus = "cancelled";
  return this.save();
};

module.exports = mongoose.model("Booking", bookingSchema);
