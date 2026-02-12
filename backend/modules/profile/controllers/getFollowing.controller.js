const Follow = require("../models/follow.model");

exports.getFollowing = async (req, res) => {
  const userId = req.params.userId;

  const following = await Follow.find({ follower: userId })
    .populate("following", "firstName lastName")
    .lean();

  res.json({
    success: true,
    data: following.map(f => f.following),
  });
};
