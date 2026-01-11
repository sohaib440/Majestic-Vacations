// models/tourSchema.js
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
    startDate: {  // Changed from 'date' to 'startDate'
      type: String,
      required: [true, 'A tour must have a start date'],
      trim: true,
    },
    images: {  // Changed from 'image' to 'images' (array)
      type: [String],
      required: [true, 'A tour must have at least one image'],
      validate: {
        validator: function(arr) {
          return arr && arr.length > 0;
        },
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
    // Regular price
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    // New field: price per month
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
    highlights: {  // Enhanced highlights structure
      type: [{
        text: {
          type: String,
          required: [true, 'Highlight must have text']
        },
        media: {
          type: String,  // URL for image or video
          default: null
        },
        mediaType: {
          type: String,
          enum: [null, 'image', 'video'],
          default: null
        }
      }],
      default: [],
      validate: {
        validator: function(arr) {
          // Validate that each highlight has text if provided
          return arr.every(h => h && h.text && h.text.trim().length > 0);
        },
        message: 'Each highlight must have text content'
      }
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate available seats before saving
tourSchema.pre('save', function (next) {
  // Ensure groupSize is a number
  if (typeof this.groupSize === 'string') {
    this.groupSize = parseInt(this.groupSize) || 0;
  }

  // Calculate available seats
  this.availableSeats = Math.max(0, this.groupSize - this.bookedSeats);

  // Ensure bookedSeats doesn't exceed groupSize
  if (this.bookedSeats > this.groupSize) {
    this.bookedSeats = this.groupSize;
  }

  // Ensure pricePerMonth is valid
  if (typeof this.pricePerMonth === 'string') {
    this.pricePerMonth = parseFloat(this.pricePerMonth) || 0;
  }

  next();
});

// Virtual for seat information (more reliable than pre-save)
tourSchema.virtual('seatInfo').get(function () {
  return {
    totalSeats: this.groupSize,
    bookedSeats: this.bookedSeats,
    availableSeats: Math.max(0, this.groupSize - this.bookedSeats)
  };
});

// Virtual for calculating monthly payment info
tourSchema.virtual('monthlyPaymentInfo').get(function () {
  if (!this.price || !this.pricePerMonth) return null;
  
  const totalPrice = this.price;
  const monthlyPrice = this.pricePerMonth;
  const monthsRequired = Math.ceil(totalPrice / monthlyPrice);
  
  return {
    totalPrice,
    monthlyPrice,
    monthsRequired,
    lastPayment: totalPrice - (monthlyPrice * (monthsRequired - 1))
  };
});

// Indexes
tourSchema.index({ country: 1 });
tourSchema.index({ startDate: 1 }); // Updated index
tourSchema.index({ featured: 1 });
tourSchema.index({ price: 1 });
tourSchema.index({ pricePerMonth: 1 }); // New index
tourSchema.index({ availableSeats: 1 });
tourSchema.index({ createdAt: -1 });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;