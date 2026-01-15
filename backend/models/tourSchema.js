// models/tourSchema.js - Simplified
const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A tour must have a title'],
      trim: true,
      maxlength: [80, 'Title must not exceed 80 characters'],
      minlength: [5, 'Title must have at least 5 characters'],
    },
    destination: {
      type: String,
      required: [true, 'A tour must have a destination'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'A tour must have a country'],
      enum: ['Dubai', 'Greece', 'Indonesia', 'Turkey', 'Thailand'],
      trim: true,
    },
    startDate: {
      type: String,
      required: [true, 'A tour must have a start date'],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'A tour must have at least one image'],
      validate: {
        validator: (arr) => arr && arr.length > 0,
        message: 'At least one image is required'
      }
    },
    duration: {
      type: String,
      required: [true, 'A tour must have a duration'],
    },
    groupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
      min: [1, 'Group size must be at least 1']
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    pricePerMonth: {
      type: Number,
      min: [0, 'Price per month cannot be negative'],
      required: [true, 'A tour must have a monthly payment price'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    rating: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    highlights: {
      type: [{
        text: {
          type: String,
          required: [true, 'Highlight must have text']
        },
        media: {
          type: String,
          default: null
        },
        mediaType: {
          type: String,
          enum: [null, 'image', 'video'],
          default: null
        }
      }],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bookedSeats: {
      type: Number,
      default: 0,
      min: [0, 'Booked seats cannot be negative']
    },
    availableSeats: {
      type: Number,
      min: [0, 'Available seats cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate available seats before saving
tourSchema.pre('save', function (next) {
  // Ensure groupSize and pricePerMonth are numbers
  if (typeof this.groupSize === 'string') {
    this.groupSize = parseInt(this.groupSize) || 0;
  }

  if (typeof this.pricePerMonth === 'string') {
    this.pricePerMonth = parseFloat(this.pricePerMonth) || 0;
  }

  // Calculate available seats
  this.availableSeats = Math.max(0, this.groupSize - this.bookedSeats);

  // Ensure bookedSeats doesn't exceed groupSize
  if (this.bookedSeats > this.groupSize) {
    this.bookedSeats = this.groupSize;
  }

  next();
});

// Virtuals
tourSchema.virtual('seatInfo').get(function () {
  return {
    totalSeats: this.groupSize,
    bookedSeats: this.bookedSeats,
    availableSeats: Math.max(0, this.groupSize - this.bookedSeats)
  };
});

tourSchema.virtual('monthlyPaymentInfo').get(function () {
  if (!this.price || !this.pricePerMonth) return null;

  const monthsRequired = Math.ceil(this.price / this.pricePerMonth);
  const lastPayment = this.price - (this.pricePerMonth * (monthsRequired - 1));

  return {
    totalPrice: this.price,
    monthlyPrice: this.pricePerMonth,
    monthsRequired,
    lastPayment
  };
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;