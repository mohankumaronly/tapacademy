const UserProfile = require("../models/profile.models");

/**
 * Get all public profiles with optional search
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with list of public profiles
 */
const getPublicProfiles = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10, sortBy = "createdAt", order = "desc" } = req.query;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Build search query for user population
    const searchQuery = search ? {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    } : {};

    // First, find all public profiles
    const profilesQuery = UserProfile.find({ isProfilePublic: true })
      .populate({
        path: "userId",
        match: search ? searchQuery : {}, // Only apply search filter if search exists
        select: "firstName lastName email",
      })
      .select("headline avatarUrl skills techStack location company role createdAt") // Select specific fields for listing
      .sort({ [sortBy]: sortOrder })
      .lean();

    // Get total count for pagination (without populate)
    const totalCount = await UserProfile.countDocuments({ isProfilePublic: true });

    // Apply pagination
    const profiles = await profilesQuery.skip(skip).limit(parseInt(limit));

    // Filter out profiles where userId is null (no match in search)
    const filteredProfiles = profiles.filter(p => p.userId);

    // Format the response data
    const formattedProfiles = filteredProfiles.map(profile => ({
      id: profile._id,
      userId: profile.userId._id,
      user: {
        id: profile.userId._id,
        firstName: profile.userId.firstName || "",
        lastName: profile.userId.lastName || "",
        email: profile.userId.email || "",
        fullName: `${profile.userId.firstName || ""} ${profile.userId.lastName || ""}`.trim() || "User",
      },
      // Basic Info
      headline: profile.headline || "",
      avatarUrl: profile.avatarUrl || null,
      
      // Skills & Tech Stack (limited for listing)
      skills: Array.isArray(profile.skills) ? profile.skills.slice(0, 5) : [], // Show only first 5 skills
      techStack: Array.isArray(profile.techStack) ? profile.techStack.slice(0, 3) : [], // Show only first 3 tech stack items
      
      // Professional Info
      company: profile.company || "",
      role: profile.role || "",
      
      // Location
      location: profile.location || "",
      
      // Metadata
      createdAt: profile.createdAt,
      profileAge: profile.createdAt ? Math.floor((Date.now() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24)) : 0, // Age in days
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(filteredProfiles.length / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    // Return success response
    res.status(200).json({
      success: true,
      data: formattedProfiles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit),
      },
      message: "Public profiles fetched successfully"
    });

  } catch (err) {
    console.error("Public profile search error:", {
      query: req.query,
      error: err.message,
      stack: err.stack
    });

    // Handle specific error types
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters"
      });
    }

    // Return generic error response
    res.status(500).json({
      success: false,
      message: "Failed to fetch public profiles",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = getPublicProfiles;