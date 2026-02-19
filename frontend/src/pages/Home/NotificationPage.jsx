import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Heart, MessageCircle, UserPlus, Star, Award,
  Briefcase, Calendar, Check, CheckCheck, Clock,
  Filter, MoreHorizontal, Settings, Mail, Phone,
  Link as LinkIcon, X, AlertCircle, ThumbsUp,
  Users, Share2, Bookmark, Flag, AtSign,
  ChevronRight, Eye, EyeOff, Volume2, VolumeX
} from "lucide-react";
import Header from "../../layouts/LayoutComponents/Header";
import { useAuth } from "../../context/AuthContext";

const mockNotifications = [
  {
    id: 1,
    type: "like",
    user: {
      name: "Sarah Johnson",
      avatar: null,
      username: "@sarahj"
    },
    content: "liked your post about React best practices",
    target: "React Development Tips",
    time: "2 minutes ago",
    read: false,
    important: true,
  },
  {
    id: 2,
    type: "comment",
    user: {
      name: "Mike Chen",
      avatar: null,
      username: "@mikechen"
    },
    content: "commented on your post: 'Great insights! Would love to see more'",
    target: "Understanding useMemo Hook",
    time: "1 hour ago",
    read: false,
    important: false,
  },
  {
    id: 3,
    type: "follow",
    user: {
      name: "Alex Rivera",
      avatar: null,
      username: "@alexrivera"
    },
    content: "started following you",
    time: "3 hours ago",
    read: true,
    important: false,
  },
  {
    id: 4,
    type: "mention",
    user: {
      name: "Emily Watson",
      avatar: null,
      username: "@emilyw"
    },
    content: "mentioned you in a comment: '@username check out this tutorial'",
    target: "Advanced TypeScript Tips",
    time: "5 hours ago",
    read: true,
    important: true,
  },
  {
    id: 5,
    type: "share",
    user: {
      name: "David Kim",
      avatar: null,
      username: "@davidk"
    },
    content: "shared your post",
    target: "10 Tips for Better Code",
    time: "1 day ago",
    read: true,
    important: false,
  },
  {
    id: 6,
    type: "achievement",
    user: {
      name: "System",
      avatar: null,
      username: "system"
    },
    content: "You've reached 100 followers! 🎉",
    time: "2 days ago",
    read: true,
    important: true,
  },
  {
    id: 7,
    type: "job",
    user: {
      name: "TechCorp",
      avatar: null,
      username: "@techcorp"
    },
    content: "New job posting: Senior Frontend Developer",
    time: "3 days ago",
    read: true,
    important: false,
  },
  {
    id: 8,
    type: "event",
    user: {
      name: "React Meetup",
      avatar: null,
      username: "@reactmeetup"
    },
    content: "Event tomorrow: React Advanced Patterns",
    time: "4 days ago",
    read: true,
    important: false,
  },
];

// Notification Icon Component
const NotificationIcon = ({ type }) => {
  const icons = {
    like: <Heart size={18} className="text-red-500" />,
    comment: <MessageCircle size={18} className="text-blue-500" />,
    follow: <UserPlus size={18} className="text-green-500" />,
    mention: <AtSign size={18} className="text-purple-500" />,
    share: <Share2 size={18} className="text-indigo-500" />,
    achievement: <Award size={18} className="text-yellow-500" />,
    job: <Briefcase size={18} className="text-orange-500" />,
    event: <Calendar size={18} className="text-pink-500" />,
  };
  return icons[type] || <Bell size={18} className="text-gray-500" />;
};

