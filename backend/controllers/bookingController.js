// controllers/bookingController.js
const Booking = require("../models/booking.model");
const Tour = require("../models/tourSchema");
const { updateTourSeatsHelper, releaseTourSeatsHelper } = require("../controllers/tourPackage.controller");

// CREATE
exports.createBooking = async (req, res) => {
  try {
    const { tour: tourId, participants } = req.body;

    // Fetch the tour to get priceTiers and current seat info
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });
    }

    // Calculate total amount and total participants
    let totalAmount = 0;
    let totalParticipants = 0;
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
      totalParticipants += participant.count;
    }

    // Check if there are enough available seats
    if (tour.availableSeats < totalParticipants) {
      return res.status(400).json({
        success: false,
        message: `Not enough seats available. Required: ${totalParticipants}, Available: ${tour.availableSeats}`,
      });
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
    
    // Update tour booked seats
    const updateResult = await updateTourSeatsHelper(tourId, totalParticipants);
    if (!updateResult.success) {
      // If updating seats fails, consider rolling back the booking or marking it for review
      console.error(
        `Failed to update seats for tour ${tourId} after booking ${booking._id}: ${updateResult.message}`
      );
      // For now, we'll proceed, but in a production system, you might want to:
      // - Delete the newly created booking: await Booking.findByIdAndDelete(booking._id);
      // - Mark the booking with a specific status like "pending_seat_allocation_failure"
      // - Rollback the entire transaction if using MongoDB transactions
    }

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