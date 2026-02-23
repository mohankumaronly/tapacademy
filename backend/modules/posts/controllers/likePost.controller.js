const Post = require("../models/post.model");
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

    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    // 🔥 REALTIME BROADCAST
    global.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.user) {
        client.send(JSON.stringify({
          type: "POST_LIKED",
          data: {
            postId: post._id,
            userId,
            liked: !alreadyLiked,
            likesCount: post.likes.length
          }
        }));
      }
    });

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    });

  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle like",
    });
  }
};