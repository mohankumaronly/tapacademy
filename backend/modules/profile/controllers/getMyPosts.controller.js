const Post = require("../../posts/models/post.model");

const getMyPosts = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "firstName lastName")
      .lean();

    res.status(200).json({
      success: true,
      data: posts,
      message: "User posts fetched successfully"
    });

  } catch (err) {
    console.error("getMyPosts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts"
    });
  }
};

module.exports = getMyPosts;