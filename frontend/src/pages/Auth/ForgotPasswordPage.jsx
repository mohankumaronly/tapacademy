import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Mail, 
    ArrowLeft,
    HelpCircle,
    Shield,
    Clock,
    CheckCircle,
    MessageSquare,
    Users,
    Code2,
    Briefcase,
    Info
} from 'lucide-react';

import Button from '../../common/Button';
import InputText from '../../common/InputText';
import useInputText from '../../Hooks/InputHooks';
import CommonLayout from '../../layouts/CommonLayout';
import useLoading from '../../Hooks/LoadingHook';
import { forgotPassword } from '../../services/auth.service';
import Loading from '../../components/Loading';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();

    const {
        formData,
        onChange,
        reset
    } = useInputText({
        email: "",
    });

    const {
        isLoading,
        LoadingStart,
        LoadingStop,
    } = useLoading();

    const handleSubmit = async (e) => {
        e.preventDefault();
        LoadingStart();
        try {
            await forgotPassword(formData);
            navigate('/auth/forgot-password-link')
            reset();
        } catch (error) {
            if (error.response) {
                const message = error.response.data?.message || "Something went wrong"
                alert(message)
            } else if (error.request) {
                alert('Please check your Network')
            } else {
                alert(error.message);
            }
        } finally {
            LoadingStop();
        }
    };

    // Help tips
    const helpTips = [
        { icon: Clock, text: "Link expires in 1 hour" },
        { icon: Shield, text: "Check your spam folder" },
        { icon: CheckCircle, text: "Use registered email only" },
    ];

    // Recent activities (for demo)
    const recentActivities = [
        { user: "Alex Chen", action: "reset password successfully", time: "5m ago", avatar: "AC" },
        { user: "Sarah Johnson", action: "updated account settings", time: "15m ago", avatar: "SJ" },
        { user: "Mike Peters", action: "enabled 2FA", time: "1h ago", avatar: "MP" },
    ];

    return (
        <>
            {isLoading && <Loading />}
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

                            {/* Help Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#0a66c2] rounded-xl flex items-center justify-center shadow-md">
                                            <HelpCircle className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Forgot Password?</h2>
                                            <p className="text-sm text-slate-600">Don't worry, we'll help you reset it</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <p className="text-sm text-slate-600">
                                        Enter your email address and we'll send you a link to reset your password. 
                                        The link will expire in 1 hour for security reasons.
                                    </p>

                                    {/* Help Tips */}
                                    <div className="space-y-3">
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

                                    {/* Security Note */}
                                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                        <p className="text-xs text-yellow-700 flex items-start gap-2">
                                            <Info size={14} className="flex-shrink-0 mt-0.5" />
                                            <span>
                                                For security reasons, we never store your password in plain text. 
                                                The reset link is one-time use only.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Feed */}
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-slate-100 bg-slate-50">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-[#0a66c2]" />
                                        <h3 className="font-semibold text-sm">Community Updates</h3>
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {recentActivities.map((activity, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="p-3 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {activity.avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs">
                                                        <span className="font-semibold text-slate-800">{activity.user}</span>
                                                        <span className="text-slate-500"> {activity.action}</span>
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{activity.time}</p>
                                                </div>
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

                        {/* Right Side - Forgot Password Form */}
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
                                            <HelpCircle className="w-6 h-6 text-white" />
                                        </motion.div>
                                        
                                        <h2 className="text-2xl font-bold text-slate-800 mb-1">
                                            Reset Password
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            Enter your email to receive reset instructions
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">
                                                We'll send a reset link to this email
                                            </p>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#0a66c2] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            {isLoading ? "Sending..." : "Send Reset Link"}
                                        </button>

                                        {/* Back to Login Link */}
                                        <div className="text-center pt-2">
                                            <button
                                                type="button"
                                                onClick={() => navigate('/auth/login')}
                                                className="inline-flex items-center gap-1 text-sm text-[#0a66c2] hover:text-blue-700 font-medium hover:underline"
                                            >
                                                <ArrowLeft size={14} />
                                                Back to login
                                            </button>
                                        </div>
                                    </form>

                                    {/* Help Contact */}
                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <p className="text-xs text-center text-slate-400">
                                            Need help? Contact our{" "}
                                            <button className="text-[#0a66c2] hover:underline font-medium">
                                                support team
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Help Tips - Shows on mobile only */}
                            <div className="mt-6 lg:hidden">
                                <div className="bg-white rounded-xl border border-slate-200 p-4">
                                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                        <HelpCircle size={14} className="text-[#0a66c2]" />
                                        Quick Tips
                                    </h3>
                                    <div className="space-y-2">
                                        {helpTips.map((tip, index) => (
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
        </>
    );
};

export default ForgotPasswordPage;