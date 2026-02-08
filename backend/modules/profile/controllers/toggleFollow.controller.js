const Follow = require("../models/follow.model");

exports.toggleFollow = async (req, res) => {
  const follower = req.user.userId;
  const { userId } = req.params;

  if (follower === userId) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }

  const existing = await Follow.findOne({
    follower,
    following: userId,
  });

  if (existing) {
    await existing.deleteOne();

    const followersCount = await Follow.countDocuments({
      following: userId,
    });

    return res.json({
      success: true,
      data: {
        isFollowing: false,
        followersCount,
      },
    });
  }

  await Follow.create({
    follower,
    following: userId,
  });

  const followersCount = await Follow.countDocuments({
    following: userId,
  });

  res.json({
    success: true,
    data: {
      isFollowing: true,
      followersCount,
    },
  });
};
