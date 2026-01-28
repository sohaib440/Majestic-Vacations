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

const inquiryPackagesSchema = new mongoose.Schema(
    {
        packageName: {
            type: String,
            required: true,
            trim: true,
        },
        packageDescription: {
            type: String,
            trim: true,
            maxlength: 2000,
        },
        location: {
            type: String,
            trim: true,
        },
        packageAveragePrice: {
            type: Number,
            min: 0,
            default: 0,
        },
        
        media: [mediaSchema],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
     isDeleated: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

const InquiryPackages = mongoose.model('InquiryPackages', inquiryPackagesSchema);

module.exports = InquiryPackages;