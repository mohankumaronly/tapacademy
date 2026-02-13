import React from 'react';
import { motion } from 'framer-motion';

const CommonLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#f4f2ee] font-sans text-slate-900 overflow-hidden relative flex items-center justify-center">
            <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[120px]" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full px-8 sm:px-12 lg:px-16 xl:px-24"
            >
                {children}
            </motion.div>
        </div>
    );
};

export default CommonLayout;