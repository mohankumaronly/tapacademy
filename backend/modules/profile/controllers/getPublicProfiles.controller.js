const UserProfile = require("../models/profile.models");

exports.getPublicProfiles = async (req, res) => {
  try {
    const search = req.query.search || "";

    const profiles = await UserProfile.find({
      isProfilePublic: true,
    })
      .populate({
        path: "userId",
        match: {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
        select: "firstName lastName email",
      })
      .select("-bio")
      .lean();

    const filteredProfiles = profiles.filter(p => p.userId);

    res.json({
      success: true,
      data: filteredProfiles,
    });

  } catch (err) {
    console.error("Public profile search error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch public profiles",
    });
  }
};