// Notification Item Component
const NotificationItem = ({ notification, onMarkRead, onArchive }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`relative group ${
        !notification.read ? 'bg-blue-50/50' : ''
      } hover:bg-gray-50 transition-colors`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex gap-4 p-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            !notification.read ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <NotificationIcon type={notification.type} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{notification.user.name}</span>{" "}
                {notification.content}
              </p>
              {notification.target && (
                <p className="text-sm text-blue-600 mt-1 hover:underline cursor-pointer">
                  {notification.target}
                </p>
              )}
            </div>
            
            {/* Important Badge */}
            {notification.important && (
              <span className="flex-shrink-0 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                Important
              </span>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={12} />
              {notification.time}
            </span>
            {notification.user.username !== "system" && (
              <span className="text-xs text-gray-400">{notification.user.username}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white shadow-lg rounded-lg border border-gray-200 p-1"
            >
              {!notification.read && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                  title="Mark as read"
                >
                  <Check size={16} className="text-blue-600" />
                </button>
              )}
              <button
                onClick={() => onArchive(notification.id)}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Archive"
              >
                <X size={16} className="text-gray-500" />
              </button>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="More options">
                <MoreHorizontal size={16} className="text-gray-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread Indicator */}
        {!notification.read && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
        )}
      </div>
    </motion.div>
  );
};

// Quick Filter Component
const QuickFilter = ({ icon: Icon, label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      active ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-600'
    }`}
  >
    <Icon size={16} />
    <span className="text-sm font-medium">{label}</span>
    {count > 0 && (
      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
        active ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const NotificationPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("all");

  // Stats
  const unreadCount = notifications.filter(n => !n.read).length;
  const importantCount = notifications.filter(n => n.important).length;

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleArchive = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "important") return n.important;
    if (filter === "mentions") return n.type === "mention";
    if (selectedType !== "all") return n.type === selectedType;
    return true;
  });

  const notificationTypes = [
    { id: "all", label: "All", icon: Bell, count: notifications.length },
    { id: "unread", label: "Unread", icon: Eye, count: unreadCount },
    { id: "important", label: "Important", icon: Star, count: importantCount },
    { id: "mentions", label: "Mentions", icon: AtSign, count: notifications.filter(n => n.type === "mention").length },
    { id: "likes", label: "Likes", icon: Heart, count: notifications.filter(n => n.type === "like").length },
    { id: "comments", label: "Comments", icon: MessageCircle, count: notifications.filter(n => n.type === "comment").length },
    { id: "follows", label: "Follows", icon: UserPlus, count: notifications.filter(n => n.type === "follow").length },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-500 mt-1">Stay updated with your activity</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                title={soundEnabled ? "Mute notifications" : "Unmute notifications"}
              >
                {soundEnabled ? (
                  <Volume2 size={20} className="text-gray-600" />
                ) : (
                  <VolumeX size={20} className="text-gray-400" />
                )}
              </button>

              {/* Settings */}
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Settings size={20} className="text-gray-600" />
              </button>

              {/* Mark all read */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <CheckCheck size={16} />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-gray-700">Quick Filters</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Filter size={14} />
                {showFilters ? 'Show less' : 'Show more'}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {notificationTypes.slice(0, showFilters ? undefined : 4).map((type) => (
                <QuickFilter
                  key={type.id}
                  icon={type.icon}
                  label={type.label}
                  count={type.count}
                  active={filter === type.id}
                  onClick={() => setFilter(filter === type.id ? "all" : type.id)}
                />
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Today's Section */}
            {filteredNotifications.length > 0 ? (
              <>
                {/* Today */}
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkRead={handleMarkRead}
                      onArchive={handleArchive}
                    />
                  ))}
                </div>

                {/* Load More */}
                <div className="p-4 text-center border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Load more notifications
                  </button>
                </div>
              </>
            ) : (
              // Empty State
              <div className="py-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  When you get notifications, they'll appear here. Stay tuned for updates!
                </p>
              </div>
            )}
          </div>

          {/* Notification Settings Summary */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 flex items-start gap-3">
            <Bell size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Notification Settings</h4>
              <p className="text-xs text-blue-700">
                You're receiving notifications for: Likes, Comments, Follows, and Mentions. 
                <button className="ml-1 text-blue-800 hover:underline">Manage preferences</button>
              </p>
            </div>
          </div>

          {/* Weekly Digest */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail size={18} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Weekly Digest</h3>
                  <p className="text-xs text-gray-500">Get a summary of your weekly activity</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationPage;