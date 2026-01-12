// webhooks/stripeWebhook.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Payment = require("../models/paymentSchema");
const Booking = require("../models/booking.model");
const Package =require("../models/tourSchema")
// IMPORTANT: Use raw body parser for Stripe signature verification
const bodyParser = require("body-parser");

// Log when webhook module loads
console.log("🚀 Stripe Webhook route initialized - listening for events");

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }), // MUST be raw for signature
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log(`[Webhook] ✅ Event verified: ${event.type} (ID: ${event.id})`);
    } catch (err) {
      console.error(`[Webhook] ❌ Signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ──────────────────────────────────────────────────────────────
    // Handle successful Checkout payment (most important event)
    // ──────────────────────────────────────────────────────────────
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      console.log(`[Webhook] 💰 Checkout completed! Session: ${session.id}`);
      console.log(`[Webhook] Booking ID from metadata: ${bookingId}`);

      if (!bookingId) {
        console.error("[Webhook] ❌ No bookingId found in session metadata");
        return res.sendStatus(200); // Still acknowledge
      }

      try {
        // 1. Find & update Payment record
        const payment = await Payment.findOne({
          providerPaymentId: session.id,
          booking: bookingId,
        });

        if (payment && payment.status !== "succeeded") {
          payment.status = "succeeded";
          payment.paidAt = new Date();
          await payment.save();
          console.log(`[Webhook] ✅ Payment ${payment._id} marked as succeeded`);
        }

        // 2. Find & update Booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
          console.error(`[Webhook] ❌ Booking not found: ${bookingId}`);
          return res.sendStatus(200);
        }

        // Prevent double-processing
        if (booking.paymentStatus === "paid") {
          console.log(`[Webhook] ℹ️ Booking already paid: ${booking.bookingReference}`);
          return res.sendStatus(200);
        }

        // Update based on payment plan
        if (payment?.paymentPlan === "monthly") {
          booking.paymentStatus = "partial";
          console.log(`[Webhook] Monthly partial payment recorded`);
        } else {
          booking.paymentStatus = "paid";
          booking.bookingStatus = "confirmed";

          // Reserve seats - most important business action
          await booking.confirmBooking();
          console.log(`[Webhook] 🎉 Booking FULLY confirmed: ${booking.bookingReference}`);
        }

        await booking.save();
        console.log(`[Webhook] 💾 Booking updated successfully`);
        // Optional: Trigger email (implement in real project)
        // await sendBookingConfirmationEmail(booking);

      } catch (err) {
        console.error("[Webhook] ❌ Error processing success:", err.message);
        // Still return 200 - Stripe will retry only on 4xx/5xx
      }
    }

    // ──────────────────────────────────────────────────────────────
    // Optional: Handle other useful events
    // ──────────────────────────────────────────────────────────────
    else if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object;
      console.log(`[Webhook] ❌ Payment failed: ${intent.id}`);
      // You could update payment.status = "failed"
    } else if (event.type === "charge.refunded") {
      console.log(`[Webhook] 🔄 Charge refunded: ${event.data.object.id}`);
      // Update statuses accordingly
    }

    // Always acknowledge receipt to Stripe
    res.json({ received: true });
  }
);

module.exports = router;