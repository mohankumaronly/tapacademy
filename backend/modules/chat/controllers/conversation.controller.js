const Conversation = require("../models/conversation.model");

exports.getOrCreateConversation = async (req, res) => {
  try {
    const myId = req.user.userId;
    const otherUserId = req.body.userId;

    if (!otherUserId) {
      return res.status(400).json({ message: "userId is required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [myId, otherUserId] }
    });

    if (conversation) {
      return res.json({ success: true, data: conversation });
    }

    conversation = await Conversation.create({
      participants: [myId, otherUserId]
    });

    res.json({ success: true, data: conversation });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};