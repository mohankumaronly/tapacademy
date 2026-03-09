const fs = require('fs');
const WebSocket = require("ws");
const cloudinary = require('../../../utils/cloudinary');
const UserProfile = require("../../profile/models/profile.models");
const Post = require("../models/post.model");

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { text } = req.body;

    const profile = await UserProfile.findOne({ userId });

    if (!profile) {
      return res.status(400).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post text is required",
      });
    }

    let postType = "text";
    let media = null;

    if (req.file) {
      try {
        const isImage = req.file.mimetype.startsWith("image/");
        const isVideo = req.file.mimetype.startsWith("video/");

        postType = isImage ? "image" : "video";

        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "posts",
          resource_type: isVideo ? "video" : "image",
        });

        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        media = {
          type: postType,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id
        };
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        if (req.file?.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(500).json({
          success: false,
          message: "Failed to upload media",
        });
      }
    }

    const post = await Post.create({
      author: userId,
      authorProfile: profile._id,
      text: text.trim(),
      postType,
      media,
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email")
      .populate("authorProfile", "avatarUrl headline")
      .populate({
        path: "likes",
        select: "firstName lastName",
        model: "User"
      })
      .lean();

    const authorProfile = await UserProfile.findOne({ userId: post.author })
      .select("avatarUrl")
      .lean();

    populatedPost.author = {
      ...populatedPost.author,
      avatarUrl: authorProfile?.avatarUrl || null
    };

    populatedPost.reactionCounts = {
      like: populatedPost.likes?.length || 0,
    };

    if (global.wss && global.wss.clients) {
      try {
        const message = JSON.stringify({
          type: "NEW_POST",
          data: populatedPost
        });

        global.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN && client.user) {
            client.send(message);
          }
        });

      } catch (wsError) {
        console.error("WebSocket broadcast error:", wsError);
      }
    }

    res.status(201).json({
      success: true,
      data: populatedPost,
    });

  } catch (error) {
    console.error("Create post error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting temp file:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};