const cloudinary = require("../../../utils/cloudinary");
const fs = require("fs");
const UserProfile = require("../models/profile.models");

/**
 * Upload user avatar to Cloudinary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated profile data
 */
const uploadAvatar = async (req, res) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user.userId || req.user.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      // Clean up uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn("Temp file cleanup failed:", e.message);
      }
      
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed"
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (req.file.size > maxSize) {
      // Clean up uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn("Temp file cleanup failed:", e.message);
      }
      
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB"
      });
    }

    // Upload to Cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
        width: 300,
        height: 300,
        crop: "fill",
        quality: "auto",
        fetch_format: "auto",
        transformation: [
          { width: 300, height: 300, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ]
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      
      // Clean up uploaded file
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn("Temp file cleanup failed:", e.message);
      }
      
      return res.status(500).json({
        success: false,
        message: "Failed to upload image to cloud storage"
      });
    }

    // Clean up temporary file
    try {
      fs.unlinkSync(req.file.path);
      console.log("Temporary file cleaned up:", req.file.path);
    } catch (e) {
      console.warn("Temp file cleanup failed:", e.message);
      // Don't return error here, just log it
    }

    // Find existing profile
    let profile = await UserProfile.findOne({ userId: userId });

    // If profile exists and has old avatar, delete it from Cloudinary
    if (profile && profile.avatarUrl) {
      try {
        // Extract public_id from Cloudinary URL
        const oldAvatarUrl = profile.avatarUrl;
        const urlParts = oldAvatarUrl.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = `avatars/${publicIdWithExtension.split('.')[0]}`;
        
        // Delete old avatar from Cloudinary
        await cloudinary.uploader.destroy(publicId);
        console.log("Old avatar deleted from Cloudinary:", publicId);
      } catch (deleteError) {
        console.warn("Failed to delete old avatar from Cloudinary:", deleteError.message);
        // Don't fail the request if old avatar deletion fails
      }
    }

    // Update or create profile with new avatar URL
    const updatedProfile = await UserProfile.findOneAndUpdate(
      { userId: userId },
      { 
        $set: { 
          avatarUrl: result.secure_url,
          // Preserve other fields if they exist
        } 
      },
      { 
        new: true,           // Return updated document
        upsert: true,        // Create if doesn't exist
        runValidators: true  // Run model validations
      }
    ).populate("userId", "firstName lastName email")
     .lean();

    // Format response data with all fields
    const profileData = {
      ...updatedProfile,
      avatarUrl: updatedProfile.avatarUrl || null,
      // Ensure arrays are always returned
      skills: updatedProfile.skills || [],
      techStack: updatedProfile.techStack || [],
      interests: updatedProfile.interests || [],
      // Ensure all fields exist
      headline: updatedProfile.headline || "",
      bio: updatedProfile.bio || "",
      github: updatedProfile.github || "",
      linkedin: updatedProfile.linkedin || "",
      twitter: updatedProfile.twitter || "",
      portfolio: updatedProfile.portfolio || "",
      website: updatedProfile.website || "",
      company: updatedProfile.company || "",
      role: updatedProfile.role || "",
      experience: updatedProfile.experience || "",
      education: updatedProfile.education || "",
      college: updatedProfile.college || "",
      batchName: updatedProfile.batchName || "",
      location: updatedProfile.location || "",
      isProfilePublic: updatedProfile.isProfilePublic !== undefined ? updatedProfile.isProfilePublic : true,
    };

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        avatarUrl: profileData.avatarUrl,
        profile: profileData
      },
      message: "Avatar uploaded successfully"
    });

  } catch (err) {
    // Log full error for debugging
    console.error("Avatar upload error:", {
      userId: req.user?.userId || req.user?.id,
      error: err.message,
      stack: err.stack
    });

    // Clean up temporary file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("Temporary file cleaned up after error");
      } catch (e) {
        console.warn("Temp file cleanup failed after error:", e.message);
      }
    }

    // Handle specific error types
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Return generic error response
    res.status(500).json({
      success: false,
      message: "Avatar upload failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = uploadAvatar;