import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Mail, 
    Lock, 
    ArrowRight, 
    Eye,
    EyeOff,
    Zap,
    Users,
    Award,
    Shield,
    ChevronRight,
    Sparkles
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
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
            fill="currentColor"
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

    const features = [
        { icon: Users, text: "Connect with 2,500+ peers" },
        { icon: Award, text: "Showcase your projects" },
        { icon: Shield, text: "Get noticed by recruiters" }
    ];

    return (
        <>
            {isLoading && <Loading />}
            <CommonLayout>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="min-h-screen lg:min-h-[calc(100vh-2rem)] flex items-center justify-center py-6 lg:py-8 px-2 sm:px-4 lg:px-8"
                >
                    <div className="w-full max-w-md lg:max-w-7xl lg:w-full grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 items-start lg:items-stretch">
                        
                        {/* Left Side - Information Panel - Hidden on mobile */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="hidden lg:block h-full"
                        >
                            <div className="bg-gradient-to-br from-[#0a66c2] to-blue-600 rounded-3xl p-8 xl:p-10 text-white shadow-2xl relative overflow-hidden h-full flex flex-col">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full blur-3xl" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col h-full">
                                    <motion.div
                                        animate={{ rotate: [0, 10, 0] }}
                                        transition={{ duration: 6, repeat: Infinity }}
                                        className="w-14 h-14 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6"
                                    >
                                        <Zap className="w-7 h-7 text-white fill-white" />
                                    </motion.div>

                                    <h2 className="text-2xl xl:text-3xl font-black mb-3 leading-tight">
                                        Welcome to Tap Academy Social Media Platform
                                    </h2>
                                    
                                    <p className="text-base text-blue-100 mb-6">
                                        Your gateway to transforming learning into career opportunities
                                    </p>

                                    {/* Features List */}
                                    <div className="space-y-4 mb-6">
                                        {features.map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + index * 0.1 }}
                                                className="flex items-center gap-3"
                                            >
                                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <feature.icon className="w-4 h-4 text-white" />
                                                </div>
                                                <p className="text-sm font-medium text-blue-50">
                                                    {feature.text}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20 mt-auto">
                                        <div>
                                            <p className="text-xl font-black">2.5k+</p>
                                            <p className="text-[10px] text-blue-200">Active Learners</p>
                                        </div>
                                        <div>
                                            <p className="text-xl font-black">500+</p>
                                            <p className="text-[10px] text-blue-200">Partner Companies</p>
                                        </div>
                                        <div>
                                            <p className="text-xl font-black">4.9</p>
                                            <p className="text-[10px] text-blue-200">User Rating</p>
                                        </div>
                                    </div>

                                    {/* Testimonial */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg"
                                    >
                                        <p className="text-xs italic text-blue-50">
                                            "Tap Academy helped me land my dream job at Google. The community is amazing!"
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-5 h-5 rounded-full bg-white/20" />
                                            <p className="text-[10px] font-medium">- Priya S., Full Stack Developer</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Login Form - Full width on mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto"
                        >
                            <div className="bg-white rounded-xl lg:rounded-3xl border border-slate-200 shadow-lg lg:shadow-2xl overflow-hidden">
                                <div className="h-1 lg:h-2 bg-gradient-to-r from-[#0a66c2] to-blue-500" />
                                
                                <div className="p-4 sm:p-5 lg:p-8">
                                    {/* Header */}
                                    <div className="text-center mb-4 lg:mb-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.4, type: "spring" }}
                                            className="inline-flex items-center justify-center w-9 h-9 lg:w-12 lg:h-12 bg-gradient-to-br from-[#0a66c2] to-blue-500 rounded-lg lg:rounded-xl mb-2 lg:mb-3 shadow-md lg:shadow-lg shadow-blue-200"
                                        >
                                            <Zap className="w-4 h-4 lg:w-6 lg:h-6 text-white fill-white" />
                                        </motion.div>
                                        
                                        <h2 className="text-lg lg:text-2xl font-black text-slate-900 mb-0.5 lg:mb-1 flex items-center justify-center gap-1 lg:gap-2">
                                            Welcome Back
                                            <Sparkles size={14} className="text-yellow-500 lg:w-5 lg:h-5" />
                                        </h2>
                                        <p className="text-[11px] lg:text-xs text-slate-500">
                                            Sign in to continue your learning journey
                                        </p>
                                    </div>

                                    {/* Login Form */}
                                    <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                                        <InputText
                                            type="email"
                                            placeholder="Enter your email"
                                            name="email"
                                            label="Email Address"
                                            value={formData.email}
                                            onChange={onChange}
                                            icon={Mail}
                                            error={errors.email}
                                        />

                                        <div className="relative">
                                            <InputText
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                name="password"
                                                label="Password"
                                                value={formData.password}
                                                onChange={onChange}
                                                icon={Lock}
                                                error={errors.password}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-[36px] lg:top-[38px] text-slate-400 hover:text-[#0a66c2] transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>

                                        {/* Forgot Password */}
                                        <div className="flex items-center justify-between">
                                            <label className="flex items-center gap-1.5 lg:gap-2">
                                                <input type="checkbox" className="rounded border-slate-300 text-[#0a66c2] focus:ring-[#0a66c2] w-3 h-3" />
                                                <span className="text-[11px] lg:text-xs text-slate-600">Remember me</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/auth/forgot-password')}
                                                className="text-[11px] lg:text-xs font-bold text-[#0a66c2] hover:text-blue-700 hover:underline transition-all flex items-center gap-1"
                                            >
                                                Forgot password?
                                                <ChevronRight size={9} />
                                            </button>
                                        </div>

                                        {/* Login Button */}
                                        <Button
                                            type="submit"
                                            text="Login to Dashboard"
                                            fullWidth
                                            disabled={isLoading}
                                            loading={isLoading}
                                            variant="primary"
                                        />

                                        {/* Divider */}
                                        <div className="relative my-2.5 lg:my-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-[10px] lg:text-xs">
                                                <span className="px-2 lg:px-3 bg-white text-slate-400 font-medium">
                                                    OR CONTINUE WITH
                                                </span>
                                            </div>
                                        </div>

                                        {/* Google Login Button */}
                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            className="w-full group relative bg-white border border-slate-200 lg:border-2 hover:border-[#0a66c2]/30 hover:shadow-md lg:hover:shadow-lg text-slate-700 py-2 lg:py-3 rounded-lg lg:rounded-xl font-bold text-[11px] lg:text-xs transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <GoogleIcon />
                                            <span>Continue with Google</span>
                                            <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                        </button>

                                        {/* Sign Up Link */}
                                        <p className="text-center text-[11px] lg:text-xs text-slate-500 mt-3 lg:mt-4">
                                            Don't have an account?{" "}
                                            <button
                                                type="button"
                                                onClick={() => navigate('/auth/register')}
                                                className="font-bold text-[#0a66c2] hover:text-blue-700 hover:underline transition-all inline-flex items-center gap-1"
                                            >
                                                Sign up for free
                                                <ArrowRight size={9} />
                                            </button>
                                        </p>
                                    </form>
                                </div>
                            </div>

                            {/* Mobile Trust Badge - Shows on mobile only */}
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center justify-center gap-2 mt-3 lg:hidden"
                            >
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/50?u=${i}`} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[11px] text-slate-500">
                                    <span className="font-bold text-slate-700">2,500+</span> active learners
                                </p>
                            </motion.div>

                            {/* Mobile Feature Highlights - Simple icons row for mobile */}
                            <div className="flex justify-center gap-4 mt-3 lg:hidden">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex flex-col items-center gap-1">
                                        <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <feature.icon size={14} className="text-[#0a66c2]" />
                                        </div>
                                        <span className="text-[7px] text-slate-500 text-center max-w-[55px]">
                                            {feature.text.split(' ')[0]} {feature.text.split(' ')[1]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </CommonLayout>
        </>
    );
};

export default Login;