const UserProfile = require("../models/profile.models");
const Follow = require("../models/follow.model");

/**
 * Get public profile by user ID (for viewing other users' profiles)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with profile data
 */
const getProfileByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.userId || req.user?.id; // Current logged in user (if any)

    // Validate userId parameter
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find profile by userId
    const profile = await UserProfile.findOne({ userId: userId })
      .populate("userId", "firstName lastName email")
      .lean();

    // Check if profile exists
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Check if profile is private and not the owner
    const isOwner = userId === currentUserId;
    if (!profile.isProfilePublic && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "This profile is private"
      });
    }

    // Get follow stats for this profile
    const followersCount = await Follow.countDocuments({ following: userId });
    const followingCount = await Follow.countDocuments({ follower: userId });
    
    // Check if current user is following this profile
    let isFollowing = false;
    if (currentUserId && !isOwner) {
      const followRelation = await Follow.findOne({
        follower: currentUserId,
        following: userId
      });
      isFollowing = !!followRelation;
    }

    // Format the response data with all fields from updated model
    const profileData = {
      // Basic Info
      userId: profile.userId,
      headline: profile.headline || "",
      bio: profile.bio || "",
      avatarUrl: profile.avatarUrl || null,
      
      // Skills & Tech Stack
      skills: profile.skills || [],
      techStack: profile.techStack || [],
      interests: profile.interests || [],
      
      // Social Links (conditionally shown based on privacy)
      github: (profile.isProfilePublic || isOwner) ? profile.github || "" : null,
      linkedin: (profile.isProfilePublic || isOwner) ? profile.linkedin || "" : null,
      twitter: (profile.isProfilePublic || isOwner) ? profile.twitter || "" : null,
      portfolio: (profile.isProfilePublic || isOwner) ? profile.portfolio || "" : null,
      website: (profile.isProfilePublic || isOwner) ? profile.website || "" : null,
      
      // Professional Info
      company: profile.company || "",
      role: profile.role || "",
      experience: profile.experience || "",
      
      // Education
      education: profile.education || "",
      college: profile.college || "",
      batchName: profile.batchName || "",
      
      // Location
      location: profile.location || "",
      
      // Privacy
      isProfilePublic: profile.isProfilePublic,
      
      // Timestamps
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      
      // Follow stats
      followStats: {
        followers: followersCount,
        following: followingCount,
        isFollowing: isFollowing
      },
      
      // User details from populated field
      user: profile.userId ? {
        id: profile.userId._id || profile.userId,
        firstName: profile.userId.firstName || "",
        lastName: profile.userId.lastName || "",
        email: (profile.isProfilePublic || isOwner) ? profile.userId.email : undefined,
        fullName: profile.userId.firstName && profile.userId.lastName 
          ? `${profile.userId.firstName} ${profile.userId.lastName}` 
          : profile.userId.firstName || profile.userId.lastName || "User"
      } : null
    };

    // Return success response
    res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile fetched successfully"
    });

  } catch (err) {
    // Log error for debugging
    console.error("Error in getProfileByUserId:", {
      userId: req.params.userId,
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

    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors
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

module.exports = getProfileByUserId;