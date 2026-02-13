import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';

const Button = ({ 
    text, 
    type = "button", 
    onClick, 
    fullWidth = false,
    variant = "primary", // primary, secondary, google
    disabled = false,
    loading = false,
    icon: Icon
}) => {
    
    const variants = {
        primary: "bg-gradient-to-r from-[#0a66c2] to-blue-500 text-white hover:shadow-xl hover:shadow-blue-200/50 border-0",
        secondary: "bg-white text-slate-700 border-2 border-slate-200 hover:border-[#0a66c2]/30 hover:shadow-lg",
        google: "bg-white text-slate-700 border-2 border-slate-200 hover:border-[#0a66c2]/30 hover:shadow-lg"
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                relative overflow-hidden group
                px-6 py-3.5 rounded-xl font-bold text-sm
                transition-all duration-300
                ${fullWidth ? 'w-full' : 'w-fit px-8'}
                ${variants[variant]}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                flex items-center justify-center gap-2
            `}
        >
            {/* Animated Background for Primary Button */}
            {variant === 'primary' && !disabled && (
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#0a66c2]"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <>
                        <Loader size={16} className="animate-spin" />
                        {text}
                    </>
                ) : (
                    <>
                        {Icon && <Icon size={16} />}
                        {text}
                        {variant === 'primary' && !loading && (
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        )}
                    </>
                )}
            </span>
        </motion.button>
    );
};

export default Button;