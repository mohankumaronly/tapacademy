const Post = require("../models/post.model");

exports.updatePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { text } = req.body;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    post.text = text?.trim() || post.text;

    await post.save();

    res.json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};
