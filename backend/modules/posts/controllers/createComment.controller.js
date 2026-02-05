const Comment = require("../models/comment.model.js");
const Post = require("../models/post.model");

exports.createComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text required",
      });
    }

    const comment = await Comment.create({
      postId,
      author: userId,
      text: text.trim(),
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};
