const Follow = require("../models/follow.model");
const UserProfile = require("../models/profile.models");

exports.getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find all following
    const following = await Follow.find({ follower: userId })
      .populate("following", "firstName lastName email")
      .lean();

    // Get profile data for each following user
    const followingIds = following.map(f => f.following._id);
    
    const profiles = await UserProfile.find({ 
      userId: { $in: followingIds } 
    }).lean();

    // Create a map of profile data by userId
    const profileMap = {};
    profiles.forEach(profile => {
      profileMap[profile.userId.toString()] = profile;
    });

    // Combine user data with profile data
    const followingWithProfiles = following.map(f => {
      const userData = f.following;
      const profileData = profileMap[userData._id.toString()] || {};
      
      return {
        _id: userData._id,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        fullName: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
        avatarUrl: profileData.avatarUrl || null,
        headline: profileData.headline || "",
        // Include any other profile fields you want to show
      };
    });

    res.json({
      success: true,
      data: followingWithProfiles,
      count: followingWithProfiles.length
    });

  } catch (err) {
    console.error("Error in getFollowing:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch following",
      error: err.message
    });
  }
};