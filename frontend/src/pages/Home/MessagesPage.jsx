import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Send, MoreVertical, Phone, Video, Image,
  Paperclip, Smile, Check, CheckCheck, User, Users,
  Archive, Trash2, Star, Pin, Clock, Filter,
  Mic, Camera, File, X, Plus, Edit3, ChevronLeft,
  Menu, Info, MessageCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../layouts/LayoutComponents/Header";

const mockConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: null,
    lastMessage: "Thanks for the feedback! I'll implement those changes",
    timestamp: "2m ago",
    unread: 2,
    online: true,
    typing: false,
    pinned: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: null,
    lastMessage: "When are we meeting for the code review?",
    timestamp: "1h ago",
    unread: 0,
    online: true,
    typing: true,
    pinned: false,
  },
  {
    id: 3,
    name: "Alex Rivera",
    avatar: null,
    lastMessage: "The deployment is complete 🚀",
    timestamp: "3h ago",
    unread: 0,
    online: false,
    typing: false,
    pinned: false,
  },
  {
    id: 4,
    name: "Emily Watson",
    avatar: null,
    lastMessage: "Can you review my PR when you have time?",
    timestamp: "5h ago",
    unread: 1,
    online: false,
    typing: false,
    pinned: false,
  },
  {
    id: 5,
    name: "David Kim",
    avatar: null,
    lastMessage: "Great working with you!",
    timestamp: "1d ago",
    unread: 0,
    online: false,
    typing: false,
    pinned: false,
  },
  {
    id: 6,
    name: "Lisa Wong",
    avatar: null,
    lastMessage: "The design looks amazing!",
    timestamp: "2d ago",
    unread: 0,
    online: true,
    typing: false,
    pinned: false,
  },
];

const mockMessages = [
  {
    id: 1,
    senderId: 1,
    text: "Hey! How's the project coming along?",
    timestamp: "10:30 AM",
    status: "read",
  },
  {
    id: 2,
    senderId: "me",
    text: "Going great! Just finished the authentication module",
    timestamp: "10:32 AM",
    status: "read",
  },
  {
    id: 3,
    senderId: 1,
    text: "Awesome! Can you share the code for review?",
    timestamp: "10:33 AM",
    status: "read",
  },
  {
    id: 4,
    senderId: "me",
    text: "Sure! Here's the link: https://github.com/project/auth",
    timestamp: "10:35 AM",
    status: "delivered",
  },
  {
    id: 5,
    senderId: 1,
    text: "Thanks for the feedback! I'll implement those changes",
    timestamp: "10:38 AM",
    status: "read",
    isLatest: true,
  },
];

