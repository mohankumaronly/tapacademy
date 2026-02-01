const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    headline: {
      type: String,
      trim: true,
      maxlength: 120,
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    github: String,
    linkedin: String,
    portfolio: String,

    education: String,
    college: String,

    batchName: String,

    location: String,

    isProfilePublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const UserProfile= mongoose.model("UserProfile", profileSchema);

module.exports = UserProfile;