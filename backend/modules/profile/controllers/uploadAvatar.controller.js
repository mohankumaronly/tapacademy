const cloudinary = require("../../../utils/cloudinary");
const fs = require("fs");
const UserProfile = require("../models/profile.models");

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
      width: 300,
      height: 300,
      crop: "fill",
    });
    
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn("Temp file cleanup failed");
    }

    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user.userId },
      { avatarUrl: result.secure_url },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: profile,
    });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({
      success: false,
      message: "Avatar upload failed",
    });
  }
};
