const UserProfile = require("../models/profile.models");

exports.getPublicProfiles = async (req, res) => {
  try {
    const profiles = await UserProfile.find(
      { isProfilePublic: true },
      { bio: 0 } 
    ).populate("userId", "firstName lastName");

    res.json({
      success: true,
      data: profiles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch public profiles",
    });
  }
};
