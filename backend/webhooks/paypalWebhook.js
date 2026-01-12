// webhooks/paypalWebhook.js
const express = require("express");
const router = express.Router();
const Payment = require("../models/paymentSchema");
const Booking = require("../models/booking.model");
const Tour = require("../models/tourSchema");

router.post("/", async (req, res) => {
  try {
    const { event_type, resource } = req.body;
    
    if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const paymentId = resource.id;
      
      // Find payment by PayPal ID
      const payment = await Payment.findOne({ providerPaymentId: paymentId, provider: "paypal" });
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      // Only process if not already succeeded
      if (payment.status !== "succeeded") {
        payment.status = "succeeded";
        payment.paidAt = new Date();
        await payment.save();
        
        // Update booking and seats
        const booking = await Booking.findById(payment.booking).populate("tour");
        if (booking) {
          // Update payment status
          booking.paymentStatus = payment.paymentPlan === "monthly" ? "partial" : "paid";
          
          // If full payment, confirm booking and update seats
          if (payment.paymentPlan === "full" && booking.paymentStatus === "paid") {
            booking.bookingStatus = "confirmed";
            
            // Update tour seats
            if (booking.tour && booking.seatsBooked > 0) {
              const tourId = booking.tour._id || booking.tour;
              
              await Tour.findByIdAndUpdate(
                tourId,
                { $inc: { bookedSeats: booking.seatsBooked } },
                { new: true }
              );
            }
          }
          
          await booking.save();
        }
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;