import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Bell, Shield, Lock, Eye, Globe, Moon, Sun,
  Smartphone, Mail, Key, CreditCard, History, Download,
  LogOut, Trash2, ChevronRight, Save, X, Check,
  AlertCircle, HelpCircle, ExternalLink, Camera,
  Github, Linkedin, Twitter, Instagram, Facebook
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Header from "../../layouts/LayoutComponents/Header";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const [darkMode, setDarkMode] = useState(false);
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

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessage({ type: "success", text: "Settings updated successfully!" });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    setSaving(false);
  };

  const sections = [
    { id: "account", label: "Account", icon: User },
    { id: "profile", label: "Profile", icon: Eye },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "sessions", label: "Sessions", icon: Smartphone },
    { id: "data", label: "Data & Privacy", icon: History },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 mt-1">Manage your account preferences and settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl border border-gray-200 sticky top-24">
                <nav className="p-4">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />
                          <span className="text-sm font-medium">{section.label}</span>
                        </div>
                        {activeSection === section.id && (
                          <ChevronRight size={16} className="text-blue-600" />
                        )}
                      </button>
                    );
                  })}

                  {/* Danger Zone */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Sign Out</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                      <span className="text-sm font-medium">Delete Account</span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  {/* Account Settings */}
                  {activeSection === "account" && (
                    <div>
                      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                        <p className="text-sm text-gray-500 mt-1">Update your account information</p>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="flex gap-3">
                            <input
                              type="email"
                              defaultValue={user?.email}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                              Verify
                            </button>
                          </div>
                        </div>

                        {/* Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                          </label>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                            Change Password
                          </button>
                        </div>

                        {/* Two Factor */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Two-Factor Authentication
                          </label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Add an extra layer of security</span>
                            <button
                              onClick={() => setTwoFactor(!twoFactor)}
                              className={`relative w-11 h-6 rounded-full transition-colors ${
                                twoFactor ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                            >
                              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                twoFactor ? 'translate-x-5' : ''
                              }`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile Settings */}
                  {activeSection === "profile" && (
                    <div>
                      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your public profile</p>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* Avatar */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Profile Photo
                          </label>
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                            <div>
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-2">
                                <Camera size={16} />
                                Upload New
                              </button>
                              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                            </div>
                          </div>
                        </div>

                        {/* Name */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              defaultValue={user?.firstName}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              defaultValue={user?.lastName}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Headline */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Headline
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Senior Developer at Company"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Bio */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                          </label>
                          <textarea
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell us about yourself"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            placeholder="City, Country"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        {/* Social Links */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Social Links
                          </label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <Github size={18} className="text-gray-400" />
                              <input
                                type="url"
                                placeholder="GitHub URL"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <Linkedin size={18} className="text-gray-400" />
                              <input
                                type="url"
                                placeholder="LinkedIn URL"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <Twitter size={18} className="text-gray-400" />
                              <input
                                type="url"
                                placeholder="Twitter URL"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeSection === "notifications" && (
                    <div>
                      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                        <p className="text-sm text-gray-500 mt-1">Choose what updates you receive</p>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* Email Notifications */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Email Notifications</h3>
                          <div className="space-y-3">
                            {[
                              { key: 'email', label: 'Email notifications' },
                              { key: 'marketing', label: 'Marketing emails' },
                            ].map((item) => (
                              <label key={item.key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{item.label}</span>
                                <button
                                  onClick={() => handleNotificationChange(item.key)}
                                  className={`relative w-11 h-6 rounded-full transition-colors ${
                                    notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                                  }`}
                                >
                                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                    notifications[item.key] ? 'translate-x-5' : ''
                                  }`} />
                                </button>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Push Notifications */}
                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Push Notifications</h3>
                          <div className="space-y-3">
                            {[
                              { key: 'push', label: 'Push notifications' },
                              { key: 'mentions', label: 'Mentions' },
                              { key: 'comments', label: 'Comments' },
                              { key: 'followers', label: 'New followers' },
                            ].map((item) => (
                              <label key={item.key} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{item.label}</span>
                                <button
                                  onClick={() => handleNotificationChange(item.key)}
                                  className={`relative w-11 h-6 rounded-full transition-colors ${
                                    notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                                  }`}
                                >
                                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                    notifications[item.key] ? 'translate-x-5' : ''
                                  }`} />
                                </button>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Privacy & Security */}
                  {activeSection === "privacy" && (
                    <div>
                      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Privacy & Security</h2>
                        <p className="text-sm text-gray-500 mt-1">Control your privacy settings</p>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* Profile Visibility */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Profile Visibility</h3>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Public</option>
                            <option>Private</option>
                            <option>Connections only</option>
                          </select>
                        </div>

                        {/* Activity Visibility */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Activity Visibility</h3>
                          <div className="space-y-3">
                            <label className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Show activity status</span>
                              <button className="relative w-11 h-6 bg-blue-600 rounded-full">
                                <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full translate-x-5" />
                              </button>
                            </label>
                            <label className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Show last seen</span>
                              <button className="relative w-11 h-6 bg-gray-300 rounded-full">
                                <span className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full" />
                              </button>
                            </label>
                          </div>
                        </div>

                        {/* Blocked Users */}
                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Blocked Users</h3>
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            Manage blocked users
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preferences */}
                  {activeSection === "preferences" && (
                    <div>
                      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                        <p className="text-sm text-gray-500 mt-1">Customize your experience</p>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* Theme */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Theme</h3>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setDarkMode(false)}
                              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                                !darkMode ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <Sun size={18} />
                              Light
                            </button>
                            <button
                              onClick={() => setDarkMode(true)}
                              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                                darkMode ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <Moon size={18} />
                              Dark
                            </button>
                          </div>
                        </div>

                        {/* Language */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                        </div>

                        {/* Timezone */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timezone
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>UTC-08:00 Pacific Time</option>
                            <option>UTC-05:00 Eastern Time</option>
                            <option>UTC+00:00 Greenwich Mean Time</option>
                            <option>UTC+05:30 India Standard Time</option>
                          </select>
                        </div>

                        {/* Date Format */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Format
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Billing */}
                  {activeSection === "billing" && (
                    <div>
                      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Billing & Subscription</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your subscription and payment methods</p>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* Current Plan */}
                        <div className="bg-blue-50 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Plan: Pro</h3>
                          <p className="text-sm text-gray-600 mb-4">$29/month · Next billing on March 1, 2024</p>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                            Manage Subscription
                          </button>
                        </div>

                        {/* Payment Methods */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Payment Methods</h3>
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CreditCard size={18} className="text-gray-400" />
                                <span className="text-sm">Visa ending in 4242</span>
                              </div>
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Default</span>
                            </div>
                          </div>
                          <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                            Add payment method
                          </button>
                        </div>

                        {/* Billing History */}
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Billing History</h3>
                          <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                                <span className="text-sm">Feb 1, 2024</span>
                                <span className="text-sm font-medium">$29.00</span>
                                <button className="text-xs text-blue-600 hover:text-blue-700">Download</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sessions */}
                  {activeSection === "sessions" && (
                    <div>
                      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Active Sessions</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your logged-in devices</p>
                      </div>
                      <div className="p-6 space-y-4">
                        {/* Current Session */}
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center gap-3 mb-2">
                            <Smartphone size={18} className="text-blue-600" />
                            <span className="font-medium text-gray-900">Current Session</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active now</span>
                          </div>
                          <p className="text-sm text-gray-600">Chrome on macOS · IP: 192.168.1.1</p>
                        </div>

                        {/* Other Sessions */}
                        {[1, 2].map((i) => (
                          <div key={i} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Smartphone size={18} className="text-gray-400" />
                                <span className="font-medium text-gray-900">Firefox on Windows</span>
                              </div>
                              <button className="text-sm text-red-600 hover:text-red-700">
                                Sign Out
                              </button>
                            </div>
                            <p className="text-sm text-gray-500">Last active 2 days ago · IP: 192.168.1.2</p>
                          </div>
                        ))}

                        <button className="w-full mt-4 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm">
                          Sign Out All Devices
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Data & Privacy */}
                  {activeSection === "data" && (
                    <div>
                      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
                        <p className="text-sm text-gray-500 mt-1">Control your data and privacy settings</p>
                      </div>
                      <div className="p-6 space-y-6">
                        {/* Download Data */}
                        <div className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-medium text-gray-900 mb-2">Download your data</h3>
                          <p className="text-sm text-gray-600 mb-4">Get a copy of your data in JSON format</p>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Download size={16} />
                            Request Data Export
                          </button>
                        </div>

                        {/* Delete Account */}
                        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                          <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
                          <p className="text-sm text-red-600 mb-4">Once deleted, your account cannot be recovered</p>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                            Delete Account
                          </button>
                        </div>

                        {/* Privacy Policy Links */}
                        <div className="pt-4 border-t border-gray-200">
                          <h3 className="text-sm font-medium text-gray-900 mb-3">Legal</h3>
                          <div className="space-y-2">
                            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                              Privacy Policy
                              <ExternalLink size={12} />
                            </a>
                            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                              Terms of Service
                              <ExternalLink size={12} />
                            </a>
                            <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                              Cookie Policy
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Footer */}
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {message.text && (
                        <div className={`flex items-center gap-2 text-sm ${
                          message.type === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                          {message.text}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-white transition-colors">
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={16} />
                            Save Changes
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
    </div>
  );
};

export default SettingsPage;