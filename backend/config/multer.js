// config/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Ensure upload directories exist
const tourPackagesDir = "uploads/tour-packages";
const tourHighlightsDir = "uploads/tour-highlights";
const testimonialsDir = "uploads/testimonials";
const testimonialUserPicsDir = "uploads/testimonials/user-pics";
const testimonialMediaDir = "uploads/testimonials/media";
const packageInquiriesDir = "uploads/inquiry-packages";

[tourPackagesDir, tourHighlightsDir, testimonialsDir, testimonialUserPicsDir, testimonialMediaDir, packageInquiriesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Dynamic storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on field name
    if (file.fieldname === 'images' || file.fieldname === 'image') {
      cb(null, tourPackagesDir);
    } else if (file.fieldname === 'highlightMedia') {
      cb(null, tourHighlightsDir);
    } else if (file.fieldname === 'userProfilePic') {
      cb(null, testimonialUserPicsDir);
    } else if (file.fieldname === 'media') {
      // Check route to determine if it's testimonial or package inquiry media
      if (req.baseUrl.includes('testimonials')) {
        cb(null, testimonialMediaDir);
      } else if (req.baseUrl.includes('inquiry-packages')) {
        cb(null, packageInquiriesDir);
      } else {
        cb(null, 'uploads/');
      }
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter - allow all image and video types
const fileFilter = (req, file, cb) => {
  // Accept all image and video MIME types
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    return cb(null, true);
  }

  cb(new Error(`Invalid file type for ${file.fieldname}. Only images and videos are allowed.`));
};

// Multer instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
  },
  fileFilter: fileFilter,
});

// Upload configurations
const uploadTourImages = upload.fields([
  { name: 'images', maxCount: 10 }, // Multiple tour images
  { name: 'highlightMedia', maxCount: 10 } // Multiple highlight media files
]);

// Single image upload (backward compatibility)
const uploadSingleTourImage = upload.single('image');

// Testimonial media upload
const uploadTestimonialMedia = upload.fields([
  { name: 'userProfilePic', maxCount: 1 }, // Single user profile picture
  { name: 'media', maxCount: 10 } // Multiple testimonial media files (images/videos)
]);

// Package inquiry media upload (allow multiple images/videos)
const uploadPackageMedia = upload.array('media', 10);

module.exports = {
  uploadTourImages,
  uploadSingleTourImage,
  uploadTestimonialMedia,
  uploadPackageMedia,
  storage,
};