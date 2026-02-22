const Follow = require("../models/follow.model");
const UserProfile = require("../models/profile.models");

exports.getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find all followers
    const followers = await Follow.find({ following: userId })
      .populate("follower", "firstName lastName email")
      .lean();

    // Get profile data for each follower
    const followerIds = followers.map(f => f.follower._id);
    
    const profiles = await UserProfile.find({ 
      userId: { $in: followerIds } 
    }).lean();

    // Create a map of profile data by userId
    const profileMap = {};
    profiles.forEach(profile => {
      profileMap[profile.userId.toString()] = profile;
    });

    // Combine user data with profile data
    const followersWithProfiles = followers.map(f => {
      const userData = f.follower;
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
      data: followersWithProfiles,
      count: followersWithProfiles.length
    });

  } catch (err) {
    console.error("Error in getFollowers:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch followers",
      error: err.message
    });
  }
};