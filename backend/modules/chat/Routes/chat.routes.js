const express = require('express');
const protect = require('../../../middlewares/token.verification');
const conversationController = require('../controllers/conversation.controller');
const messageController = require('../controllers/message.controller');
const chatRouter = express.Router();
chatRouter.post("/conversation", protect, conversationController.getOrCreateConversation);

chatRouter.post("/message", protect, messageController.sendMessage);
chatRouter.get("/messages/:conversationId", protect, messageController.getMessages);
chatRouter.put("/messages/:conversationId/read", protect, messageController.markAsRead);

module.exports = chatRouter;