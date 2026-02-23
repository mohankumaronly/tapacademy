const Comment = require("../models/comment.model.js");
const Post = require("../models/post.model");
const UserProfile = require("../../profile/models/profile.models.js"); 
const WebSocket = require("ws");

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

    // Get the user's profile for avatar
    const userProfile = await UserProfile.findOne({ userId }).select("avatarUrl");

    // Create the comment with authorProfile reference
    const comment = await Comment.create({
      postId,
      author: userId,
      authorProfile: userProfile?._id, // Store the profile reference
      text: text.trim(),
    });

    // Update post comments count
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    );

    // Populate the comment with author and profile data
    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "firstName lastName") // Populate from User model
      .populate("authorProfile", "avatarUrl") // Populate from UserProfile model
      .lean();

    // 🔥 REALTIME BROADCAST with populated data
    global.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.user) {
        client.send(JSON.stringify({
          type: "NEW_COMMENT",
          data: {
            postId,
            comment: populatedComment,
            commentsCount: updatedPost.commentsCount
          }
        }));
      }
    });

    res.status(201).json({
      success: true,
      data: populatedComment,
    });

  } catch (err) {
    console.error("Create comment error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};