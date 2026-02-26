import React from 'react';
import { motion } from 'framer-motion';

const LoadMoreButton = ({ onClick, loading, hasNextPage }) => {
  if (!hasNextPage) return null;

  return (
    <div className="flex justify-center pt-8">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        disabled={loading}
        className="px-8 py-3 bg-white border border-gray-200 rounded-full text-gray-600 font-medium hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Loading..." : "Load More Profiles"}
      </motion.button>
    </div>
  );
};

export default LoadMoreButton;