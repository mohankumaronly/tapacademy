import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-center items-center bg-gray-50"
        >
            <div className="flex flex-col items-center">
                {/* Progress Bar */}
                <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                        animate={{ 
                            x: ["-100%", "100%"]
                        }}
                        transition={{ 
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600"
                    />
                </div>
                
                <motion.p 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="mt-4 text-sm font-light text-gray-400 tracking-wider"
                >
                    LOADING
                </motion.p>
            </div>
        </motion.div>
    );
};

export default Loading;