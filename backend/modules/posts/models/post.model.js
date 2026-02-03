const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    text: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    media: {
      type: {
        type: String,
        enum: ["image", "video"],
      },
      url: {
        type: String,
      },
    },

    postType: {
      type: String,
      enum: ["text", "image", "video"],
      required: true,
      index: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },

    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true, 
  }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
