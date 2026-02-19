import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Send, MoreVertical, Phone, Video, Image,
  Paperclip, Smile, Check, CheckCheck, User, Users,
  Archive, Trash2, Star, Pin, Clock, Filter,
  Mic, Camera, File, X, Plus, Edit3
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../layouts/LayoutComponents/Header";


// Mock data for conversations
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
];

// Mock messages for selected conversation
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

// Message Component
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
      className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
    >
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 mr-2" />
      )}
      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isMe
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        <div className={`flex items-center gap-1 mt-1 text-xs ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="text-gray-400">{message.timestamp}</span>
          {isMe && statusIcons[message.status]}
        </div>
      </div>
    </motion.div>
  );
};

// Conversation Item Component
const ConversationItem = ({ conv, isActive, onClick }) => {
  return (
    <motion.div
      whileHover={{ backgroundColor: '#f3f4f6' }}
      onClick={onClick}
      className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50' : ''
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
        {conv.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{conv.name}</h3>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{conv.timestamp}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {conv.typing ? (
            <span className="text-sm text-green-600 animate-pulse">Typing...</span>
          ) : (
            <p className={`text-sm truncate ${conv.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              {conv.lastMessage}
            </p>
          )}
          {conv.unread > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
              {conv.unread}
            </span>
          )}
        </div>
      </div>

      {conv.pinned && (
        <Pin size={14} className="text-gray-400 flex-shrink-0" />
      )}
    </motion.div>
  );
};

// Message Input Component
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
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowAttachments(!showAttachments)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Plus size={20} className="text-gray-500" />
        </button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write a message..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <Smile size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>

      <AnimatePresence>
        {showAttachments && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100"
          >
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Image size={18} className="text-blue-600" />
              </div>
              <span className="text-xs text-gray-500">Image</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <File size={18} className="text-green-600" />
              </div>
              <span className="text-xs text-gray-500">File</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Camera size={18} className="text-purple-600" />
              </div>
              <span className="text-xs text-gray-500">Camera</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Mic size={18} className="text-red-600" />
              </div>
              <span className="text-xs text-gray-500">Audio</span>
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
  const [selectedChat, setSelectedChat] = useState(mockConversations[0]);
  const [conversations, setConversations] = useState(mockConversations);
  const [messages, setMessages] = useState(mockMessages);
  const [showDetails, setShowDetails] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, pinned
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      senderId: "me",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent",
    };
    setMessages([...messages, newMessage]);

    // Update last message in conversation
    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedChat.id
          ? { ...conv, lastMessage: text, timestamp: "Just now" }
          : conv
      )
    );
  };

  const filteredConversations = conversations.filter(conv => {
    if (filter === "unread") return conv.unread > 0;
    if (filter === "pinned") return conv.pinned;
    return conv.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 h-[calc(100vh-5rem)]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white rounded-xl border border-gray-200 h-full flex overflow-hidden">
            
            {/* Left Sidebar - Conversations */}
            <div className="w-full sm:w-80 md:w-96 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Edit3 size={18} className="text-gray-600" />
                  </button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-2 mt-3">
                  {[
                    { id: "all", label: "All" },
                    { id: "unread", label: "Unread" },
                    { id: "pinned", label: "Pinned" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        filter === f.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={selectedChat?.id === conv.id}
                    onClick={() => setSelectedChat(conv)}
                  />
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                        {selectedChat.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                        <p className="text-xs text-gray-500">
                          {selectedChat.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Phone size={18} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Video size={18} className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    {messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isMe={msg.senderId === "me"}
                      />
                    ))}
                    <div ref={messagesEndRef} />

                    {/* Typing Indicator */}
                    {selectedChat.typing && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <div className="w-6 h-6 rounded-full bg-gray-200" />
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <MessageInput onSend={handleSendMessage} />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  Select a conversation to start messaging
                </div>
              )}
            </div>

            {/* Right Sidebar - Chat Details (Optional) */}
            {showDetails && selectedChat && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-gray-200 hidden lg:block"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Details</h4>
                    <button
                      onClick={() => setShowDetails(false)}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>

                  {/* Profile */}
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">Active 2h ago</p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 mb-4">
                    <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                      <Star size={16} />
                      Add to favorites
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2">
                      <Archive size={16} />
                      Archive chat
                    </button>
                    <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                      <Trash2 size={16} />
                      Delete chat
                    </button>
                  </div>

                  {/* Shared Media */}
                  <div>
                    <h5 className="text-xs font-medium text-gray-400 uppercase mb-2">Shared Media</h5>
                    <div className="grid grid-cols-3 gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagesPage;