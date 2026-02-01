const UserProfile = require("../models/profile.models");

exports.updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "headline",
      "bio",
      "avatarUrl",
      "skills",
      "github",
      "linkedin",
      "portfolio",
      "education",
      "college",
      "batchName",
      "location",
      "isProfilePublic",
    ];

    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

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
