// controllers/payment.controller.js
const Payment = require("../models/paymentSchema");
const Booking = require("../models/booking.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const paypal = require("paypal-rest-sdk");

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox", // 'sandbox' or 'live'
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

// CREATE PAYMENT (Updated to handle Stripe/PayPal integration)
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, provider, paymentPlan, installmentNumber } = req.body;

    // Fetch and validate booking
    const booking = await Booking.findById(bookingId).populate("tour");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (booking.bookingStatus !== "pending" || booking.paymentStatus !== "unpaid") {
      return res.status(400).json({ success: false, message: "Booking not eligible for payment" });
    }

    // Calculate amount based on payment plan
    let amount = booking.pricing.totalAmount; // Default to full
    if (paymentPlan === "monthly" && booking.pricing.monthlyAmount) {
      amount = booking.pricing.monthlyAmount;
      if (installmentNumber > booking.pricing.monthsRequired) {
        return res.status(400).json({ success: false, message: "Invalid installment number" });
      }
    }
    amount = Math.round(amount * 100); // Convert to cents/pence for gateways

    let paymentData;
    let clientResponse;

    if (provider === "stripe") {
      // Create Stripe Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Stripe expects amount in smallest unit (e.g., cents)
        currency: booking.pricing.currency.toLowerCase() || "usd",
        metadata: { bookingId: booking._id.toString(), paymentPlan },
        automatic_payment_methods: { enabled: true },
      });

      paymentData = {
        booking: booking._id,
        provider: "stripe",
        providerPaymentId: paymentIntent.id,
        amount: amount / 100,
        currency: booking.pricing.currency,
        status: "created",
        paymentPlan,
        installmentNumber,
      };

      clientResponse = { clientSecret: paymentIntent.client_secret };
    } else if (provider === "paypal") {
      // Create PayPal Order
      const createPaymentJson = {
        intent: "sale",
        payer: { payment_method: "paypal" },
        redirect_urls: {
          return_url: `${process.env.FRONTEND_URL}/payment/success`, // Your frontend success page
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`, // Your frontend cancel page
        },
        transactions: [
          {
            amount: {
              total: (amount / 100).toFixed(2),
              currency: booking.pricing.currency || "USD",
            },
            description: `Payment for booking ${booking.bookingReference} - ${paymentPlan}`,
          },
        ],
      };

      const paypalPayment = await new Promise((resolve, reject) => {
        paypal.payment.create(createPaymentJson, (error, payment) => {
          if (error) reject(error);
          else resolve(payment);
        });
      });

      paymentData = {
        booking: booking._id,
        provider: "paypal",
        providerPaymentId: paypalPayment.id,
        amount: amount / 100,
        currency: booking.pricing.currency,
        status: "created",
        paymentPlan,
        installmentNumber,
      };

      // Find approval URL for frontend redirect
      const approvalUrl = paypalPayment.links.find(link => link.rel === "approval_url").href;
      clientResponse = { approvalUrl };
    } else {
      return res.status(400).json({ success: false, message: "Invalid provider" });
    }

    // Create payment document
    const payment = await Payment.create(paymentData);

    // Update booking to partial if monthly
    if (paymentPlan === "monthly") {
      booking.paymentStatus = "partial";
      await booking.save();
    }

    res.status(201).json({
      success: true,
      data: payment,
      clientData: clientResponse, // Send to frontend for processing
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET ALL
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("booking")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET BY ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("booking");

    if (!payment)
      return res.status(404).json({ success: false, message: "Payment not found" });

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!payment)
      return res.status(404).json({ success: false, message: "Payment not found" });

    // Sync booking status
    if (payment.status === "succeeded") {
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: "paid",
      });
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment)
      return res.status(404).json({ success: false, message: "Payment not found" });

    res.json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};