const MessageBubble = ({ message, isMe }) => {
  const statusIcons = {
    sent: <Check size={14} className="text-gray-400" />,
    delivered: <CheckCheck size={14} className="text-gray-400" />,
    read: <CheckCheck size={14} className="text-blue-500" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3 sm:mb-4`}
    >
      {!isMe && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 mr-2" />
      )}
      <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl text-sm sm:text-base ${
            isMe
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="break-words">{message.text}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 text-[10px] sm:text-xs ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="text-gray-400">{message.timestamp}</span>
          {isMe && statusIcons[message.status]}
        </div>
      </div>
    </motion.div>
  );
};

const ConversationItem = ({ conv, isActive, onClick, isMobile }) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: '#f3f4f6' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50' : ''
      } ${isMobile ? 'border-b border-gray-100' : ''}`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
        {conv.online && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{conv.name}</h3>
          <span className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap ml-2">{conv.timestamp}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {conv.typing ? (
            <span className="text-xs sm:text-sm text-green-600 animate-pulse">Typing...</span>
          ) : (
            <p className={`text-xs sm:text-sm truncate ${conv.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              {conv.lastMessage}
            </p>
          )}
          {conv.unread > 0 && (
            <span className="bg-blue-600 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center flex-shrink-0">
              {conv.unread}
            </span>
          )}
        </div>
      </div>

      {conv.pinned && (
        <Pin size={12} className="sm:hidden text-gray-400 flex-shrink-0" />
      )}
      {conv.pinned && (
        <Pin size={14} className="hidden sm:block text-gray-400 flex-shrink-0" />
      )}
    </motion.div>
  );
};

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [showAttachments, setShowAttachments] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowAttachments(!showAttachments)}
          className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
        >
          <Plus size={18} className="sm:hidden text-gray-500" />
          <Plus size={20} className="hidden sm:block text-gray-500" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write a message..."
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <Smile size={16} className="sm:hidden text-gray-400" />
              <Smile size={18} className="hidden sm:block text-gray-400" />
            </button>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-1.5 sm:p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send size={18} className="sm:hidden" />
          <Send size={20} className="hidden sm:block" />
        </button>
      </div>

      <AnimatePresence>
        {showAttachments && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-4 mt-3 pt-3 border-t border-gray-100"
          >
            <button className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Image size={14} className="sm:hidden text-blue-600" />
                <Image size={18} className="hidden sm:block text-blue-600" />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500">Image</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <File size={14} className="sm:hidden text-green-600" />
                <File size={18} className="hidden sm:block text-green-600" />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500">File</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Camera size={14} className="sm:hidden text-purple-600" />
                <Camera size={18} className="hidden sm:block text-purple-600" />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500">Camera</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Mic size={14} className="sm:hidden text-red-600" />
                <Mic size={18} className="hidden sm:block text-red-600" />
              </div>
              <span className="text-[10px] sm:text-xs text-gray-500">Audio</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MessagesPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [showDetails, setShowDetails] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [filter, setFilter] = useState("all");
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (windowWidth < 640 && selectedChat) {
      setShowMobileChat(true);
      setShowMobileSidebar(false);
    }
  }, [selectedChat, windowWidth]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      senderId: "me",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
    };
    setMessages([...messages, newMessage]);

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedChat.id
          ? { ...conv, lastMessage: text, timestamp: "Just now" }
          : conv
      )
    );
  };

  const handleBackToSidebar = () => {
    setShowMobileChat(false);
    setShowMobileSidebar(true);
    setSelectedChat(null);
  };

  const filteredConversations = conversations.filter(conv => {
    if (filter === "unread") return conv.unread > 0;
    if (filter === "pinned") return conv.pinned;
    return conv.name.toLowerCase().includes(search.toLowerCase());
  });

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

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
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className={`${
                    isMobile ? 'w-full absolute inset-0 z-10 bg-white' : 
                    isTablet ? 'w-80' : 'w-96'
                  } border-r border-gray-200 flex flex-col h-full`}
                >
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200 bg-white">
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Messages</h2>
                        <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                          <Edit3 size={16} className="sm:hidden text-gray-600" />
                          <Edit3 size={18} className="hidden sm:block text-gray-600" />
                        </button>
                      </div>
                      
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search messages..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        />
                      </div>

                      <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
                        {[
                          { id: "all", label: "All", icon: <MessageCircle size={12} /> },
                          { id: "unread", label: "Unread", icon: <Clock size={12} /> },
                          { id: "pinned", label: "Pinned", icon: <Pin size={12} /> },
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-2 sm:px-3 py-1.5 text-xs rounded-full transition-colors flex items-center gap-1 whitespace-nowrap ${
                              filter === f.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            <span className="sm:hidden">{f.icon}</span>
                            <span>{f.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-white">
                      {filteredConversations.length > 0 ? (
                        filteredConversations.map((conv) => (
                          <ConversationItem
                            key={conv.id}
                            conv={conv}
                            isActive={selectedChat?.id === conv.id}
                            onClick={() => setSelectedChat(conv)}
                            isMobile={isMobile}
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
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="flex-1 flex flex-col bg-white h-full"
                >
                  <div className="flex-shrink-0 px-3 sm:px-6 py-2 sm:py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {isMobile && (
                        <button
                          onClick={handleBackToSidebar}
                          className="p-1.5 hover:bg-gray-100 rounded-full"
                        >
                          <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                      )}
                      
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        {selectedChat.online && (
                          <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{selectedChat.name}</h3>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {selectedChat.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Phone size={16} className="sm:hidden text-gray-600" />
                        <Phone size={18} className="hidden sm:block text-gray-600" />
                      </button>
                      <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Video size={16} className="sm:hidden text-gray-600" />
                        <Video size={18} className="hidden sm:block text-gray-600" />
                      </button>
                      <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
                      >
                        <Info size={16} className="sm:hidden text-gray-600" />
                        <Info size={18} className="hidden sm:block text-gray-600" />
                      </button>
                      <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block">
                        <MoreVertical size={16} className="sm:hidden text-gray-600" />
                        <MoreVertical size={18} className="hidden sm:block text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2 bg-gray-50">
                    {messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isMe={msg.senderId === "me"}
                      />
                    ))}
                    <div ref={messagesEndRef} />

                    {selectedChat.typing && (
                      <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200" />
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <MessageInput onSend={handleSendMessage} />
                  </div>
                </motion.div>
              ) : !isMobile && !selectedChat ? (
                <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                  <div className="text-center p-4">
                    <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm sm:text-base">Select a conversation to start messaging</p>
                  </div>
                </div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showDetails && selectedChat && !isMobile && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: isTablet ? 240 : 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="border-l border-gray-200 hidden lg:block bg-white overflow-hidden"
                >
                  <div className="w-60 lg:w-72 h-full overflow-y-auto p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-sm sm:text-base text-gray-900">Details</h4>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X size={14} className="sm:hidden text-gray-500" />
                        <X size={16} className="hidden sm:block text-gray-500" />
                      </button>
                    </div>

                    <div className="text-center mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-2" />
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900">{selectedChat.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Active 2h ago</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <button className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                        <Star size={14} className="sm:hidden" />
                        <Star size={16} className="hidden sm:block" />
                        Add to favorites
                      </button>
                      <button className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                        <Archive size={14} className="sm:hidden" />
                        <Archive size={16} className="hidden sm:block" />
                        Archive chat
                      </button>
                      <button className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-left text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                        <Trash2 size={14} className="sm:hidden" />
                        <Trash2 size={16} className="hidden sm:block" />
                        Delete chat
                      </button>
                    </div>

                    <div>
                      <h5 className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase mb-2">Shared Media</h5>
                      <div className="grid grid-cols-3 gap-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="aspect-square bg-gray-100 rounded" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;