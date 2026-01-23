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
    endDate: {
      type: String,
      required: [true, 'A tour must have an end date'],
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
    priceTiers: [
      {
        ageGroup: {
          type: String,
          required: true,
        },
        ageRange: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
      },
    ],
    rating: {
      type: Number,
      default: 4.8,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
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
    availableSeats: { // Now directly managed by admin
      type: Number,
      required: [true, 'Available seats is required'],
      min: [0, 'Available seats cannot be negative'],
      default: 0,
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

// Pre-save hook to ensure bookedSeats does not exceed availableSeats
tourSchema.pre('save', function (next) {
  // Ensure bookedSeats does not exceed availableSeats
  if (this.bookedSeats > this.availableSeats) {
    this.bookedSeats = this.availableSeats; // Cap bookedSeats at availableSeats
  }
  next();
});

// Virtuals
tourSchema.virtual('seatInfo').get(function () {
  return {
    totalSeats: this.groupSize, // groupSize can still be used for informational purposes
    bookedSeats: this.bookedSeats,
    availableSeats: this.availableSeats - this.bookedSeats >= 0 ? this.availableSeats - this.bookedSeats : 0 // Remaining seats from admin-set availableSeats
  };
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;