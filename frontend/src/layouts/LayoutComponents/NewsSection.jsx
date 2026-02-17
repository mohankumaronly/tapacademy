import React from 'react';
import { motion } from 'framer-motion';
import NewsItem from './NewsItem';

const newsData = [
    { 
        title: "Get Full Project", 
        reads: "12 readers",
        url: "https://github.com/mohankumaronly/tapacademy",
        source: "Github News"
    },
    { 
        title: "Tap Placements", 
        reads: "1.2k readers",
        url: "https://thetapacademy.com/placements",
        source: "Tap Academy News"
    },
    { 
        title: "Project Over View Video", 
        reads: "500 readers",
        url: "https://youtu.be/gPtxm0FoROc?si=xNLwBFOXnLbCQSdc",
        source: "Youtube News"
    },
    { 
        title: "New coding bootcamps", 
        reads: "3.1k readers",
        url: "https://thetapacademy.com/java-fullstack-details",
        source: "Tap Academy News"
    }
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
                className="font-semibold text-md mb-3 flex items-center gap-2"
            >
                <span>Tap Academy Community News</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Live</span>
            </motion.h3>
            <ul className="space-y-2">
                {newsData.map((news, index) => (
                    <NewsItem 
                        key={index} 
                        title={news.title} 
                        reads={news.reads}
                        url={news.url}
                        source={news.source}
                    />
                ))}
            </ul>
            <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                <a 
                    href="https://news.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                >
                    View more news →
                </a>
            </div>
        </motion.div>
    );
};

export default NewsSection;