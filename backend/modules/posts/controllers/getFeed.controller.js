const Post = require("../models/post.model");

exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find({ isPublic: true })
      .populate("author", "firstName lastName")
      .populate("authorProfile", "avatarUrl")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load feed",
    });
  }
};