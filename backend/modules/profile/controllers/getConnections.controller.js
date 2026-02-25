const mongoose = require("mongoose");
const Follow = require("../models/follow.model");

exports.getConnections = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    const connections = await Follow.aggregate([
      { $match: { follower: userId } },

      {
        $lookup: {
          from: "follows",
          let: { followedUser: "$following" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$follower", "$$followedUser"] },
                    { $eq: ["$following", userId] }
                  ]
                }
              }
            }
          ],
          as: "mutual"
        }
      },

      { $match: { mutual: { $ne: [] } } },

      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "userprofiles",
          localField: "user._id",
          foreignField: "userId",
          as: "profile"
        }
      },
      { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: "$user._id",
          firstName: "$user.firstName",
          lastName: "$user.lastName",
          fullName: {
            $concat: ["$user.firstName", " ", "$user.lastName"]
          },
          avatarUrl: "$profile.avatarUrl",
          headline: "$profile.headline",
          email: "$user.email"
        }
      }
    ]);

    res.json({
      success: true,
      data: connections,
      count: connections.length
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};