const Comment = require("../models/comment.model");
const UserProfile = require("../../profile/models/profile.models");

exports.getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("author", "firstName lastName")
      .sort({ createdAt: -1 });
      
    const enriched = await Promise.all(
      comments.map(async (comment) => {
        const profile = await UserProfile.findOne({
          userId: comment.author._id,
        }).select("avatarUrl");

        return {
          ...comment.toObject(),
          authorProfile: profile,
        };
      })
    );

    res.json({
      success: true,
      data: enriched,
    });
  } catch (err) {
    console.error("Get comments error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load comments",
    });
  }
};
