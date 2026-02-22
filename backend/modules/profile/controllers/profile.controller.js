const UserProfile = require("../models/profile.models");

/**
 * Create a new user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created profile data
 */
const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Check if profile already exists
    const existing = await UserProfile.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user"
      });
    }

    // Define allowed fields for creation (prevent injection of unwanted fields)
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

    // Filter req.body to only include allowed fields
    const profileData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        // Handle array fields that might come as strings
        if (['skills', 'techStack', 'interests'].includes(field) && typeof req.body[field] === 'string') {
          profileData[field] = req.body[field]
            .split(',')
            .map(item => item.trim())
            .filter(item => item.length > 0);
        } else {
          profileData[field] = req.body[field];
        }
      }
    }

    // Create profile with filtered data
    const profile = await UserProfile.create({
      userId,
      ...profileData
    });

    // Populate user details for response
    const populatedProfile = await UserProfile.findById(profile._id)
      .populate("userId", "firstName lastName email")
      .lean();

    // Format response data
    const responseData = {
      ...populatedProfile,
      // Ensure arrays are always present
      skills: populatedProfile.skills || [],
      techStack: populatedProfile.techStack || [],
      interests: populatedProfile.interests || [],
      // Ensure all fields have default values
      headline: populatedProfile.headline || "",
      bio: populatedProfile.bio || "",
      avatarUrl: populatedProfile.avatarUrl || null,
      github: populatedProfile.github || "",
      linkedin: populatedProfile.linkedin || "",
      twitter: populatedProfile.twitter || "",
      portfolio: populatedProfile.portfolio || "",
      website: populatedProfile.website || "",
      company: populatedProfile.company || "",
      role: populatedProfile.role || "",
      experience: populatedProfile.experience || "",
      education: populatedProfile.education || "",
      college: populatedProfile.college || "",
      batchName: populatedProfile.batchName || "",
      location: populatedProfile.location || "",
      isProfilePublic: populatedProfile.isProfilePublic !== undefined ? populatedProfile.isProfilePublic : true,
    };

    res.status(201).json({
      success: true,
      data: responseData,
      message: "Profile created successfully"
    });

  } catch (err) {
    console.error("Error creating profile:", {
      userId: req.user?.userId || req.user?.id,
      error: err.message,
      stack: err.stack
    });

    // Handle duplicate key error (shouldn't happen with check above, but just in case)
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

    res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = createProfile;