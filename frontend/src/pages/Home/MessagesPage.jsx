import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Send, ChevronLeft,
  MessageCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../layouts/LayoutComponents/Header";
import { 
  connections, 
  getMessages, 
  getOrCreateConversation, 
  sendMessage,
  markMessagesAsRead
} from "../../services/chat.service";

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

const MessageBubble = ({ message, isMe }) => {
  const statusIcons = {
    sent: <div className="w-1 h-1 rounded-full bg-gray-400" />,
    delivered: <div className="w-1 h-1 rounded-full bg-gray-400" />,
    read: <div className="w-1 h-1 rounded-full bg-blue-500" />,
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const avatarUrl = !isMe ? message.senderAvatar : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isMe && (
        <div className="flex-shrink-0 mr-2">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="avatar"
              className="w-7 h-7 rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
              {message.senderName?.charAt(0) || 'U'}
            </div>
          )}
        </div>
      )}
      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3 py-1.5 rounded-2xl text-sm ${
            isMe
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="break-words">{message.text}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="text-gray-400">{formatTime(message.createdAt)}</span>
          {isMe && statusIcons[message.status || 'sent']}
        </div>
      </div>
    </motion.div>
  );
};

const ConversationItem = ({ conv, isActive, onClick }) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: '#f3f4f6' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50' : ''
      }`}
    >
      <div className="relative flex-shrink-0">
        {conv.avatarUrl ? (
          <img 
            src={conv.avatarUrl} 
            alt={conv.fullName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            {conv.fullName?.charAt(0) || 'U'}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 truncate">
          {conv.fullName || `${conv.firstName} ${conv.lastName}`}
        </h3>
      </div>
    </motion.div>
  );
};

const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={disabled ? "Loading..." : "Write a message..."}
            disabled={disabled}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

const MessagesPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const getCurrentUserId = () => {
    return String(user?.userId?._id || user?.userId || user?.id || '');
  };

  const getCurrentUserAvatar = () => {
    return user?.avatarUrl || user?.avatar || '';
  };

  // WebSocket connection
  useEffect(() => {
    let reconnectTimeout;
    let isMounted = true;

    const connectWebSocket = () => {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMounted) return;
        setWsConnected(true);
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(event.data);
          
          switch(data.type) {
            case 'NEW_MESSAGE':
              handleNewMessage(data.data);
              break;
            case 'MESSAGES_READ':
              handleMessagesRead(data.data);
              break;
            default:
              break;
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;
        setWsConnected(false);
        
        if (!reconnectTimeout) {
          reconnectTimeout = setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };
    };

    connectWebSocket();

    return () => {
      isMounted = false;
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const handleNewMessage = (newMessage) => {
    const currentUserId = getCurrentUserId();
    const messageChatId = newMessage.sender._id === currentUserId 
      ? newMessage.receiver._id 
      : newMessage.sender._id;
    
    const transformedMessage = {
      id: newMessage._id,
      senderId: String(newMessage.sender._id),
      senderAvatar: newMessage.sender.avatar,
      senderName: `${newMessage.sender.firstName} ${newMessage.sender.lastName}`,
      receiverId: String(newMessage.receiver._id),
      receiverAvatar: newMessage.receiver.avatar,
      text: newMessage.text,
      createdAt: newMessage.createdAt,
      status: newMessage.read ? 'read' : 'delivered'
    };

    setMessages(prev => {
      const existingMessages = prev[messageChatId] || [];
      if (existingMessages.some(msg => msg.id === transformedMessage.id)) {
        return prev;
      }
      return {
        ...prev,
        [messageChatId]: [...existingMessages, transformedMessage]
      };
    });

    if (selectedChat?.id === messageChatId && 
        newMessage.sender._id !== currentUserId && 
        selectedConversation) {
      markMessagesAsRead(selectedConversation._id).catch(console.error);
    }
  };

  const handleMessagesRead = (data) => {
    const { userId } = data;
    
    setMessages(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(chatId => {
        updated[chatId] = updated[chatId].map(msg => {
          if (msg.receiverId === userId) {
            return { ...msg, status: 'read' };
          }
          return msg;
        });
      });
      return updated;
    });
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await connections();
      
      if (response.data.success) {
        const transformedConversations = response.data.data.map(conn => ({
          id: conn._id,
          firstName: conn.firstName,
          lastName: conn.lastName,
          fullName: conn.fullName,
          avatarUrl: conn.avatarUrl,
          conversationId: null
        }));
        setConversations(transformedConversations);
      }
    } catch (err) {
      setError('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId, chatId) => {
    try {
      setLoadingMessages(true);
      const response = await getMessages(conversationId);
      const currentUserId = getCurrentUserId();
      
      if (response.data.success) {        
        const transformedMessages = response.data.data.map(msg => ({
          id: msg._id,
          senderId: String(msg.sender._id),
          senderAvatar: msg.sender.avatar,
          senderName: `${msg.sender.firstName} ${msg.sender.lastName}`,
          receiverId: String(msg.receiver._id),
          receiverAvatar: msg.receiver.avatar,
          text: msg.text,
          createdAt: msg.createdAt,
          status: msg.read ? 'read' : 'delivered'
        }));
        
        setMessages(prev => ({
          ...prev,
          [chatId]: transformedMessages
        }));

        const hasUnreadFromOther = transformedMessages.some(
          msg => msg.senderId !== currentUserId && msg.status !== 'read'
        );
        
        if (hasUnreadFromOther) {
          await markMessagesAsRead(conversationId);
        }
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (selectedChat && messages[selectedChat.id]) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, selectedChat]);

  useEffect(() => {
    if (windowWidth < 640 && selectedChat) {
      setShowMobileChat(true);
      setShowMobileSidebar(false);
    }
  }, [selectedChat, windowWidth]);

  const handleSelectChat = async (chat) => {
    try {
      setCreatingConversation(true);
      setSelectedChat(chat);
      
      const response = await getOrCreateConversation(chat.id);
      
      if (response.data.success) {
        const conversation = response.data.data;
        setSelectedConversation(conversation);
        
        setConversations(prev =>
          prev.map(c =>
            c.id === chat.id
              ? { ...c, conversationId: conversation._id }
              : c
          )
        );
        
        await fetchMessages(conversation._id, chat.id);
      }
    } catch (err) {
      setError('Failed to open conversation');
    } finally {
      setCreatingConversation(false);
    }
  };

  const handleSendMessage = async (text) => {
    if (!selectedChat || !selectedConversation || sendingMessage) return;

    const tempId = Date.now();
    const currentUserId = getCurrentUserId();
    const currentUserAvatar = getCurrentUserAvatar();
    
    const newMessage = {
      id: tempId,
      senderId: currentUserId,
      senderAvatar: currentUserAvatar,
      senderName: `${user?.firstName} ${user?.lastName}`,
      receiverId: String(selectedChat.id),
      receiverAvatar: selectedChat.avatarUrl,
      text,
      createdAt: new Date().toISOString(),
      status: "sent"
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      setSendingMessage(true);
      const response = await sendMessage(selectedConversation._id, selectedChat.id, text);
      
      if (response.data.success) {
        const serverMessage = response.data.data;
        
        setMessages(prev => ({
          ...prev,
          [selectedChat.id]: prev[selectedChat.id].map(msg =>
            msg.id === tempId
              ? {
                  ...msg,
                  id: serverMessage._id,
                  senderId: String(serverMessage.sender._id),
                  senderAvatar: serverMessage.sender.avatar,
                  senderName: `${serverMessage.sender.firstName} ${serverMessage.sender.lastName}`,
                  receiverId: String(serverMessage.receiver._id),
                  receiverAvatar: serverMessage.receiver.avatar,
                  status: serverMessage.read ? 'read' : 'delivered'
                }
              : msg
          )
        }));
      }
    } catch (err) {
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: prev[selectedChat.id].filter(msg => msg.id !== tempId)
      }));
    } finally {
      setSendingMessage(false);
    }
  };

  const handleBackToSidebar = () => {
    setShowMobileChat(false);
    setShowMobileSidebar(true);
    setSelectedChat(null);
    setSelectedConversation(null);
  };

  const filteredConversations = conversations.filter(conv => {
    if (search) {
      return conv.fullName?.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const currentMessages = selectedChat ? messages[selectedChat.id] || [] : [];
  const currentUserId = getCurrentUserId();

  const hideScrollbarStyle = `
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="fixed top-14 sm:top-16 md:top-20 bottom-0 left-0 right-0">
        <div className="h-full px-0 sm:px-4 lg:px-8 py-0 sm:py-4">
          <div className="bg-white rounded-none sm:rounded-xl border-0 sm:border sm:border-gray-200 h-full flex overflow-hidden shadow-sm">
            
            <AnimatePresence mode="wait">
              {(showMobileSidebar || !isMobile) && (
                <motion.div
                  initial={isMobile ? { x: -300, opacity: 0 } : false}
                  animate={isMobile ? { x: 0, opacity: 1 } : {}}
                  exit={isMobile ? { x: -300, opacity: 0 } : {}}
                  className={`${
                    isMobile ? 'w-full absolute inset-0 z-10 bg-white' : 
                    isTablet ? 'w-80' : 'w-96'
                  } border-r border-gray-200 flex flex-col h-full`}
                >
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-shrink-0 p-3 border-b border-gray-200 bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Messages
                          {wsConnected && (
                            <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </h2>
                      </div>
                      
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white">
                      {loading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
                          <p className="text-sm text-center">{error}</p>
                          <button onClick={fetchConnections} className="mt-2 text-blue-600 text-sm hover:underline">
                            Try again
                          </button>
                        </div>
                      ) : filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => (
                          <ConversationItem
                            key={conv.id}
                            conv={conv}
                            isActive={selectedChat?.id === conv.id}
                            onClick={() => handleSelectChat(conv)}
                          />
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                          <MessageCircle size={32} className="mb-2 opacity-50" />
                          <p className="text-sm">No conversations found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {selectedChat && (showMobileChat || !isMobile) ? (
                <motion.div
                  initial={isMobile ? { x: 300, opacity: 0 } : false}
                  animate={isMobile ? { x: 0, opacity: 1 } : {}}
                  exit={isMobile ? { x: 300, opacity: 0 } : {}}
                  className="flex-1 flex flex-col bg-white h-full"
                >
                  {creatingConversation ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                  ) : (
                    <>
                      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-white">
                        {isMobile && (
                          <button onClick={handleBackToSidebar} className="p-1 hover:bg-gray-100 rounded-full">
                            <ChevronLeft size={20} />
                          </button>
                        )}
                        
                        <div className="relative flex-shrink-0">
                          {selectedChat.avatarUrl ? (
                            <img 
                              src={selectedChat.avatarUrl} 
                              alt={selectedChat.fullName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                              {selectedChat.fullName?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {selectedChat.fullName}
                          </h3>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                        {loadingMessages ? (
                          <div className="flex items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                          </div>
                        ) : currentMessages.length > 0 ? (
                          currentMessages.map((msg) => (
                            <MessageBubble
                              key={msg.id}
                              message={msg}
                              isMe={String(msg.senderId) === currentUserId}
                            />
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <p className="text-sm">No messages yet</p>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      <MessageInput 
                        onSend={handleSendMessage} 
                        disabled={loadingMessages || sendingMessage}
                      />
                    </>
                  )}
                </motion.div>
              ) : !isMobile && !selectedChat ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                  <div className="text-center">
                    <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Select a conversation to start messaging</p>
                  </div>
                </div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <style>{hideScrollbarStyle}</style>
    </div>
  );
};

export default MessagesPage;