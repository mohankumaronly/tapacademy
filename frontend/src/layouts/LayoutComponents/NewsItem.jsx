import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const NewsItem = ({ title, reads, url, source }) => {
    const handleClick = () => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <motion.li 
            whileHover={{ x: 5 }}
            className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group"
            onClick={handleClick}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <motion.p 
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-xs text-gray-500"
                        >
                            {reads}
                        </motion.p>
                        {source && (
                            <>
                                <span className="text-xs text-gray-300">•</span>
                                <span className="text-xs text-gray-500">{source}</span>
                            </>
                        )}
                    </div>
                </div>
                <ExternalLink size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1 flex-shrink-0" />
            </div>
        </motion.li>
    );
};

export default NewsItem;