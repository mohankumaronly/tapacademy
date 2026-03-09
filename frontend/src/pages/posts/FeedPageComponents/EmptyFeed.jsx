import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Users } from 'lucide-react';

const EmptyFeed = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border-2 border-gray-100 p-8 text-center group cursor-default hover:shadow-lg transition-all duration-300"
    >
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="relative w-20 h-20 mx-auto mb-4"
      >
        <div className="absolute inset-0 bg-[#0a66c2] rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        
        <div className="relative bg-gradient-to-br from-gray-50 to-white p-4 rounded-full border-2 border-[#0a66c2] shadow-xl">
          <Newspaper className="w-12 h-12 text-[#0a66c2]" strokeWidth={1.5} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-3"
      >
        <span className="text-2xl font-black text-gray-800">NO </span>
        <span className="text-2xl font-light text-[#0a66c2]">POSTS</span>
        <span className="text-2xl font-black text-gray-800 ml-1">YET</span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-1 h-1 bg-[#0a66c2] rounded-full"
        />
        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
          FOLLOW • CONNECT • ENGAGE
        </span>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          className="w-1 h-1 bg-[#0a66c2] rounded-full"
        />
      </motion.div>

      <p className="text-gray-600 text-sm mb-6">
        Follow people to see their posts here
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0a66c2] text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
      >
        <Users className="w-4 h-4" />
        Find People to Follow
      </motion.button>
    </motion.div>
  );
};

export default EmptyFeed;