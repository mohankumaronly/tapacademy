const Post = require("../models/post.model");

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.json({
      success: true,
      likesCount: post.likes.length,
      liked: !alreadyLiked,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to like post",
    });
  }
};
