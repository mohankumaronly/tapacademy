const UserProfile = require("../models/profile.models");

exports.toggleVisibility = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      userId: req.user.userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    profile.isProfilePublic = !profile.isProfilePublic;
    await profile.save();

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
