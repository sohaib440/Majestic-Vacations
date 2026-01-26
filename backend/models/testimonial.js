const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    thumbnail: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    company: {
      type: String,
      trim: true,
    },

    travelerLocation: {
      city: { type: String, trim: true },
      country: { type: String, trim: true },
    },

    destination: {
      type: String,
      trim: true,
    },

    tripType: {
      type: String,
      trim: true, 
    },

    media: [mediaSchema], 

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
  }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
