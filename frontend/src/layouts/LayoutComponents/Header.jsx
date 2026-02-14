import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search,
    Home,
    Users,
    Briefcase,
    MessageCircle,
    Bell,
    ChevronDown,
    Linkedin,
    LogOut,
    Settings,
    UserCircle,
    ChevronRight,
    MapPin,
    Menu,
    X
} from 'lucide-react';
import NavItem from './NavItem';
import { useAuth } from '../../context/AuthContext';
import { getPublicProfiles } from '../../services/profile.service';

let debounceTimer;

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const profileMenuRef = useRef(null);
    const searchDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setShowMobileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setShowMobileMenu(false);
    }, [location.pathname]);

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        clearTimeout(debounceTimer);

        if (!value.trim()) {
            setSuggestions([]);
            setShowSearchDropdown(false);
            return;
        }

        setLoading(true);
        debounceTimer = setTimeout(async () => {
            try {
                const res = await getPublicProfiles(value);
                setSuggestions(res.data.data.slice(0, 5));
                setShowSearchDropdown(true);
            } catch (error) {
                console.error('Search failed:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSearchFocus = () => {
        if (searchQuery.trim() && suggestions.length > 0) {
            setShowSearchDropdown(true);
        }
    };

    const openProfile = (userId) => {
        setShowSearchDropdown(false);
        setSearchQuery('');
        navigate(`/profile/${userId}`);
    };

    const handleLogout = async () => {
        try {
            setShowProfileMenu(false);
            await logout();
            navigate('/auth/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
            navigate('/auth/login', { replace: true });
        }
    };

    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || 'U';
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Get avatar URL from user object
    const getAvatarUrl = () => {
        return user?.avatarUrl || null;
    };

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white border-b border-gray-200 fixed top-0 w-full z-50"
        >
            <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                {/* Left section - Logo and mobile menu */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {showMobileMenu ? (
                            <X className="w-5 h-5 text-gray-600" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    {/* Logo */}
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/feed')}
                        className="flex items-center text-blue-600 font-bold text-xl sm:text-2xl cursor-pointer"
                    >
                        <Linkedin className="w-6 h-6 sm:w-8 sm:h-8 mr-1" />
                        <span className="text-gray-800 hidden xs:inline">LinkedIn</span>
                    </motion.div>
                </div>
                
                {/* Search Bar - Hidden on mobile */}
                <div className="hidden md:block flex-1 max-w-md mx-4 relative" ref={searchDropdownRef}>
                    <div className="relative group">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                            showSearchDropdown ? 'text-blue-500' : 'text-gray-400'
                        }`} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={handleSearchFocus}
                            className="w-full bg-gray-100 rounded-md pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
                        />
                        {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Search Suggestions Dropdown */}
                    <AnimatePresence>
                        {showSearchDropdown && suggestions.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute w-full bg-white border border-gray-200 shadow-xl rounded-lg mt-1 z-50 overflow-hidden"
                            >
                                {suggestions.map((profile) => (
                                    <motion.div
                                        key={profile._id}
                                        whileHover={{ backgroundColor: '#f3f4f6' }}
                                        onClick={() => openProfile(profile.userId._id)}
                                        className="flex items-center gap-3 p-3 cursor-pointer border-b last:border-none"
                                    >
                                        <img
                                            src={profile.avatarUrl || "/avatar-placeholder.png"}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-100"
                                            alt={profile.userId?.firstName || 'User'}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-gray-900 truncate">
                                                {profile.userId?.firstName} {profile.userId?.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {profile.headline || 'No headline'}
                                            </p>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                                    </motion.div>
                                ))}
                                
                                {/* View all results option - FIXED with leading slash */}
                                <motion.div
                                    whileHover={{ backgroundColor: '#f3f4f6' }}
                                    onClick={() => {
                                        setShowSearchDropdown(false);
                                        navigate('/home/public-profiles'); 
                                    }}
                                    className="p-2 text-center border-t border-gray-100 cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                    <span className="text-xs text-blue-600 font-medium">
                                        View all results
                                    </span>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* Desktop Navigation Icons */}
                <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                    <NavItem 
                        icon={Home} 
                        label="Home" 
                        active={isActive('/home')} 
                        onClick={() => navigate('/home')}
                    />
                    <NavItem 
                        icon={Users} 
                        label="Explore" 
                        active={isActive('/home/public-profiles')} 
                        onClick={() => navigate('/home/public-profiles')}
                    />
                    <NavItem 
                        icon={Briefcase} 
                        label="Jobs" 
                        active={isActive('/jobs')} 
                        onClick={() => navigate('/jobs')}
                    />
                    <NavItem 
                        icon={MessageCircle} 
                        label="Messages" 
                        active={isActive('/messages')} 
                        onClick={() => navigate('/messages')}
                    />
                    <NavItem 
                        icon={Bell} 
                        label="Notifications" 
                        active={isActive('/notifications')} 
                        onClick={() => navigate('/notifications')}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative" ref={profileMenuRef}>
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="relative cursor-pointer"
                        >
                            <div className="flex items-center space-x-1">
                                {getAvatarUrl() ? (
                                    <img 
                                        src={getAvatarUrl()} 
                                        alt={user?.firstName || 'User'}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `<div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">${getInitials()}</div>`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {getInitials()}
                                    </div>
                                )}
                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''} hidden lg:block`} />
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                                >
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="font-semibold text-gray-900">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">
                                            {user?.email}
                                        </p>
                                        {user?.headline && (
                                            <p className="text-xs text-gray-400 mt-1 truncate">
                                                {user.headline}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate(`/profile/${user?.id}`);
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                                    >
                                        <UserCircle size={18} className="text-gray-500" />
                                        <span className="text-sm">View Profile</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            navigate('/settings');
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors"
                                    >
                                        <Settings size={18} className="text-gray-500" />
                                        <span className="text-sm">Settings</span>
                                    </button>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-2 transition-colors text-red-600"
                                    >
                                        <LogOut size={18} />
                                        <span className="text-sm">Sign Out</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {showMobileMenu && (
                    <MobileNavigationMenu
                        ref={mobileMenuRef}
                        navigate={navigate}
                        isActive={isActive}
                        onClose={() => setShowMobileMenu(false)}
                    />
                )}
            </AnimatePresence>
        </motion.header>
    );
};

const MobileNavigationMenu = React.forwardRef(({ navigate, isActive, onClose }, ref) => (
    <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg lg:hidden"
    >
        <div className="px-4 py-2 space-y-1">
            <MobileNavItem
                icon={Home}
                label="Home"
                active={isActive('/home')}
                onClick={() => {
                    navigate('/home');
                    onClose();
                }}
            />
            <MobileNavItem
                icon={Users}
                label="Explore Network"
                active={isActive('/home/public-profiles')}
                onClick={() => {
                    navigate('/home/public-profiles');
                    onClose();
                }}
            />
            <MobileNavItem
                icon={Briefcase}
                label="Jobs"
                active={isActive('/jobs')}
                onClick={() => {
                    navigate('/jobs');
                    onClose();
                }}
            />
            <MobileNavItem
                icon={MessageCircle}
                label="Messaging"
                active={isActive('/messages')}
                onClick={() => {
                    navigate('/messages');
                    onClose();
                }}
            />
            <MobileNavItem
                icon={Bell}
                label="Notifications"
                active={isActive('/notifications')}
                onClick={() => {
                    navigate('/notifications');
                    onClose();
                }}
            />
        </div>
    </motion.div>
));

const MobileNavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            active 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-gray-50'
        }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </button>
);

export default Header;      