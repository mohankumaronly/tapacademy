const UserProfile = require("../models/profile.models");

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const profile = await UserProfile.findOne({ userId: userId })
      .populate("userId", "firstName lastName email")

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: {
          userId: userId,
          headline: "",
          bio: "",
          avatarUrl: null,
          
          skills: [],
          techStack: [],
          interests: [],
          
          github: "",
          linkedin: "",
          twitter: "",
          portfolio: "",
          website: "",
          
          company: "",
          role: "",
          experience: "",
          
          education: "",
          college: "",
          batchName: "",
          
          location: "",
          isProfilePublic: true,
          
          createdAt: null,
          updatedAt: null,
          
          user: req.user ? {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email
          } : null
        },
        message: "Profile not found, returning empty template"
      });
    }

    const profileData = {
      ...profile,
      skills: profile.skills || [],
      techStack: profile.techStack || [],
      interests: profile.interests || [],
      
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
      
      isProfilePublic: profile.isProfilePublic !== undefined ? profile.isProfilePublic : true,
      
      avatarUrl: profile.avatarUrl || null,
    };

    res.status(200).json({
      success: true,
      data: profileData,
      message: "Profile fetched successfully"
    });

  } catch (err) {
    console.error("Error in getMyProfile:", {
      userId: req.user?.userId || req.user?.id,
      error: err.message,
      stack: err.stack
    });

    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = getMyProfile;