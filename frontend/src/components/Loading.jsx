import React from 'react';
import { motion } from 'framer-motion';
import { MoonLoader } from 'react-spinners';
import { Zap } from 'lucide-react';

const Loading = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-center items-center bg-white/80 backdrop-blur-sm"
        >
            <div className="flex flex-col items-center space-y-6 p-8 rounded-2xl">
                {/* Animated Logo */}
                <motion.div
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="bg-gradient-to-r from-[#0a66c2] to-blue-500 p-4 rounded-2xl shadow-xl shadow-blue-200"
                >
                    <Zap className="text-white w-8 h-8 fill-white" />
                </motion.div>
                
                {/* Loading Spinner */}
                <MoonLoader size={40} color="#0a66c2" />
                
                {/* Loading Text */}
                <motion.p 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm font-medium text-slate-600"
                >
                    Loading, please wait...
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Loading;