const Payment = require("../models/paymentSchema");
const Booking = require("../models/booking.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const paypal = require("paypal-rest-sdk");

// Configure PayPal (remains the same)
paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

exports.createPayment = async (req, res) => {
  try {
    const { bookingId, provider, paymentPlan,installmentNumber} = req.body;

    console.log("Creating payment →", { bookingId, provider, paymentPlan });

    const booking = await Booking.findById(bookingId).populate("tour");
    console.log("the booking is ",booking)
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.bookingStatus !== "pending" || booking.paymentStatus !== "unpaid") {
      return res.status(400).json({ success: false, message: "Booking not eligible for payment" });
    }

    // Calculate amount
    let amount = paymentPlan === "full"
      ? booking.pricing.totalAmount
      : booking.pricing.monthlyAmount;

    if (paymentPlan === "monthly" && installmentNumber > booking.pricing.monthsRequired) {
      return res.status(400).json({ success: false, message: "Invalid installment number" });
    }

    amount = Math.round(amount * 100); // cents

    let paymentData;
    let clientResponse;

    if (provider === "stripe") {
      // ── STRIPE CHECKOUT SESSION (hosted page) ──
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: booking.pricing.currency.toLowerCase() || 'usd',
            product_data: {
              name: `Booking ${booking.bookingReference} - ${booking.tour?.title || 'Tour'}`,
              description: `${booking.seatsBooked} seat(s) • ${booking.tour?.destination || ''}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
        cancel_url: `${process.env.FRONTEND_URL}/booking/cancel?bookingId=${bookingId}`,
        metadata: {
          bookingId: booking._id.toString(),
          bookingReference: booking.bookingReference,
          paymentPlan,
          installmentNumber
        },
      });

      paymentData = {
        booking: booking._id,
        provider: "stripe",
        providerPaymentId: session.id,
        amount: amount / 100,
        currency: booking.pricing.currency,
        status: "created",
        paymentPlan,
        installmentNumber,
      };

      clientResponse = { checkoutUrl: session.url };
    }
    else if (provider === "paypal") {
      // Keep PayPal as redirect (you can also upgrade to PayPal Smart Buttons later)
      const createPaymentJson = {
        intent: "sale",
        payer: { payment_method: "paypal" },
        redirect_urls: {
          return_url: `${process.env.FRONTEND_URL}/payment/success?bookingId=${bookingId}`,
          cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?bookingId=${bookingId}`,
        },
        transactions: [{
          amount: {
            total: (amount / 100).toFixed(2),
            currency: booking.pricing.currency || "USD",
          },
          description: `Payment for booking ${booking.bookingReference} - ${paymentPlan}`,
        }],
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

      const approvalUrl = paypalPayment.links.find(link => link.rel === "approval_url")?.href;
      clientResponse = { approvalUrl };
    }
    else {
      return res.status(400).json({ success: false, message: "Invalid provider" });
    }

    // Save payment record
    await Payment.create(paymentData);

    // Mark as partial for monthly payments
    if (paymentPlan === "monthly") {
      booking.paymentStatus = "partial";
      await booking.save();
    }

    res.status(201).json({
      success: true,
      data: paymentData,
      clientData: clientResponse,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    res.status(500).json({ success: false, message: error.message });
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

