import React from 'react';
import { motion } from 'framer-motion';

const NewsItem = ({ title, reads }) => (
    <motion.li 
        whileHover={{ x: 5 }}
        className="cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
    >
        <p className="text-sm font-medium">{title}</p>
        <motion.p 
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs text-gray-500"
        >
            {reads}
        </motion.p>
    </motion.li>
);

export default NewsItem;