import React from 'react';
import { motion } from 'framer-motion';
import NewsItem from './NewsItem';

const newsData = [
    { title: "Tech layoffs continue", reads: "12k readers" },
    { title: "AI in 2024", reads: "8.5k readers" },
    { title: "Remote work trends", reads: "5.2k readers" },
    { title: "New coding bootcamps", reads: "3.1k readers" }
];

const NewsSection = () => {
    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20"
        >
            <motion.h3 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="font-semibold text-md mb-3"
            >
                Tap Academy Community News
            </motion.h3>
            <ul className="space-y-2">
                {newsData.map((news, index) => (
                    <NewsItem key={index} title={news.title} reads={news.reads} />
                ))}
            </ul>
        </motion.div>
    );
};

export default NewsSection;