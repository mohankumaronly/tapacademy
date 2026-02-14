import React from 'react';
import { motion } from 'framer-motion';

const SidebarLink = ({ text, value }) => (
    <motion.div 
        whileHover={{ x: 5 }}
        className="flex justify-between text-sm mb-2 cursor-pointer group"
    >
        <span className="text-gray-600 group-hover:text-blue-600 transition-colors">
            {text}
        </span>
        <motion.span 
            whileHover={{ scale: 1.1 }}
            className="text-blue-600 font-semibold"
        >
            {value}
        </motion.span>
    </motion.div>
);

export default SidebarLink;