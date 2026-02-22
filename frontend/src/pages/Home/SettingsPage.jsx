import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, Shield, Lock, Eye, Globe, Moon, Sun,
  Smartphone, Mail, Key, CreditCard, History, Download,
  LogOut, Trash2, ChevronRight, Save, X, Check,
  AlertCircle, HelpCircle, ExternalLink, Camera,
  Github, Linkedin, Twitter, Instagram, Facebook,
  Menu, Settings, ChevronLeft
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../layouts/LayoutComponents/Header";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    mentions: true,
    comments: true,
    followers: true
  });
  const [twoFactor, setTwoFactor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 1024) {
      setMobileMenuOpen(false);
    }
  }, [activeSection, windowWidth]);

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage({ type: "success", text: "Settings updated successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    setSaving(false);
  };

  const sections = [
    { id: "account", label: "Account", icon: User, color: "blue" },
    { id: "profile", label: "Profile", icon: Eye, color: "purple" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "yellow" },
    { id: "privacy", label: "Privacy & Security", icon: Shield, color: "green" },
    { id: "preferences", label: "Preferences", icon: Globe, color: "indigo" },
    { id: "billing", label: "Billing", icon: CreditCard, color: "pink" },
    { id: "sessions", label: "Sessions", icon: Smartphone, color: "orange" },
    { id: "data", label: "Data & Privacy", icon: History, color: "red" },
  ];

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-14 sm:pt-16 md:pt-20 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="mb-4 sm:mb-6 lg:mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                {isMobile ? 'Manage your preferences' : 'Manage your account preferences and settings'}
              </p>
            </div>
            
            {!isDesktop && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                {mobileMenuOpen ? (
                  <X size={20} className="text-gray-600" />
                ) : (
                  <Menu size={20} className="text-gray-600" />
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 relative">
            <AnimatePresence>
              {(mobileMenuOpen || isDesktop) && (
                <motion.div
                  initial={isDesktop ? false : { x: -300, opacity: 0 }}
                  animate={isDesktop ? {} : { x: 0, opacity: 1 }}
                  exit={isDesktop ? {} : { x: -300, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className={`
                    ${isDesktop ? 'lg:col-span-3' : ''}
                    ${!isDesktop ? 'fixed inset-0 z-50 bg-white' : ''}
                    lg:relative lg:z-auto
                  `}
                >
                  {!isDesktop && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <X size={20} className="text-gray-600" />
                      </button>
                    </div>
                  )}
                  
                  <div className={`
                    ${isDesktop ? 'bg-white rounded-xl border border-gray-200 sticky top-24' : 'h-full overflow-y-auto'}
                  `}>
                    <nav className={`${isDesktop ? 'p-3 sm:p-4' : 'p-4'}`}>
                      {sections.map((section) => {
                        const Icon = section.icon;
                        const colors = {
                          blue: 'text-blue-600 bg-blue-50',
                          purple: 'text-purple-600 bg-purple-50',
                          yellow: 'text-yellow-600 bg-yellow-50',
                          green: 'text-green-600 bg-green-50',
                          indigo: 'text-indigo-600 bg-indigo-50',
                          pink: 'text-pink-600 bg-pink-50',
                          orange: 'text-orange-600 bg-orange-50',
                          red: 'text-red-600 bg-red-50'
                        };
                        
                        return (
                          <button
                            key={section.id}
                            onClick={() => {
                              setActiveSection(section.id);
                              if (!isDesktop) setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all mb-1 ${
                              activeSection === section.id
                                ? colors[section.color] + ' font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Icon size={isMobile ? 16 : 18} />
                              <span className="text-xs sm:text-sm font-medium">{section.label}</span>
                            </div>
                            {activeSection === section.id && (
                              <ChevronRight size={isMobile ? 14 : 16} className="flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}

                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                        <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm">
                          <LogOut size={isMobile ? 16 : 18} />
                          <span className="font-medium">Sign Out</span>
                        </button>
                        <button className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm">
                          <Trash2 size={isMobile ? 16 : 18} />
                          <span className="font-medium">Delete Account</span>
                        </button>
                      </div>
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`
              ${isDesktop ? 'lg:col-span-9' : 'w-full'}
              ${!isDesktop && mobileMenuOpen ? 'hidden' : 'block'}
            `}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-2">
                      {!isDesktop && (
                        <button
                          onClick={() => setMobileMenuOpen(true)}
                          className="p-1.5 hover:bg-gray-200 rounded-lg lg:hidden"
                        >
                          <ChevronLeft size={16} className="text-gray-600" />
                        </button>
                      )}
                      <div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                          {sections.find(s => s.id === activeSection)?.label} Settings
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {getSectionDescription(activeSection)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {activeSection === "account" && (
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Email Address
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <input
                              type="email"
                              defaultValue={user?.email}
                              className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors whitespace-nowrap">
                              Verify
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Password
                          </label>
                          <button className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors">
                            Change Password
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Two-Factor Authentication
                          </label>
                          <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-gray-600">Add an extra layer of security</span>
                            <button
                              onClick={() => setTwoFactor(!twoFactor)}
                              className={`relative w-10 sm:w-11 h-5 sm:h-6 rounded-full transition-colors ${
                                twoFactor ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                twoFactor ? 'translate-x-5 sm:translate-x-5' : ''
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === "profile" && (
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            Profile Photo
                          </label>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div>
                              <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Camera size={isMobile ? 14 : 16} />
                                Upload New
                              </button>
                              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              defaultValue={user?.firstName}
                              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              defaultValue={user?.lastName}
                              className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Headline
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Senior Developer at Company"
                            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Bio
                          </label>
                          <textarea
                            rows={isMobile ? 3 : 4}
                            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell us about yourself"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            placeholder="City, Country"
                            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            Social Links
                          </label>
                          <div className="space-y-2 sm:space-y-3">
                            {[
                              { icon: Github, placeholder: "GitHub URL" },
                              { icon: Linkedin, placeholder: "LinkedIn URL" },
                              { icon: Twitter, placeholder: "Twitter URL" },
                            ].map((social, index) => {
                              const Icon = social.icon;
                              return (
                                <div key={index} className="flex items-center gap-2 sm:gap-3">
                                  <Icon size={isMobile ? 16 : 18} className="text-gray-400 flex-shrink-0" />
                                  <input
                                    type="url"
                                    placeholder={social.placeholder}
                                    className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === "notifications" && (
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Email Notifications</h3>
                          <div className="space-y-2 sm:space-y-3">
                            {[
                              { key: 'email', label: 'Email notifications' },
                              { key: 'marketing', label: 'Marketing emails' },
                            ].map((item) => (
                              <label key={item.key} className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm text-gray-600">{item.label}</span>
                                <button
                                  onClick={() => handleNotificationChange(item.key)}
                                  className={`relative w-10 sm:w-11 h-5 sm:h-6 rounded-full transition-colors ${
                                    notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                                  }`}
                                >
                                  <span className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                    notifications[item.key] ? 'translate-x-5 sm:translate-x-5' : ''
                                  }`} />
                                </button>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Push Notifications</h3>
                          <div className="space-y-2 sm:space-y-3">
                            {[
                              { key: 'push', label: 'Push notifications' },
                              { key: 'mentions', label: 'Mentions' },
                              { key: 'comments', label: 'Comments' },
                              { key: 'followers', label: 'New followers' },
                            ].map((item) => (
                              <label key={item.key} className="flex items-center justify-between">
                                <span className="text-xs sm:text-sm text-gray-600">{item.label}</span>
                                <button
                                  onClick={() => handleNotificationChange(item.key)}
                                  className={`relative w-10 sm:w-11 h-5 sm:h-6 rounded-full transition-colors ${
                                    notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                                  }`}
                                >
                                  <span className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                    notifications[item.key] ? 'translate-x-5 sm:translate-x-5' : ''
                                  }`} />
                                </button>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === "privacy" && (
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Profile Visibility</h3>
                          <select className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Public</option>
                            <option>Private</option>
                            <option>Connections only</option>
                          </select>
                        </div>

                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Activity Visibility</h3>
                          <div className="space-y-2 sm:space-y-3">
                            <label className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm text-gray-600">Show activity status</span>
                              <button className="relative w-10 sm:w-11 h-5 sm:h-6 bg-blue-600 rounded-full">
                                <span className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 bg-white rounded-full translate-x-5" />
                              </button>
                            </label>
                            <label className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm text-gray-600">Show last seen</span>
                              <button className="relative w-10 sm:w-11 h-5 sm:h-6 bg-gray-300 rounded-full">
                                <span className="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 bg-white rounded-full" />
                              </button>
                            </label>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Blocked Users</h3>
                          <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-700">
                            Manage blocked users
                          </button>
                        </div>
                      </div>
                    )}

                    {activeSection === "preferences" && (
                      <div className="space-y-4 sm:space-y-6">
                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Theme</h3>
                          <div className="flex gap-2 sm:gap-3">
                            <button
                              onClick={() => setDarkMode(false)}
                              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg transition-colors ${
                                !darkMode ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <Sun size={isMobile ? 14 : 18} />
                              Light
                            </button>
                            <button
                              onClick={() => setDarkMode(true)}
                              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border rounded-lg transition-colors ${
                                darkMode ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <Moon size={isMobile ? 14 : 18} />
                              Dark
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Language
                          </label>
                          <select className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Timezone
                          </label>
                          <select className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>UTC-08:00 Pacific Time</option>
                            <option>UTC-05:00 Eastern Time</option>
                            <option>UTC+00:00 Greenwich Mean Time</option>
                            <option>UTC+05:30 India Standard Time</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                            Date Format
                          </label>
                          <select className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {activeSection === "billing" && (
                      <div className="space-y-4 sm:space-y-6">
                        <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Current Plan: Pro</h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">$29/month · Next billing on March 1, 2024</p>
                          <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-colors">
                            Manage Subscription
                          </button>
                        </div>

                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Payment Methods</h3>
                          <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <CreditCard size={isMobile ? 16 : 18} className="text-gray-400" />
                                <span className="text-xs sm:text-sm">Visa ending in 4242</span>
                              </div>
                              <span className="text-[10px] sm:text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Default</span>
                            </div>
                          </div>
                          <button className="mt-2 sm:mt-3 text-xs sm:text-sm text-blue-600 hover:text-blue-700">
                            Add payment method
                          </button>
                        </div>

                        <div>
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Billing History</h3>
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-xs sm:text-sm">Feb 1, 2024</span>
                                <span className="text-xs sm:text-sm font-medium">$29.00</span>
                                <button className="text-[10px] sm:text-xs text-blue-600 hover:text-blue-700">Download</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSection === "sessions" && (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                            <Smartphone size={isMobile ? 16 : 18} className="text-blue-600" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900">Current Session</span>
                            <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active now</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">Chrome on macOS · IP: 192.168.1.1</p>
                        </div>

                        {[1, 2].map((i) => (
                          <div key={i} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <Smartphone size={isMobile ? 16 : 18} className="text-gray-400" />
                                <span className="text-xs sm:text-sm font-medium text-gray-900">Firefox on Windows</span>
                              </div>
                              <button className="text-xs sm:text-sm text-red-600 hover:text-red-700">
                                Sign Out
                              </button>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500">Last active 2 days ago · IP: 192.168.1.2</p>
                          </div>
                        ))}

                        <button className="w-full mt-3 sm:mt-4 px-3 sm:px-4 py-2.5 sm:py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs sm:text-sm">
                          Sign Out All Devices
                        </button>
                      </div>
                    )}

                    {activeSection === "data" && (
                      <div className="space-y-4 sm:space-y-6">
                        <div className="border border-gray-200 rounded-lg p-3 sm:p-4">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">Download your data</h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Get a copy of your data in JSON format</p>
                          <button className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Download size={isMobile ? 14 : 16} />
                            Request Data Export
                          </button>
                        </div>

                        <div className="border border-red-200 rounded-lg p-3 sm:p-4 bg-red-50">
                          <h3 className="text-xs sm:text-sm font-medium text-red-800 mb-1.5 sm:mb-2">Delete Account</h3>
                          <p className="text-xs sm:text-sm text-red-600 mb-3 sm:mb-4">Once deleted, your account cannot be recovered</p>
                          <button className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm hover:bg-red-700 transition-colors">
                            Delete Account
                          </button>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2 sm:mb-3">Legal</h3>
                          <div className="space-y-1.5 sm:space-y-2">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, index) => (
                              <a key={index} href="#" className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900">
                                {item}
                                <ExternalLink size={isMobile ? 10 : 12} />
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Save Footer */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-2">
                      {message.text && (
                        <div className={`flex items-center gap-1.5 text-xs sm:text-sm ${
                          message.type === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {message.type === 'success' ? <Check size={isMobile ? 14 : 16} /> : <AlertCircle size={isMobile ? 14 : 16} />}
                          {message.text}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm hover:bg-white transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent" />
                            <span className="text-xs sm:text-sm">Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save size={isMobile ? 14 : 16} />
                            <span className="text-xs sm:text-sm">Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {mobileMenuOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const getSectionDescription = (section) => {
  const descriptions = {
    account: "Update your account information",
    profile: "Manage your public profile",
    notifications: "Choose what updates you receive",
    privacy: "Control your privacy settings",
    preferences: "Customize your experience",
    billing: "Manage your subscription and payment methods",
    sessions: "Manage your logged-in devices",
    data: "Control your data and privacy settings"
  };
  return descriptions[section] || "";
};

export default SettingsPage;