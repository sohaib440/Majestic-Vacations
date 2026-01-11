// webhooks/stripeWebhook.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Payment = require("../models/paymentSchema");
const Booking = require("../models/booking.model");

router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;

    const payment = await Payment.findOne({ providerPaymentId: intent.id });
    if (payment && payment.status !== "succeeded") {
      payment.status = "succeeded";
      payment.paidAt = new Date();
      await payment.save();

      // Update booking
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