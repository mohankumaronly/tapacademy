const Message = require("../models/message.model");
const WebSocket = require("ws");
const Conversation = require("../models/conversation.model");
const UserProfile = require("../../profile/models/profile.models");
const User = require("../../auth/models/auth.model");

exports.sendMessage = async (req, res) => {
  try {
    const sender = req.user.userId;
    const { conversationId, receiver, text } = req.body;

    if (!conversationId || !receiver || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(sender)) {
      return res.status(403).json({ message: "Not authorized to send messages in this conversation" });
    }

    const message = await Message.create({
      conversationId,
      sender,
      receiver,
      text,
      read: false
    });

    const otherParticipantId = conversation.participants.find(
      p => p.toString() !== sender
    );

    const otherUser = await User.findById(otherParticipantId).select('firstName lastName');
    const otherProfile = await UserProfile.findOne({ userId: otherParticipantId }).select('avatarUrl');

    if (global.wss) {
      const conversationUpdatePayload = JSON.stringify({
        type: "CONVERSATION_UPDATED",
        data: {
          conversationId,
          lastMessage: text,
          lastMessageAt: new Date(),
          lastMessageSender: sender,
          otherUser: {
            _id: otherParticipantId,
            firstName: otherUser?.firstName,
            lastName: otherUser?.lastName,
            name: `${otherUser?.firstName || ''} ${otherUser?.lastName || ''}`.trim(),
            avatar: otherProfile?.avatarUrl || null
          }
        }
      });

      let sentCount = 0;
      global.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.userId) {
          if (client.userId === sender || client.userId === otherParticipantId) {
            client.send(conversationUpdatePayload);
            sentCount++;
            console.log(`✅ Sent conversation update to: ${client.userId}`);
          }
        }
      });

      console.log(`📊 Conversation update broadcast: ${sentCount} clients notified`);
    }

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: new Date(),
      updatedAt: new Date()
    });

    const senderUser = await User.findById(sender).select('firstName lastName email');
    const receiverUser = await User.findById(receiver).select('firstName lastName email');

    const senderProfile = await UserProfile.findOne({ userId: sender }).select('avatarUrl');
    const receiverProfile = await UserProfile.findOne({ userId: receiver }).select('avatarUrl');

    const populatedMessage = {
      ...message.toObject(),
      sender: {
        _id: sender,
        firstName: senderUser?.firstName || '',
        lastName: senderUser?.lastName || '',
        email: senderUser?.email || '',
        avatar: senderProfile?.avatarUrl || null
      },
      receiver: {
        _id: receiver,
        firstName: receiverUser?.firstName || '',
        lastName: receiverUser?.lastName || '',
        email: receiverUser?.email || '',
        avatar: receiverProfile?.avatarUrl || null
      }
    };

    if (global.wss) {
      const messagePayload = JSON.stringify({
        type: "NEW_MESSAGE",
        data: populatedMessage,
        conversationId: conversationId
      });

      let sentCount = 0;
      global.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.userId) {
          if (client.userId === sender || client.userId === receiver) {
            client.send(messagePayload);
            sentCount++;
          }
        }
      });
    }

    res.json({ success: true, data: populatedMessage });

  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: "Not authorized to view these messages" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 });

    const userIds = [...new Set(messages.flatMap(msg => [msg.sender, msg.receiver]))];

    const users = await User.find({ _id: { $in: userIds } })
      .select('firstName lastName email');

    const profiles = await UserProfile.find({ userId: { $in: userIds } })
      .select('userId avatarUrl');

    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = user;
      return map;
    }, {});

    const profileMap = profiles.reduce((map, profile) => {
      map[profile.userId.toString()] = profile;
      return map;
    }, {});

    const populatedMessages = messages.map(msg => {
      const senderUser = userMap[msg.sender.toString()];
      const receiverUser = userMap[msg.receiver.toString()];
      const senderProfile = profileMap[msg.sender.toString()];
      const receiverProfile = profileMap[msg.receiver.toString()];

      return {
        ...msg.toObject(),
        sender: {
          _id: msg.sender,
          firstName: senderUser?.firstName || '',
          lastName: senderUser?.lastName || '',
          email: senderUser?.email || '',
          avatar: senderProfile?.avatarUrl || null
        },
        receiver: {
          _id: msg.receiver,
          firstName: receiverUser?.firstName || '',
          lastName: receiverUser?.lastName || '',
          email: receiverUser?.email || '',
          avatar: receiverProfile?.avatarUrl || null
        }
      };
    });

    res.json({ success: true, data: populatedMessages });

  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    const result = await Message.updateMany(
      {
        conversationId,
        receiver: userId,
        read: { $ne: true }
      },
      {
        $set: {
          read: true,
          readAt: new Date()
        }
      }
    );

    console.log(`Marked ${result.modifiedCount} messages as read for user ${userId}`);

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (global.wss && result.modifiedCount > 0) {
      const readReceiptPayload = JSON.stringify({
        type: "MESSAGES_READ",
        data: {
          conversationId,
          userId,
          readAt: new Date()
        }
      });

      let sentCount = 0;
      global.wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.userId) {
          conversation.participants.forEach(participantId => {
            if (participantId.toString() === client.userId && client.userId !== userId) {
              client.send(readReceiptPayload);
              sentCount++;
            }
          });
        }
      });

    }

    res.json({
      success: true,
      message: "Messages marked as read",
      count: result.modifiedCount
    });

  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};