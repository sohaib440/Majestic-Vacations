const mongoose = require('mongoose');

const vacationRentalInquriesSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, 'User name is required']
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
      lowercase: true
    },
    userPhone: {
      type: String,
      trim: true
    },
    packageName: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
      minlength: [3, 'Package name must have at least 3 characters'],
      maxlength: [100, 'Package name must not exceed 100 characters']
    },
    numberOfDays: {
      type: Number,
      required: [true, 'Number of days is required'],
      min: [1, 'Number of days must be at least 1'],
      max: [365, 'Number of days cannot exceed 365']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      validate: {
        validator: function(value) {
          return value >= new Date();
        },
        message: 'Start date must be in the future'
      }
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(value) {
          return value >= this.startDate;
        },
        message: 'End date must be after or equal to start date'
      }
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required']
    },

  },
  { timestamps: true }
);

// Middleware to calculate total price if not provided
vacationRentalInquriesSchema.pre('save', function(next) {
  if (!this.totalPrice && this.pricePerDay && this.numberOfDays) {
    this.totalPrice = this.pricePerDay * this.numberOfDays;
  }
  next();
});

// Index for better query performance
vacationRentalInquriesSchema.index({ user: 1 });
vacationRentalInquriesSchema.index({ status: 1 });
vacationRentalInquriesSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model('VacationRentalInquries', vacationRentalInquriesSchema);
