const Post = require("../models/post.model");
const Follow = require("../../profile/models/follow.model");

exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.userId;

    const posts = await Post.find({ isPublic: true })
      .populate("author", "firstName lastName")
      .populate("authorProfile", "avatarUrl")
      .sort({ createdAt: -1 })
      .lean();

    const follows = await Follow.find({ follower: userId })
      .select("following")
      .lean();

    const followingSet = new Set(
      follows.map(f => f.following.toString())
    );

    const updatedPosts = posts.map(post => ({
      ...post,
      isFollowingAuthor: followingSet.has(post.author._id.toString()),
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
