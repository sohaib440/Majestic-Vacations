// controllers/bookingController.js
const Booking = require("../models/booking.model");
const Tour = require("../models/tourSchema");

// CREATE
exports.createBooking = async (req, res) => {
  try {
    const { tour: tourId, participants } = req.body;

    // Fetch the tour to get priceTiers and check remaining_seats
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Check if bookings are open
    if (tour.remaining_seats === 0) {
      return res.status(400).json({
        success: false,
        message: "Sorry, this tour is fully booked and no longer accepting new bookings.",
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    for (const participant of participants) {
      const priceTier = tour.priceTiers.find(
        (pt) => pt.ageGroup === participant.ageGroup
      );
      if (!priceTier) {
        return res.status(400).json({
          success: false,
          message: `Invalid age group: ${participant.ageGroup}`,
        });
      }
      totalAmount += priceTier.price * participant.count;
    }

    // Create a new booking with the calculated total amount
    const booking = new Booking({
      ...req.body,
      pricing: {
        ...req.body.pricing,
        totalAmount,
      },
    });

    await booking.save();

    // Populate the 'tour' field
    const populatedBooking = await Booking.findById(booking._id).populate('tour');


    res.status(201).json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("tour")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("tour");

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};