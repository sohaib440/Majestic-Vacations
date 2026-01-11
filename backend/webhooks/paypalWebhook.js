// webhooks/paypalWebhook.js
const express = require("express");
const router = express.Router();
const Payment = require("../models/paymentSchema");
const Booking = require("../models/booking.model");

router.post("/", async (req, res) => {
  const { resource, event_type } = req.body;

  if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const paymentId = resource.id;
    const payment = await Payment.findOne({ providerPaymentId: paymentId });

    if (payment && payment.status !== "succeeded") {
      payment.status = "succeeded";
      payment.paidAt = new Date();
      await payment.save();

      const booking = await Booking.findById(payment.booking);
      if (booking) {
        booking.paymentStatus = payment.paymentPlan === "monthly" ? "partial" : "paid";
        if (booking.paymentStatus === "paid") {
          await booking.confirmBooking(); // Calls your method to confirm and update seats
        }
        await booking.save();
      }
    }
  }

  res.json({ received: true });
});

module.exports = router;