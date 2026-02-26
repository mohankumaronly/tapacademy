import React from 'react';
import { motion } from 'framer-motion';

const PageHeader = ({ icon: Icon, title, subtitle }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="inline-block p-3 bg-blue-50 rounded-full mb-4"
      >
        <Icon className="text-blue-600" size={32} />
      </motion.div>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        {title}
      </h1>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  );
};

export default PageHeader;