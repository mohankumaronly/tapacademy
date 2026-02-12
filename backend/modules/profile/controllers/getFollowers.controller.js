const Follow = require("../models/follow.model");

exports.getFollowers = async (req, res) => {
  const userId = req.params.userId;

  const followers = await Follow.find({ following: userId })
    .populate("follower", "firstName lastName")
    .lean();

  res.json({
    success: true,
    data: followers.map(f => f.follower),
  });
};
