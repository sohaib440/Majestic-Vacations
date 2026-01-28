// models/paymentSchema.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    provider: { type: String, enum: ["stripe", "paypal", "affirm", "klarna"], required: true },
    providerPaymentId: { type: String, unique: true, sparse: true, index: true },
    providerSessionId: String,
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["created", "pending", "succeeded", "failed", "refunded"], default: "created", index: true },
    paymentPlan: { type: String, enum: ["full", "monthly"], required: true },
    installmentNumber: { type: Number, min: 1 },
    metadata: Object,
    paidAt: Date,
  },
  { timestamps: true }
);

paymentSchema.pre("save", function (next) {
  if (this.status === "succeeded" && !this.paidAt) this.paidAt = new Date();
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);