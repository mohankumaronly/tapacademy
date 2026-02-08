const Follow = require("../models/follow.model");

exports.getFollowStats = async (req, res) => {
  const userId = req.params.userId;
  const currentUser = req.user?.userId; // optional if protected

  const followers = await Follow.countDocuments({ following: userId });
  const following = await Follow.countDocuments({ follower: userId });

  let isFollowing = false;

  if (currentUser) {
    const exists = await Follow.exists({
      follower: currentUser,
      following: userId,
    });
    isFollowing = !!exists;
  }

  res.json({
    success: true,
    data: {
      followers,
      following,
      isFollowing,
    },
  });
};
