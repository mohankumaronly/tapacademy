const UserProfile = require("../models/profile.models");

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated profile data
 */
const updateMyProfile = async (req, res) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user.userId || req.user.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Define all allowed fields that can be updated
    const allowedFields = [
      // Basic Info
      "headline",
      "bio",
      "avatarUrl",
      
      // Skills & Tech Stack
      "skills",
      "techStack",
      "interests",
      
      // Social Links
      "github",
      "linkedin",
      "twitter",
      "portfolio",
      "website",
      
      // Professional Info
      "company",
      "role",
      "experience",
      
      // Education
      "education",
      "college",
      "batchName",
      
      // Location & Privacy
      "location",
      "isProfilePublic",
    ];

    // Filter and prepare update object
    const updates = {};
    const arrayFields = ['skills', 'techStack', 'interests'];

    for (const key of allowedFields) {
      if (req.body[key] !== undefined && req.body[key] !== null) {
        // Handle array fields that might come as strings from frontend
        if (arrayFields.includes(key)) {
          if (typeof req.body[key] === 'string') {
            // Convert comma-separated string to array
            updates[key] = req.body[key]
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
          } else if (Array.isArray(req.body[key])) {
            // If it's already an array, just trim each item
            updates[key] = req.body[key]
              .map(item => item.trim())
              .filter(item => item.length > 0);
          } else {
            updates[key] = [];
          }
        } else {
          // For non-array fields, just assign the value
          updates[key] = req.body[key];
        }
      }
    }

    // Check if there's anything to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update"
      });
    }

    // Find and update profile
    const profile = await UserProfile.findOneAndUpdate(
      { userId: userId },
      { $set: updates },
      { 
        new: true,                    // Return updated document
        runValidators: true,           // Run model validations
        upsert: false,                 // Don't create if doesn't exist
        setDefaultsOnInsert: false     
      }
    );

    // If profile doesn't exist, create one
    if (!profile) {
      const newProfile = new UserProfile({
        userId: userId,
        ...updates
      });
      
      await newProfile.save();
      
      return res.status(201).json({
        success: true,
        data: newProfile,
        message: "Profile created successfully"
      });
    }

    // Return success response
    res.status(200).json({
      success: true,
      data: profile,
      message: "Profile updated successfully"
    });

  } catch (err) {
    // Handle duplicate key error (shouldn't happen with userId unique)
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Profile already exists for this user"
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(err.errors).forEach(key => {
        validationErrors[key] = err.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }

    // Log error for debugging
    console.error("Error in updateMyProfile:", {
      userId: userId,
      error: err.message,
      stack: err.stack
    });

    // Return generic error response
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = updateMyProfile;