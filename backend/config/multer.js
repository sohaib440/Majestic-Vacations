// config/multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Ensure upload directories exist
const tourPackagesDir = "uploads/tour-packages";
const tourHighlightsDir = "uploads/tour-highlights";

[tourPackagesDir, tourHighlightsDir].forEach(dir => {
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
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter - allow only images and videos for highlights
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
  const allowedVideoTypes = /mp4|mov|avi|wmv|flv|mkv/;

  const extname = path.extname(file.originalname).toLowerCase().replace('.', '');

  // Check field name to determine allowed types
  if (file.fieldname === 'images' || file.fieldname === 'image') {
    // Only images for tour packages
    if (allowedImageTypes.test(extname) && file.mimetype.startsWith('image/')) {
      return cb(null, true);
    }
  } else if (file.fieldname === 'highlightMedia') {
    // Both images and videos for highlights
    if ((allowedImageTypes.test(extname) && file.mimetype.startsWith('image/')) ||
      (allowedVideoTypes.test(extname) && file.mimetype.startsWith('video/'))) {
      return cb(null, true);
    }
  }

  cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: images (for tours) or images/videos (for highlights)`));
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

module.exports = {
  uploadTourImages,
  uploadSingleTourImage,
  storage,
};