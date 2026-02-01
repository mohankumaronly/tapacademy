const UserProfile = require("../models/profile.models");

exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const existing = await UserProfile.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const profile = await UserProfile.create({
      userId,
      ...req.body,
    });

    res.status(201).json({
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
