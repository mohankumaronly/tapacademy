import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Code, Sparkles } from 'lucide-react';

const BRAND = {
  name: 'TAP ACADEMY',
  tagline: 'LEARN • CODE • SHARE'
};

const TapAcademyLogo = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3 group cursor-pointer"
    >
      {/* Icon with blue accent */}
      <motion.div 
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="relative"
      >
        {/* Blue glow effect */}
        <div className="absolute inset-0 bg-[#0a66c2] rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
        
        {/* Main icon */}
        <div className="relative bg-black p-2.5 sm:p-3 rounded-xl shadow-xl border-2 border-[#0a66c2]">
          <Cpu className="text-white w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
        </div>
      </motion.div>

      {/* Text */}
      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className="text-xl sm:text-2xl font-black text-black">TAP</span>
          <span className="text-xl sm:text-2xl font-light text-[#0a66c2] ml-1">ACADEMY</span>
        </div>
        <div className="flex items-center gap-1">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-1 bg-[#0a66c2] rounded-full"
          />
          <span className="text-[8px] sm:text-[10px] font-medium text-gray-600 uppercase tracking-widest">
            {BRAND.tagline}
          </span>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="w-1 h-1 bg-[#0a66c2] rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TapAcademyLogo;