const Post = require("../models/post.model");
const UserProfile = require("../../profile/models/profile.models");
const User = require("../../auth/models/auth.model");
const WebSocket = require("ws");

exports.toggleLike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(userId);
    let userProfile = null;
    let userData = null;

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
      userData = await User.findById(userId).select("firstName lastName");
      userProfile = await UserProfile.findOne({ userId })
        .select("avatarUrl");
    }

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "firstName lastName")
      .populate("authorProfile", "avatarUrl")
      .populate({
        path: "likes",
        select: "firstName lastName",
        model: "User"
      })
      .lean();

    const likeUserIds = (updatedPost.likes || []).map(like => like._id.toString());
    const likeProfiles = await UserProfile.find({
      userId: { $in: likeUserIds }
    }).select("userId avatarUrl").lean();

    const avatarMap = {};
    likeProfiles.forEach(profile => {
      avatarMap[profile.userId.toString()] = profile.avatarUrl;
    });

    updatedPost.likes = (updatedPost.likes || []).map(like => ({
      ...like,
      avatarUrl: avatarMap[like._id.toString()] || null
    }));

    global.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.user) {
        client.send(JSON.stringify({
          type: "POST_LIKED",
          data: {
            postId: post._id,
            userId,
            liked: !alreadyLiked,
            likesCount: post.likes.length,
            user: !alreadyLiked ? {
              _id: userId,
              firstName: userData?.firstName || req.user.firstName,
              lastName: userData?.lastName || req.user.lastName,
              avatarUrl: userProfile?.avatarUrl || null
            } : null,
            post: updatedPost
          }
        }));
      }
    });

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
      data: updatedPost 
    });

  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
    });
  }
};