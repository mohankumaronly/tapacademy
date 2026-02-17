import React from 'react';
import { motion } from 'framer-motion';
import { Star, Code2, Briefcase } from 'lucide-react';

const NetworkVisual = () => {
  return (
    <div className="relative max-w-md mx-auto lg:mx-0">
      <div className="absolute inset-0 bg-[#0a66c2]/10 blur-[100px] -z-10 rounded-[2.5rem]" />
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] p-5 sm:p-6 lg:p-8 shadow-xl">
        
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 overflow-hidden ring-2 ring-[#0a66c2]/20">
              <img src="https://i.pravatar.cc/150?u=tech" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <h5 className="font-black text-sm sm:text-base text-slate-900">Mohan Kumaronly</h5>
              <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Java Fullstack Intern</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.1 }} className="bg-blue-50 p-1.5 sm:p-2 rounded-lg cursor-pointer text-[#0a66c2]">
            <Star size={14} className="sm:w-4 sm:h-4" fill="currentColor" />
          </motion.div>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100">
            <p className="text-xs text-slate-600 mb-2 sm:mb-3 leading-relaxed">
              "Just finished building my first Microservice using Spring Boot at Tap Academy! Check out my logic below."
            </p>
            <div className="aspect-video bg-slate-200 rounded-lg sm:rounded-xl overflow-hidden border border-slate-300 relative">
              <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2062" className="object-cover w-full h-full grayscale opacity-70" alt="Code" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg">
                  <Code2 className="text-[#0a66c2]" size={20} />
                </div>
              </div>
            </div>
          </div>
          
          <PeerEndorsements />
          
          <button className="w-full bg-[#0a66c2] text-white text-xs sm:text-sm font-bold py-3 sm:py-4 rounded-lg sm:rounded-xl mt-2 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-blue-100 hover:bg-[#0a66c2]/90 transition-colors">
            <Briefcase size={14} className="sm:w-4 sm:h-4" /> Showcase in Resume
          </button>
        </div>
      </div>
    </div>
  );
};

const PeerEndorsements = () => (
  <div className="flex items-center justify-between px-1 sm:px-2">
    <div className="flex -space-x-2 sm:-space-x-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white bg-slate-300 overflow-hidden shadow-sm">
          <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Peer" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full border-2 border-white bg-[#0a66c2] text-white flex items-center justify-center text-[8px] sm:text-[9px] lg:text-[10px] font-bold shadow-sm">+12</div>
    </div>
    <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peer Endorsements</span>
  </div>
);

export default NetworkVisual;