import React from 'react';
import { motion } from 'framer-motion';

const BackgroundElements = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/30 blur-[120px]"
      />
    </div>
  );
};

export default BackgroundElements;