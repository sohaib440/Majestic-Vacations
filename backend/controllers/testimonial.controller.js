const Testimonial = require("../models/testimonial");
const fs = require("fs");
const path = require("path");

/**
 * CREATE Testimonial with Media Upload
 */
const createTestimonial = async (req, res) => {
  try {
    const { name, content, rating, company, destination, tripType, travelerLocation } = req.body;

    // Validate required fields
    if (!name || !content) {
      return res.status(400).json({
        success: false,
        message: "Name and content are required",
      });
    }

    // Handle user profile picture
    let userProfilePic = null;
    if (req.files && req.files.userProfilePic) {
      userProfilePic = `/uploads/testimonials/user-pics/${req.files.userProfilePic[0].filename}`;
    }

    // Handle media files (gallery)
    const media = [];

    if (req.files && req.files.media) {
      const mediaFiles = Array.isArray(req.files.media) ? req.files.media : [req.files.media];

      mediaFiles.forEach((file) => {
        const fileType = file.mimetype.startsWith("image/") ? "image" : "video";
        media.push({
          type: fileType,
          url: `/uploads/testimonials/media/${file.filename}`,
        });
      });
    }

    const testimonialData = {
      name: name.trim(),
      content: content.trim(),
      rating: rating || 5,
      company: company?.trim(),
      destination: destination?.trim(),
      tripType: tripType?.trim(),
      userProfilePic,
      media,
    };

    // Parse travelerLocation if it's a string
    if (travelerLocation) {
      try {
        testimonialData.travelerLocation =
          typeof travelerLocation === "string"
            ? JSON.parse(travelerLocation)
            : travelerLocation;
      } catch {
        testimonialData.travelerLocation = travelerLocation;
      }
    }

    const testimonial = await Testimonial.create(testimonialData);

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    // Delete uploaded files on error
    if (req.files) {
      if (req.files.userProfilePic) {
        const filePath = path.join("uploads/testimonials/user-pics", req.files.userProfilePic[0].filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      if (req.files.media) {
        const mediaFiles = Array.isArray(req.files.media) ? req.files.media : [req.files.media];
        mediaFiles.forEach((file) => {
          const filePath = path.join("uploads/testimonials/media", file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET All Testimonials
 */
const getAllTestimonials = async (req, res) => {
  try {
    const filter = { isDeleted: false };

    const testimonials = await Testimonial.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: testimonials,
      total: testimonials.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET Single Testimonial
 */
const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * UPDATE Testimonial with Media
 */
const updateTestimonial = async (req, res) => {
  try {
    const { name, content, rating, company, destination, tripType, travelerLocation } = req.body;
    const testimonial = await Testimonial.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!testimonial) {
      // Delete uploaded files on error
      if (req.files) {
        if (req.files.userProfilePic) {
          const filePath = path.join("uploads/testimonials/user-pics", req.files.userProfilePic[0].filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        if (req.files.media) {
          const mediaFiles = Array.isArray(req.files.media) ? req.files.media : [req.files.media];
          mediaFiles.forEach((file) => {
            const filePath = path.join("uploads/testimonials/media", file.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
        }
      }

      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    // Update basic fields
    if (name) testimonial.name = name.trim();
    if (content) testimonial.content = content.trim();
    if (rating) testimonial.rating = rating;
    if (company) testimonial.company = company.trim();
    if (destination) testimonial.destination = destination.trim();
    if (tripType) testimonial.tripType = tripType.trim();

    // Handle travelerLocation
    if (travelerLocation) {
      testimonial.travelerLocation =
        typeof travelerLocation === "string"
          ? JSON.parse(travelerLocation)
          : travelerLocation;
    }

    // Handle user profile picture update
    if (req.files && req.files.userProfilePic) {
      // Delete old user profile pic if exists
      if (testimonial.userProfilePic) {
        const oldPicPath = `uploads${testimonial.userProfilePic}`;
        if (fs.existsSync(oldPicPath)) {
          fs.unlinkSync(oldPicPath);
        }
      }
      testimonial.userProfilePic = `/uploads/testimonials/user-pics/${req.files.userProfilePic[0].filename}`;
    }

    // Handle new media files (gallery)
    if (req.files && req.files.media) {
      const mediaFiles = Array.isArray(req.files.media) ? req.files.media : [req.files.media];

      mediaFiles.forEach((file) => {
        const fileType = file.mimetype.startsWith("image/") ? "image" : "video";
        testimonial.media.push({
          type: fileType,
          url: `/uploads/testimonials/media/${file.filename}`,
        });
      });
    }

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    // Delete uploaded files on error
    if (req.files) {
      if (req.files.userProfilePic) {
        const filePath = path.join("uploads/testimonials/user-pics", req.files.userProfilePic[0].filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      if (req.files.media) {
        const mediaFiles = Array.isArray(req.files.media) ? req.files.media : [req.files.media];
        mediaFiles.forEach((file) => {
          const filePath = path.join("uploads/testimonials/media", file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Testimonial with Media Cleanup
 */
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    // Delete associated media files
    if (testimonial.media && testimonial.media.length > 0) {
      testimonial.media.forEach((mediaItem) => {
        const filePath = path.join(".", mediaItem.url.replace(/^\//, ""));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    // Soft delete the testimonial
    testimonial.isDeleted = true;
    testimonial.deletedAt = new Date();
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE Media from Testimonial
 */
const deleteTestimonialMedia = async (req, res) => {
  try {
    const { id, mediaIndex } = req.params;
    const testimonial = await Testimonial.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    const media = testimonial.media[mediaIndex];
    if (!media) {
      return res
        .status(404)
        .json({ success: false, message: "Media not found" });
    }

    // Delete file from server
    const filePath = path.join(".", media.url.replace(/^\//, ""));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from media array
    testimonial.media.splice(mediaIndex, 1);
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Media deleted successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * APPROVE/REJECT Testimonial (Admin Only)
 */


module.exports = {
  createTestimonial,
  getAllTestimonials,
  getTestimonialById,
  updateTestimonial,
  deleteTestimonial,
  deleteTestimonialMedia,
};
