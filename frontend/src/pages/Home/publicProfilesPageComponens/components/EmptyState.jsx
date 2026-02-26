// components/common/EmptyState.jsx
import React from 'react';
import { UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon: Icon = UserCircle2, 
  title = "No profiles found", 
  message = "Try adjusting your search or filters to find more people",
  action = null 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200"
    >
      <Icon size={64} className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">{title}</h2>
      <p className="text-gray-400">{message}</p>
      {action}
    </motion.div>
  );
};

export default EmptyState;