const UserProfile = require("../models/profile.models");

exports.getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.user.userId,
    }).populate("userId", "firstName lastName email");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
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
