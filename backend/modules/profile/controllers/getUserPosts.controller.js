const Post = require("../../posts/models/post.model");
const UserProfile = require("../models/profile.models");

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required"
      });
    }

    const posts = await Post.find({ author: userId, isPublic: true })
      .sort({ createdAt: -1 })
      .populate("author", "firstName lastName")
      .populate("authorProfile", "avatarUrl headline")
      .populate({
        path: "likes",
        select: "firstName lastName",
        model: "User"
      })
      .lean();

    const allUserIds = [];
    posts.forEach(post => {
      if (post.likes && post.likes.length > 0) {
        post.likes.forEach(like => {
          if (like && like._id) {
            allUserIds.push(like._id.toString());
          }
        });
      }
    });

    const likeProfiles = await UserProfile.find({
      userId: { $in: allUserIds }
    }).select("userId avatarUrl").lean();

    const avatarMap = {};
    likeProfiles.forEach(profile => {
      avatarMap[profile.userId.toString()] = profile.avatarUrl;
    });

    const transformedPosts = posts.map(post => {
      const author = {
        _id: post.author?._id || userId,
        firstName: post.author?.firstName || 'User',
        lastName: post.author?.lastName || '',
        avatarUrl: post.authorProfile?.avatarUrl || null,
        headline: post.authorProfile?.headline || null
      };

      const transformedLikes = (post.likes || []).map(like => ({
        _id: like._id,
        firstName: like.firstName || 'User',
        lastName: like.lastName || '',
        avatarUrl: avatarMap[like._id.toString()] || null
      }));

      const { authorProfile, ...rest } = post;

      return {
        ...rest,
        author,
        likes: transformedLikes
      };
    });

    res.status(200).json({
      success: true,
      data: transformedPosts,
      message: "User posts fetched successfully"
    });

  } catch (err) {
    console.error("getUserPosts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts: " + err.message
    });
  }
};

module.exports = getUserPosts;