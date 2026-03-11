const Post = require("../models/post.model");
const Follow = require("../../profile/models/follow.model");
const User = require("../../auth/models/auth.model"); 
const UserProfile = require("../../profile/models/profile.models");

exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.userId;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.find({ isPublic: true })
        .populate("author", "firstName lastName")
        .populate("authorProfile", "avatarUrl")
        .populate({
          path: "likes",
          select: "firstName lastName", 
          model: "User"
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      
      Post.countDocuments({ isPublic: true })
    ]);

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

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: {
        posts: updatedPosts,
        pagination: {
          page,
          limit,
          totalPosts,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error("Feed error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load feed",
    });
  }
};