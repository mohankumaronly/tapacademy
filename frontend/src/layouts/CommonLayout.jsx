import React from 'react';
import { motion } from 'framer-motion';

const CommonLayout = ({ children, maxWidth = '7xl' }) => {
    return (
        <div className="min-h-screen bg-[#f4f2ee] font-sans text-slate-900 overflow-hidden relative">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-100/40 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-blue-50/50 blur-[120px]" />
                <div className="absolute top-[30%] right-[15%] w-[25%] h-[25%] rounded-full bg-blue-200/20 blur-[100px]" />
            </div>

            <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, #0a66c2 1px, transparent 1px), linear-gradient(to bottom, #0a66c2 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
            >
                <div className={`w-full max-w-${maxWidth} mx-auto`}>
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default CommonLayout;