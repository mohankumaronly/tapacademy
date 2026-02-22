const UserProfile = require("../models/profile.models");

/**
 * Get current user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with profile data
 */
const getMyProfile = async (req, res) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user.userId || req.user.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    // Find profile and populate user details
    const profile = await UserProfile.findOne({ userId: userId })
      .populate("userId", "firstName lastName email")
      .lean(); // Convert to plain JavaScript object for better performance

    // If profile doesn't exist, return empty profile structure
    if (!profile) {
      return res.status(200).json({
        success: true,
        data: {
          userId: userId,
          // Basic Info
          headline: "",
          bio: "",
          avatarUrl: null,
          
          // Skills & Tech Stack
          skills: [],
          techStack: [],
          interests: [],
          
          // Social Links
          github: "",
          linkedin: "",
          twitter: "",
          portfolio: "",
          website: "",
          
          // Professional Info
          company: "",
          role: "",
          experience: "",
          
          // Education
          education: "",
          college: "",
          batchName: "",
          
          // Location & Privacy
          location: "",
          isProfilePublic: true,
          
          // Timestamps
          createdAt: null,
          updatedAt: null,
          
          // Populated user info (if available)
          user: req.user ? {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email
          } : null
        },
        message: "Profile not found, returning empty template"
      });
    }

    // Format the response data
    const profileData = {
      ...profile,
      // Ensure arrays are always returned as arrays
      skills: profile.skills || [],
      techStack: profile.techStack || [],
      interests: profile.interests || [],
      
      // Ensure string fields are always strings
      headline: profile.headline || "",
      bio: profile.bio || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      twitter: profile.twitter || "",
      portfolio: profile.portfolio || "",
      website: profile.website || "",
      company: profile.company || "",
      role: profile.role || "",
      experience: profile.experience || "",
      education: profile.education || "",
      college: profile.college || "",
      batchName: profile.batchName || "",
      location: profile.location || "",
      
      // Ensure boolean fields
      isProfilePublic: profile.isProfilePublic !== undefined ? profile.isProfilePublic : true,
      
      // Ensure avatarUrl
      avatarUrl: profile.avatarUrl || null,
    };

    // Return success response
    res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile fetched successfully"
    });

  } catch (err) {
    // Log error for debugging
    console.error("Error in getMyProfile:", {
      userId: req.user?.userId || req.user?.id,
      error: err.message,
      stack: err.stack
    });

    // Handle specific error types
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    // Return generic error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = getMyProfile;