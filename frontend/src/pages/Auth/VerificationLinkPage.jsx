import { motion } from "framer-motion";
import { 
    Mail,
    Send,
    ArrowRight,
    Clock,
    Shield,
    CheckCircle,
    Briefcase,
    Users,
    Code2,
    AlertCircle,
    Sparkles,
    Inbox,
    ExternalLink
} from "lucide-react";

import Button from "../../common/Button";
import CommonLayout from "../../layouts/CommonLayout";

const VerificationLinkPage = () => {
    const openEmailClient = () => {
        window.open('https://mail.google.com', '_blank');
    };

    // Help tips
    const helpTips = [
        { icon: Clock, text: "Link expires in 1 hour" },
        { icon: Shield, text: "Check your spam folder" },
        { icon: Inbox, text: "May take 2-3 minutes to arrive" },
        { icon: AlertCircle, text: "Add noreply@devconnect.com to contacts" },
    ];

    // Email providers
    const emailProviders = [
        { name: "Gmail", icon: "📧", url: "https://mail.google.com", color: "bg-red-50 text-red-600" },
        { name: "Outlook", icon: "📨", url: "https://outlook.live.com", color: "bg-blue-50 text-blue-600" },
        { name: "Yahoo", icon: "📫", url: "https://mail.yahoo.com", color: "bg-purple-50 text-purple-600" },
    ];

    // Success stories (for demo)
    const recentVerifications = [
        { user: "Alex Chen", time: "just reset password", avatar: "AC", ago: "2m ago" },
        { user: "Sarah Johnson", time: "verified email", avatar: "SJ", ago: "5m ago" },
        { user: "Mike Peters", time: "reset password", avatar: "MP", ago: "10m ago" },
    ];

    return (
        <CommonLayout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen py-8 px-4"
            >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Left Side - Help & Information */}
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

                        {/* Info Card */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#0a66c2] rounded-xl flex items-center justify-center shadow-md">
                                        <Send className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800">Check Your Email</h2>
                                        <p className="text-sm text-slate-600">We've sent a reset link to your inbox</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-slate-600">
                                    A password reset link has been sent to your email address. 
                                    Click the link to create a new password for your account.
                                </p>

                                {/* Help Tips */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-sm text-slate-700">Quick tips:</h3>
                                    {helpTips.map((tip, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex items-center gap-3 text-sm"
                                        >
                                            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <tip.icon className="w-3 h-3 text-[#0a66c2]" />
                                            </div>
                                            <span className="text-slate-600">{tip.text}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Note */}
                                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                    <p className="text-xs text-yellow-700 flex items-start gap-2">
                                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                                        <span>
                                            Didn't receive the email? Check your spam folder or try 
                                            adding noreply@devconnect.com to your contacts.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[#0a66c2]" />
                                    <h3 className="font-semibold text-sm">Recent Password Resets</h3>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {recentVerifications.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="p-3 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {item.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1 flex-wrap">
                                                    <span className="font-semibold text-sm">{item.user}</span>
                                                    <span className="text-xs text-slate-400">•</span>
                                                    <span className="text-xs text-slate-500">{item.time}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1">{item.ago}</p>
                                            </div>
                                            <CheckCircle size={14} className="text-green-500" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>5,200+ developers</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                <span>500+ projects</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Verification Link Message */}
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
                                        <Send className="w-6 h-6 text-white" />
                                    </motion.div>
                                    
                                    <h2 className="text-2xl font-bold text-slate-800 mb-1 flex items-center justify-center gap-2">
                                        Reset Link Sent
                                        <Sparkles size={16} className="text-yellow-500" />
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Check your inbox for the reset password link
                                    </p>
                                </div>

                                {/* Email Icon Animation */}
                                <motion.div
                                    initial={{ y: 0 }}
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="flex justify-center mb-6"
                                >
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
                                            <Mail size={40} className="text-[#0a66c2]" />
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: [0, 1, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                                        />
                                    </div>
                                </motion.div>

                                {/* Message */}
                                <div className="text-center mb-6">
                                    <p className="text-sm text-slate-600 mb-2">
                                        We've sent a password reset link to your email address.
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        The link will expire in 1 hour for security reasons.
                                    </p>
                                </div>

                                {/* Email Provider Buttons */}
                                <div className="space-y-3 mb-6">
                                    <Button
                                        text="Open Gmail"
                                        type="button"
                                        onClick={() => window.open('https://mail.google.com', '_blank')}
                                        fullWidth
                                        icon={ExternalLink}
                                    />
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => window.open('https://outlook.live.com', '_blank')}
                                            className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                                        >
                                            <span>📨</span>
                                            <span className="text-slate-600">Outlook</span>
                                        </button>
                                        <button
                                            onClick={() => window.open('https://mail.yahoo.com', '_blank')}
                                            className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                                        >
                                            <span>📫</span>
                                            <span className="text-slate-600">Yahoo</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Didn't receive email? */}
                                <div className="text-center space-y-2">
                                    <p className="text-xs text-slate-400">
                                        Didn't receive the email? Check your spam folder
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="text-xs text-[#0a66c2] hover:text-blue-700 font-medium hover:underline"
                                    >
                                        Resend verification link
                                    </button>
                                </div>

                                {/* Back to Login Link */}
                                <div className="text-center pt-4 mt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/auth/login')}
                                        className="inline-flex items-center gap-1 text-sm text-[#0a66c2] hover:text-blue-700 font-medium hover:underline"
                                    >
                                        Back to login
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Help Tips - Shows on mobile only */}
                        <div className="mt-6 lg:hidden">
                            <div className="bg-white rounded-xl border border-slate-200 p-4">
                                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                    <Mail size={14} className="text-[#0a66c2]" />
                                    Quick Tips
                                </h3>
                                <div className="space-y-2">
                                    {helpTips.slice(0, 3).map((tip, index) => (
                                        <div key={index} className="flex items-center gap-2 text-xs text-slate-600">
                                            <tip.icon size={12} className="text-[#0a66c2]" />
                                            <span>{tip.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </CommonLayout>
    );
};

export default VerificationLinkPage;