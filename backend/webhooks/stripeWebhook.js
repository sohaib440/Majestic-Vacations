// webhooks/stripeWebhook.js
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const bodyParser = require("body-parser");

const Payment = require("../models/paymentSchema");
const Booking = require("../models/booking.model");
const Tour = require("../models/tourSchema");

console.log("🚀 Stripe Webhook route initialized");

router.post(
  "/",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log(`✅ Webhook verified: ${event.type}`);
    } catch (err) {
      console.error("❌ Signature verification failed:", err.message);
      return res.status(400).send("Webhook Error");
    }

    // ─────────────────────────────────────────────
    // CHECKOUT COMPLETED
    // ─────────────────────────────────────────────
    if (event.type === "checkout.session.completed") {
      const stripeSession = event.data.object;

      const bookingId = stripeSession.metadata?.bookingId;
      const paymentPlan = stripeSession.metadata?.paymentPlan || "full";

      if (!bookingId) {
        console.error("❌ bookingId missing in metadata");
        return res.json({ received: true });
      }

      try {
        // 1️⃣ UPDATE PAYMENT
        let payment = await Payment.findOne({
          providerPaymentId: stripeSession.id,
        });

        if (!payment) {
          payment = await Payment.create({
            booking: bookingId,
            provider: "stripe",
            providerPaymentId: stripeSession.id,
            amount: stripeSession.amount_total / 100,
            currency: stripeSession.currency,
            status: "succeeded",
            paymentPlan,
            paidAt: new Date(),
          });
          console.log(`💾 Payment created: ${payment._id}`);
        } else if (payment.status !== "succeeded") {
          payment.status = "succeeded";
          payment.paidAt = new Date();
          await payment.save();
          console.log(`💾 Payment updated to succeeded: ${payment._id}`);
        }

        // 2️⃣ UPDATE BOOKING
        const booking = await Booking.findById(bookingId).populate("tour");
        if (!booking) {
          console.error("❌ Booking not found:", bookingId);
          return res.json({ received: true });
        }

        // ⛔ Prevent duplicate processing
        if (booking.paymentStatus === "paid") {
          console.log("ℹ️ Booking already paid, skipping seat allocation");
          return res.json({ received: true });
        }

        console.log(
          `📋 Booking before update: Status=${booking.bookingStatus}, Payment=${booking.paymentStatus}`
        );

        if (paymentPlan === "monthly") {
          booking.paymentStatus = "partial";
          await booking.save();
          console.log("📊 Monthly payment recorded");
        } else {
          // Full payment
          booking.paymentStatus = "paid";
          booking.bookingStatus = "confirmed";

          // Ensure tour exists
          if (!booking.tour) {
            throw new Error("Tour not found for this booking");
          }

          // 3️⃣ ATOMIC SEAT ALLOCATION
          const tour = await Tour.findOneAndUpdate(
            {
              _id: booking.tour._id,
              bookedSeats: { $lte: booking.tour.groupSize - booking.seatsBooked },
            },
            { $inc: { bookedSeats: booking.seatsBooked } },
            { new: true }
          );

          if (!tour) {
            console.error("❌ Seat allocation failed: Overbooking detected");
            return res.status(400).json({
              success: false,
              message: "Seat allocation failed: Overbooking detected",
            });
          }

          console.log(
            `🎟 Seats allocated: ${booking.seatsBooked} | ${tour.bookedSeats}/${tour.groupSize}`
          );
          await booking.save();
        }

        console.log(
          `✅ Booking updated successfully: Status=${booking.bookingStatus}, Payment=${booking.paymentStatus}`
        );
      } catch (err) {
        console.error("❌ Webhook processing error:", err);
      }
    }

    // ─────────────────────────────────────────────
    // PAYMENT FAILED
    // ─────────────────────────────────────────────
    if (event.type === "payment_intent.payment_failed") {
      await Payment.findOneAndUpdate(
        { providerPaymentId: event.data.object.id },
        { status: "failed" }
      );
      console.log("❌ Payment marked as failed");
    }

    // ─────────────────────────────────────────────
    // REFUND
    // ─────────────────────────────────────────────
    if (event.type === "charge.refunded") {
      await Payment.findOneAndUpdate(
        { providerPaymentId: event.data.object.payment_intent },
        { status: "refunded" }
      );
      console.log("🔄 Payment refunded");
    }

    res.json({ received: true });
  }
);

module.exports = router;
