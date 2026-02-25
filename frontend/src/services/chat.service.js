import api from "./api";

export const connections = () => {
    return api.get("/profile/connections");
}

export const getOrCreateConversation = (userId) => {
    return api.post("/chat/conversation", { userId });
}

export const sendMessage = (conversationId, receiver, text) => {
    return api.post("/chat/message", {
        conversationId,
        receiver,
        text
    });
}

export const getMessages = (conversationId) => {
    return api.get(`/chat/messages/${conversationId}`);
}

export const markMessagesAsRead = (conversationId) => {
    return api.put(`/chat/messages/${conversationId}/read`);
}

export const sendTypingIndicator = (conversationId, isTyping) => {
    return api.post("/chat/typing", { conversationId, isTyping });
}

export const getConversations = () => {
    return api.get("/chat/conversations");
}