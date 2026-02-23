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
      const isImage = req.file.mimetype.startsWith("image/");
      const isVideo = req.file.mimetype.startsWith("video/");

      postType = isImage ? "image" : "video";

      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
        resource_type: isVideo ? "video" : "image",
      });

      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

      media = {
        type: postType,
        url: uploadResult.secure_url,
      };
    }

    const post = await Post.create({
      author: userId,
      authorProfile: profile._id,
      text: text.trim(),
      postType,
      media,
    });

    // Get the populated post for response
    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName")
      .populate("authorProfile", "avatarUrl")
      .populate({
        path: "likes",
        select: "firstName lastName",
        model: "User"
      })
      .lean();

    // Fetch avatar for author
    const authorProfile = await UserProfile.findOne({ userId: post.author })
      .select("avatarUrl")
      .lean();

    // Add avatar URL to author
    populatedPost.author = {
      ...populatedPost.author,
      avatarUrl: authorProfile?.avatarUrl || null
    };

    // REALTIME BROADCAST
    global.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client.user) {
        client.send(JSON.stringify({
          type: "NEW_POST",
          data: populatedPost
        }));
      }
    });

    res.status(201).json({
      success: true,
      data: populatedPost,
    });

  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};