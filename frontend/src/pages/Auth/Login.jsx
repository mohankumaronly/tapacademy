import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Mail, 
    Lock, 
    ArrowRight, 
    Eye,
    EyeOff,
    Users,
    Briefcase,
    Code2,
    Trophy,
    Github,
    MessageSquare,
    TrendingUp,
    Zap,
    Globe,
    Sparkles,
    Info
} from 'lucide-react';

import useInputText from '../../Hooks/InputHooks';
import CommonLayout from '../../layouts/CommonLayout';
import InputText from '../../common/InputText';
import Button from '../../common/Button';
import useLoading from '../../Hooks/LoadingHook';
import { getMe, login } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import Loading from '../../components/Loading';

// Google Icon Component
const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [popupMessage, setPopupMessage] = useState({ show: false, message: '', type: 'info' });

    useEffect(() => {
        const error = searchParams.get("error");
        if (!error) return;

        const errorMap = {
            email_exists: "This email is registered with email & password. Please login normally.",
            oauth_failed: "Google login failed. Please try again.",
            oauth_invalid_state: "Security validation failed. Please try again.",
            google_email_not_verified: "Your Google email is not verified.",
        };

        alert(errorMap[error] || "Something went wrong.");
        navigate("/auth/login", { replace: true });
    }, [searchParams, navigate]);

    const { formData, onChange, reset } = useInputText({
        email: "",
        password: "",
    });

    const { isLoading, LoadingStart, LoadingStop } = useLoading();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        LoadingStart();
        try {
            await login(formData);
            const me = await getMe();
            setUser(me.data.user);
            reset();
            navigate('/home');
        } catch (error) {
            if (error.response) {
                if (error.response.data.message?.includes('email')) {
                    setErrors({ email: error.response.data.message });
                } else if (error.response.data.message?.includes('password')) {
                    setErrors({ password: error.response.data.message });
                } else {
                    alert(error.response.data?.message || "Invalid credentials");
                }
            } else if (error.request) {
                alert("Network error. Please check your connection.");
            } else {
                alert(error.message);
            }
        } finally {
            LoadingStop();
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    const showDevelopmentPopup = (provider) => {
        setPopupMessage({
            show: true,
            message: `${provider} login is currently under development. Please use Google or email login for now.`,
            type: 'info'
        });
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            setPopupMessage({ show: false, message: '', type: 'info' });
        }, 5000);
    };

    // Recent activity feed items (for demo)
    const recentActivities = [
        { user: "Alex Chen", role: "Frontend Dev", action: "shared a new React project", time: "2m ago", avatar: "AC" },
        { user: "Sarah Johnson", role: "ML Engineer", action: "posted about AI advancements", time: "15m ago", avatar: "SJ" },
        { user: "Mike Peters", role: "DevOps", action: "achieved AWS certification", time: "1h ago", avatar: "MP" },
        { user: "Priya Patel", role: "Full Stack", action: "launched portfolio v2", time: "3h ago", avatar: "PP" },
    ];

    return (
        <>
            {isLoading && <Loading />}
            <CommonLayout>
                {/* Popup Message */}
                {popupMessage.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
                    >
                        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-blue-700">{popupMessage.message}</p>
                                <p className="text-xs text-blue-500 mt-1">
                                    We're working on adding more sign-in options soon!
                                </p>
                            </div>
                            <button
                                onClick={() => setPopupMessage({ show: false, message: '', type: 'info' })}
                                className="text-blue-400 hover:text-blue-600"
                            >
                                ×
                            </button>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-h-screen py-8 px-4"
                >
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        
                        {/* Left Side - Social Feed Preview */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="hidden lg:block space-y-6"
                        >
                            {/* Platform Header */}
                            <div className="flex items-center gap-2 mb-8">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#0a66c2] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Briefcase className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">DevConnect</h1>
                                    <p className="text-sm text-slate-500">Where developers grow together</p>
                                </div>
                            </div>

                            {/* Welcome Message */}
                            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    Welcome Back! 👋
                                    <Sparkles size={16} className="text-yellow-500" />
                                </h2>
                                <p className="text-sm text-slate-600">
                                    Sign in to continue your journey with the developer community.
                                </p>
                            </div>

                            {/* Feature Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <motion.div 
                                    whileHover={{ y: -2 }}
                                    className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
                                >
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
                                        <Code2 className="w-4 h-4 text-[#0a66c2]" />
                                    </div>
                                    <h3 className="font-semibold text-sm">Share Progress</h3>
                                    <p className="text-xs text-slate-500 mt-1">Post your projects and get feedback</p>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ y: -2 }}
                                    className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
                                >
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
                                        <Users className="w-4 h-4 text-[#0a66c2]" />
                                    </div>
                                    <h3 className="font-semibold text-sm">Connect</h3>
                                    <p className="text-xs text-slate-500 mt-1">Network with 5k+ developers</p>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ y: -2 }}
                                    className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
                                >
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
                                        <Trophy className="w-4 h-4 text-[#0a66c2]" />
                                    </div>
                                    <h3 className="font-semibold text-sm">Get Noticed</h3>
                                    <p className="text-xs text-slate-500 mt-1">Showcase achievements & skills</p>
                                </motion.div>

                                <motion.div 
                                    whileHover={{ y: -2 }}
                                    className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
                                >
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mb-2">
                                        <MessageSquare className="w-4 h-4 text-[#0a66c2]" />
                                    </div>
                                    <h3 className="font-semibold text-sm">Discuss</h3>
                                    <p className="text-xs text-slate-500 mt-1">Join tech conversations</p>
                                </motion.div>
                            </div>

                            {/* Live Activity Feed */}
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-slate-100 bg-slate-50">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-[#0a66c2]" />
                                        <h3 className="font-semibold text-sm">Live Developer Activity</h3>
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {recentActivities.map((activity, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="p-3 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {activity.avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1 flex-wrap">
                                                        <span className="font-semibold text-sm">{activity.user}</span>
                                                        <span className="text-xs text-slate-400">•</span>
                                                        <span className="text-xs text-slate-500">{activity.role}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 mt-0.5">{activity.action}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{activity.time}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Social Proof */}
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    <span>Join 5,200+ developers</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    <span>500+ projects shared</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Login Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
                        >
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                                {/* Progress Bar */}
                                <div className="h-1.5 bg-gradient-to-r from-[#0a66c2] to-blue-400" />
                                
                                <div className="p-6 sm:p-8">
                                    {/* Header */}
                                    <div className="text-center mb-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4, type: "spring" }}
                                            className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#0a66c2] to-blue-500 rounded-2xl mb-3 shadow-lg shadow-blue-200"
                                        >
                                            <Zap className="w-6 h-6 text-white fill-white" />
                                        </motion.div>
                                        
                                        <h2 className="text-2xl font-bold text-slate-800 mb-1">
                                            Welcome Back
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            Sign in to continue your developer journey
                                        </p>
                                    </div>

                                    {/* Login Form */}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Email Field */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                Email address
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={onChange}
                                                    placeholder="you@example.com"
                                                    className={`w-full pl-9 pr-3 py-2.5 text-sm border ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] outline-none transition-all`}
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                            )}
                                        </div>

                                        {/* Password Field */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={onChange}
                                                    placeholder="Enter your password"
                                                    className={`w-full pl-9 pr-10 py-2.5 text-sm border ${errors.password ? 'border-red-300' : 'border-slate-200'} rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] outline-none transition-all`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0a66c2]"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                                            )}
                                        </div>

                                        {/* Forgot Password & Remember Me */}
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-2">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 rounded border-slate-300 text-[#0a66c2] focus:ring-[#0a66c2] focus:ring-offset-0" 
                                                />
                                                <span className="text-xs text-slate-600">Remember me</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/auth/forgot-password')}
                                                className="text-xs font-medium text-[#0a66c2] hover:text-blue-700 hover:underline"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>

                                        {/* Login Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#0a66c2] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                        >
                                            {isLoading ? (
                                                "Signing in..."
                                            ) : (
                                                <>
                                                    Sign In
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>

                                        {/* Divider */}
                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-xs">
                                                <span className="px-3 bg-white text-slate-400">
                                                    or continue with
                                                </span>
                                            </div>
                                        </div>

                                        {/* Social Buttons */}
                                        <div className="grid grid-cols-3 gap-3">
                                            <button
                                                type="button"
                                                onClick={handleGoogleLogin}
                                                className="flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                                            >
                                                <GoogleIcon />
                                                <span className="text-slate-600">Google</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => showDevelopmentPopup('GitHub')}
                                                className="flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm relative group"
                                            >
                                                <Github size={18} className="text-slate-700" />
                                                <span className="text-slate-600">GitHub</span>
                                                {/* Development badge */}
                                                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[8px] px-1.5 py-0.5 rounded-full font-bold text-yellow-900">
                                                    DEV
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => showDevelopmentPopup('X (Twitter)')}
                                                className="flex items-center justify-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm relative group"
                                            >
                                                <svg className="w-4 h-4 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                                </svg>
                                                <span className="text-slate-600">X</span>
                                                {/* Development badge */}
                                                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[8px] px-1.5 py-0.5 rounded-full font-bold text-yellow-900">
                                                    DEV
                                                </span>
                                            </button>
                                        </div>

                                        {/* Development Notice */}
                                        <div className="mt-2 text-center">
                                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-1 rounded-full inline-flex items-center gap-1">
                                                <Info size={10} />
                                                GitHub & X sign-in coming soon
                                            </span>
                                        </div>

                                        {/* Sign Up Link */}
                                        <p className="text-center text-sm text-slate-600 mt-6">
                                            Don't have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={() => navigate('/auth/register')}
                                                className="font-semibold text-[#0a66c2] hover:text-blue-700 hover:underline"
                                            >
                                                Sign up for free
                                            </button>
                                        </p>
                                    </form>
                                </div>
                            </div>

                            {/* Mobile Preview - Shows on mobile only */}
                            <div className="mt-6 lg:hidden">
                                <div className="bg-white rounded-xl border border-slate-200 p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-4 h-4 text-[#0a66c2]" />
                                        <h3 className="font-semibold text-sm">Recent Activity</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {recentActivities.slice(0, 2).map((activity, index) => (
                                            <div key={index} className="flex items-start gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                                    {activity.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs">
                                                        <span className="font-semibold">{activity.user}</span>
                                                        <span className="text-slate-500"> {activity.action}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </CommonLayout>
        </>
    );
};

export default Login;