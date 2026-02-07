const Post = require("../models/post.model");

exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};