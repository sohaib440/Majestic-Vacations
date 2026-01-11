const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  userEmail: { type: String, required: true, unique: true, lowercase: true, index: true },
  userPassword: { type: String, required: true, minlength: 8, select: false },
  userRole: { type: String, enum: ["admin"]},
  userPermissions: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  loginAttempts: { type: Number, default: 0, select: false },
  lockUntil: { type: Date, select: false },
  passwordChangedAt: { type: Date },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false }
}, { timestamps: true });

// Password hashing
userSchema.pre("save", async function(next) {
  if (!this.isModified("userPassword")) return next();
  this.userPassword = await bcrypt.hash(this.userPassword, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Compare password
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.userPassword);
};

// Account lock
userSchema.methods.isLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model("User", userSchema);
