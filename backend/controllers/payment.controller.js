
const Payment = require("../models/paymentSchema");
const Booking = require("../models/booking.model");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const paypal = require("paypal-rest-sdk");

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

exports.createPayment = async (req, res) => {
  try {
    const { bookingId, provider, paymentPlan, installmentNumber } = req.body;

    console.log("🔄 Creating payment →", { 
      bookingId, 
      provider, 
      paymentPlan, 
      installmentNumber 
    });

    const booking = await Booking.findById(bookingId).populate("tour");
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    console.log(`📋 Booking found: ${booking.bookingReference}, Status: ${booking.bookingStatus}`);
    console.log(`💰 Payment Status: ${booking.paymentStatus}, Seats: ${booking.seatsBooked}`);

    // Validate booking eligibility
    if (booking.bookingStatus !== "pending" || booking.paymentStatus !== "unpaid") {
      console.log(`❌ Booking not eligible: Status=${booking.bookingStatus}, Payment=${booking.paymentStatus}`);
      return res.status(400).json({ 
        success: false, 
        message: "Booking not eligible for payment" 
      });
    }

    // Calculate amount
    let amount = paymentPlan === "full"
      ? booking.pricing.totalAmount
      : booking.pricing.monthlyAmount;

    console.log(`💵 Calculated amount: ${amount} ${booking.pricing.currency}`);

    if (paymentPlan === "monthly") {
      if (installmentNumber > booking.pricing.monthsRequired) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid installment number" 
        });
      }
      console.log(`📅 Monthly payment: Installment ${installmentNumber} of ${booking.pricing.monthsRequired}`);
    }

    amount = Math.round(amount * 100); // Convert to cents

    let paymentData;
    let clientResponse;

    // STRIPE PAYMENT
    if (provider === "stripe") {
      console.log(`💳 Processing Stripe payment for ${booking.bookingReference}`);
      
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
          installmentNumber: installmentNumber || "1",
          seatsBooked: booking.seatsBooked.toString(),
          tourId: booking.tour?._id?.toString() || ""
        },
      });

      console.log(`✅ Stripe session created: ${session.id}`);
      console.log(`🔗 Checkout URL: ${session.url}`);

      paymentData = {
        booking: booking._id,
        provider: "stripe",
        providerPaymentId: session.id,
        amount: amount / 100,
        currency: booking.pricing.currency,
        status: "created",
        paymentPlan,
        installmentNumber: installmentNumber || 1,
        metadata: {
          bookingReference: booking.bookingReference,
          seatsBooked: booking.seatsBooked,
          tourTitle: booking.tour?.title
        }
      };

      clientResponse = { 
        checkoutUrl: session.url,
        sessionId: session.id
      };
    }
    // PAYPAL PAYMENT
    else if (provider === "paypal") {
      console.log(`💰 Processing PayPal payment for ${booking.bookingReference}`);
      
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
      
      console.log(`✅ PayPal payment created: ${paypalPayment.id}`);
    }
    else {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment provider" 
      });
    }

    // Save payment record
    const savedPayment = await Payment.create(paymentData);
    console.log(`💾 Payment record saved: ${savedPayment._id}`);

    // Update booking for monthly payments
    if (paymentPlan === "monthly") {
      booking.paymentStatus = "partial";
      await booking.save();
      console.log(`📊 Booking marked as partial payment`);
    }

    res.status(201).json({
      success: true,
      message: "Payment initiated successfully",
      data: savedPayment,
      clientData: clientResponse,
    });

  } catch (error) {
    console.error("❌ Payment creation error:", error.message);
    console.error(error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// GET ALL PAYMENTS
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "booking",
        populate: { path: "tour" }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET PAYMENT BY ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: "booking",
        populate: { path: "tour" }
      });

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: "Payment not found" 
      });
    }

    res.json({ 
      success: true, 
      data: payment 
    });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// UPDATE PAYMENT
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: "Payment not found" 
      });
    }

    // Sync booking status when payment succeeds
    if (payment.status === "succeeded") {
      const booking = await Booking.findById(payment.booking);
      if (booking) {
        booking.paymentStatus = payment.paymentPlan === "monthly" ? "partial" : "paid";
        
        // For full payments, confirm booking and allocate seats
        if (payment.paymentPlan === "full" && booking.bookingStatus === "pending") {
          booking.bookingStatus = "confirmed";
          
          // Allocate seats
          const Tour = require("../models/tourSchema");
          await Tour.findByIdAndUpdate(
            booking.tour,
            { $inc: { bookedSeats: booking.seatsBooked } }
          );
          
          console.log(`✅ Manual update: Seats allocated for booking ${booking.bookingReference}`);
        }
        
        await booking.save();
      }
    }

    res.json({ 
      success: true, 
      message: "Payment updated successfully",
      data: payment 
    });
  } catch (error) {
    console.error("Update payment error:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// DELETE PAYMENT
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: "Payment not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Payment deleted successfully" 
    });
  } catch (error) {
    console.error("Delete payment error:", error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};
