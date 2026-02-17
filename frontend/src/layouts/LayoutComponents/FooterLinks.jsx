import React from 'react';
import { motion } from 'framer-motion';

const FooterLinks = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-gray-500 text-center space-y-1"
        >
            <div className="space-x-2">
                <motion.a 
                    whileHover={{ scale: 1.05, color: "#2563eb" }}
                    href="#" 
                    className="hover:underline inline-block"
                >
                    About
                </motion.a>
                <span>•</span>
                <motion.a 
                    whileHover={{ scale: 1.05, color: "#2563eb" }}
                    href="#" 
                    className="hover:underline inline-block"
                >
                    Accessibility
                </motion.a>
                <span>•</span>
                <motion.a 
                    whileHover={{ scale: 1.05, color: "#2563eb" }}
                    href="#" 
                    className="hover:underline inline-block"
                >
                    Privacy
                </motion.a>
            </div>
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                Tap Academy Community © 2026
            </motion.p>
        </motion.div>
    );
};

export default FooterLinks; 