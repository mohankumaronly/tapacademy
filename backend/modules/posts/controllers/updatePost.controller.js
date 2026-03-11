const Post = require("../models/post.model");
const Follow = require("../../profile/models/follow.model");
const UserProfile = require("../../profile/models/profile.models");

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

    // populate post same as feed
    let updatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName")
      .populate("authorProfile", "avatarUrl")
      .populate({
        path: "likes",
        select: "firstName lastName",
        model: "User"
      })
      .lean();

    // collect user ids
    const userIds = new Set();

    if (updatedPost.author?._id) {
      userIds.add(updatedPost.author._id.toString());
    }

    (updatedPost.likes || []).forEach(like => {
      if (like?._id) {
        userIds.add(like._id.toString());
      }
    });

    // get profiles
    const profiles = await UserProfile.find({
      userId: { $in: Array.from(userIds) }
    }).select("userId avatarUrl").lean();

    const avatarMap = {};
    profiles.forEach(p => {
      avatarMap[p.userId.toString()] = p.avatarUrl || null;
    });

    // follow check
    const follows = await Follow.find({ follower: userId })
      .select("following")
      .lean();

    const followingSet = new Set(
      follows.map(f => f.following.toString())
    );

    // format post same as feed
    updatedPost = {
      ...updatedPost,
      author: updatedPost.author
        ? {
            ...updatedPost.author,
            avatarUrl: avatarMap[updatedPost.author._id.toString()] || null
          }
        : updatedPost.author,
      likes: (updatedPost.likes || []).map(like => ({
        ...like,
        avatarUrl: avatarMap[like._id.toString()] || null
      })),
      isFollowingAuthor: followingSet.has(
        updatedPost.author?._id?.toString()
      )
    };

    // broadcast websocket
    if (global.wss) {
      global.wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({
              type: "POST_UPDATED",
              data: updatedPost
            })
          );
        }
      });
    }

    res.json({
      success: true,
      data: updatedPost
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};