const Post = require("../models/post.model");
const Follow = require("../../profile/models/follow.model");
const User = require("../../auth/models/auth.model"); 
const UserProfile = require("../../profile/models/profile.models");

exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.userId;

    const posts = await Post.find({ isPublic: true })
      .populate("author", "firstName lastName")
      .populate("authorProfile", "avatarUrl")
      .populate({
        path: "likes",
        select: "firstName lastName", 
        model: "User"
      })
      .sort({ createdAt: -1 })
      .lean();

    const allUserIds = new Set();
    
    posts.forEach(post => {
      if (post.author?._id) {
        allUserIds.add(post.author._id.toString());
      }
      
      (post.likes || []).forEach(like => {
        if (like?._id) {
          allUserIds.add(like._id.toString());
        }
      });
    });

    const userProfiles = await UserProfile.find({
      userId: { $in: Array.from(allUserIds) }
    }).select("userId avatarUrl firstName lastName").lean();

    const avatarMap = {};
    userProfiles.forEach(profile => {
      avatarMap[profile.userId.toString()] = profile.avatarUrl || null;
    });

    const follows = await Follow.find({ follower: userId })
      .select("following")
      .lean();

    const followingSet = new Set(
      follows.map(f => f.following.toString())
    );

    const updatedPosts = posts.map(post => ({
      ...post,
      author: post.author ? {
        ...post.author,
        avatarUrl: avatarMap[post.author._id.toString()] || null
      } : post.author,
      likes: (post.likes || []).map(like => ({
        ...like,
        avatarUrl: avatarMap[like._id.toString()] || null
      })),
      isFollowingAuthor: followingSet.has(post.author?._id?.toString()),
    }));

    res.json({
      success: true,
      data: updatedPosts,
    });

  } catch (error) {
    console.error("Feed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load feed",
    });
  }
};