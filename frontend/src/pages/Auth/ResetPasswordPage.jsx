import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
    Lock,
    Eye,
    EyeOff,
    Shield,
    CheckCircle,
    XCircle,
    Key,
    ArrowLeft,
    Briefcase,
    Users,
    Code2,
    Trophy,
    Info,
    Sparkles
} from 'lucide-react';

import Button from "../../common/Button";
import InputText from "../../common/InputText";
import useInputText from "../../Hooks/InputHooks";
import useLoading from "../../Hooks/LoadingHook";
import CommonLayout from "../../layouts/CommonLayout";
import { resetPassword } from "../../services/auth.service";
import Loading from "../../components/Loading";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const {
        formData,
        onChange,
        reset
    } = useInputText({
        password: "",
    });

    const {
        isLoading,
        LoadingStart,
        LoadingStop,
    } = useLoading();

    // Password strength checker
    const checkPasswordStrength = (password) => {
        const checks = {
            length: password.length >= 8,
            number: /\d/.test(password),
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const strength = Object.values(checks).filter(Boolean).length;
        
        if (strength <= 2) return { text: "Weak", color: "text-red-500", bg: "bg-red-50" };
        if (strength <= 4) return { text: "Medium", color: "text-yellow-500", bg: "bg-yellow-50" };
        return { text: "Strong", color: "text-green-500", bg: "bg-green-50" };
    };

    const validateForm = () => {
        if (formData.password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return false;
        }
        if (formData.password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        LoadingStart();
        try {
            await resetPassword(token, formData);
            navigate('/auth/login');
            reset();
            setConfirmPassword("");
        } catch (error) {
            if (error.response) {
                const message = error.response.data?.message || "Something went wrong";
                alert(message);
            } else if (error.request) {
                alert("Please check your Network");
            } else {
                alert(error.message);
            }
        } finally {
            LoadingStop();
        }
    };

    // Password strength
    const strength = checkPasswordStrength(formData.password);

    // Security tips
    const securityTips = [
        { icon: CheckCircle, text: "Minimum 6 characters", valid: formData.password.length >= 6 },
        { icon: CheckCircle, text: "Contains number", valid: /\d/.test(formData.password) },
        { icon: CheckCircle, text: "Contains uppercase letter", valid: /[A-Z]/.test(formData.password) },
        { icon: CheckCircle, text: "Contains lowercase letter", valid: /[a-z]/.test(formData.password) },
        { icon: CheckCircle, text: "Contains special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
    ];

    // Success stories (for demo)
    const successStories = [
        { user: "Emily Chen", role: "Frontend Dev", achievement: "reset password and secured account", time: "2h ago", avatar: "EC" },
        { user: "David Kim", role: "Backend Dev", achievement: "enabled 2FA", time: "5h ago", avatar: "DK" },
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
                        
                        {/* Left Side - Security Information */}
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

                            {/* Security Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#0a66c2] rounded-xl flex items-center justify-center shadow-md">
                                            <Shield className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">Create New Password</h2>
                                            <p className="text-sm text-slate-600">Choose a strong password for your account</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    <p className="text-sm text-slate-600">
                                        Your password should be strong and unique to protect your developer portfolio and community connections.
                                    </p>

                                    {/* Password Requirements */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-sm text-slate-700">Password requirements:</h3>
                                        {securityTips.map((tip, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                                className="flex items-center gap-2"
                                            >
                                                {tip.valid ? (
                                                    <CheckCircle size={14} className="text-green-500" />
                                                ) : (
                                                    <XCircle size={14} className="text-slate-300" />
                                                )}
                                                <span className={`text-xs ${tip.valid ? 'text-green-600' : 'text-slate-500'}`}>
                                                    {tip.text}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Security Note */}
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-xs text-blue-700 flex items-start gap-2">
                                            <Info size={14} className="flex-shrink-0 mt-0.5" />
                                            <span>
                                                Never share your password with anyone. DevConnect will never ask for your password.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Success Stories */}
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-slate-100 bg-slate-50">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-[#0a66c2]" />
                                        <h3 className="font-semibold text-sm">Community Security</h3>
                                    </div>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {successStories.map((story, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            className="p-3 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {story.avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1 flex-wrap">
                                                        <span className="font-semibold text-sm">{story.user}</span>
                                                        <span className="text-xs text-slate-400">•</span>
                                                        <span className="text-xs text-slate-500">{story.role}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 mt-0.5">{story.achievement}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{story.time}</p>
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

                        {/* Right Side - Reset Password Form */}
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
                                            <Key className="w-6 h-6 text-white" />
                                        </motion.div>
                                        
                                        <h2 className="text-2xl font-bold text-slate-800 mb-1 flex items-center justify-center gap-2">
                                            Reset Password
                                            <Sparkles size={16} className="text-yellow-500" />
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            Create a new strong password for your account
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Password Field */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={onChange}
                                                    placeholder="Enter new password"
                                                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] outline-none transition-all"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0a66c2]"
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            
                                            {/* Password Strength Indicator */}
                                            {formData.password && (
                                                <div className="mt-2">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className={`text-xs font-medium ${strength.color}`}>
                                                            {strength.text} password
                                                        </span>
                                                    </div>
                                                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ 
                                                                width: formData.password ? 
                                                                    `${(Object.values(securityTips).filter(t => t.valid).length / 5) * 100}%` 
                                                                    : '0%' 
                                                            }}
                                                            className={`h-full ${
                                                                strength.text === 'Weak' ? 'bg-red-500' :
                                                                strength.text === 'Medium' ? 'bg-yellow-500' :
                                                                'bg-green-500'
                                                            }`}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Confirm Password Field */}
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Confirm new password"
                                                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0a66c2]/20 focus:border-[#0a66c2] outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                            {passwordError && (
                                                <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                                            )}
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-[#0a66c2] hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            {isLoading ? "Resetting..." : "Reset Password"}
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
                                </div>
                            </div>

                            {/* Mobile Security Tips - Shows on mobile only */}
                            <div className="mt-6 lg:hidden">
                                <div className="bg-white rounded-xl border border-slate-200 p-4">
                                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                        <Shield size={14} className="text-[#0a66c2]" />
                                        Password Tips
                                    </h3>
                                    <div className="space-y-2">
                                        {securityTips.slice(0, 3).map((tip, index) => (
                                            <div key={index} className="flex items-center gap-2 text-xs">
                                                {tip.valid ? (
                                                    <CheckCircle size={12} className="text-green-500" />
                                                ) : (
                                                    <XCircle size={12} className="text-slate-300" />
                                                )}
                                                <span className={tip.valid ? 'text-green-600' : 'text-slate-500'}>
                                                    {tip.text}
                                                </span>
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

export default ResetPasswordPage;