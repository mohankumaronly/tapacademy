const UserProfile = require("../models/profile.models");

exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.params.userId,
      isProfilePublic: true,
    }).populate("userId", "firstName lastName");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Public profile not found",
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
