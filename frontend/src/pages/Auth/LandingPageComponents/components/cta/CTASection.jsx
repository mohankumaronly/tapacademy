import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Star, Sparkles, ArrowRight, Zap } from 'lucide-react';
import PropTypes from 'prop-types';
import LandingPageLayout from '../../../../../layouts/LandingPageLayout';
import { fadeInUp } from '../../animations/variants';

const stats = [
  { icon: <Briefcase size={16} className="text-green-600" />, value: "85%", label: "Hire Rate", bgColor: "bg-green-100" },
  { icon: <Users size={16} className="text-blue-600" />, value: "500+", label: "Companies", bgColor: "bg-blue-100" },
  { icon: <Star size={16} className="text-purple-600" />, value: "4.9/5", label: "Rating", bgColor: "bg-purple-100" }
];

const placements = [
  { name: 'Priya S.', role: 'Full Stack Developer', company: 'Amazon', delay: 0.1 },
  { name: 'Rahul M.', role: 'Java Backend', company: 'Microsoft', delay: 0.2 },
  { name: 'Anjali K.', role: 'MERN Stack', company: 'Google', delay: 0.3 }
];

const CTASection = ({ onGetStarted }) => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative z-10 overflow-hidden">
      <BackgroundBlur />
      
      <LandingPageLayout>
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          <CTAContent onGetStarted={onGetStarted} />
          <CTAPlacements />
        </motion.div>
      </LandingPageLayout>
    </section>
  );
};

const BackgroundBlur = () => (
  <div className="absolute inset-0 z-0 opacity-5">
    <div className="absolute top-0 left-0 w-64 h-64 bg-[#0a66c2] rounded-full blur-3xl" />
    <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
  </div>
);

const CTAContent = ({ onGetStarted }) => (
  <motion.div variants={fadeInUp} className="text-center lg:text-left space-y-6">
    <div className="inline-flex items-center gap-2 bg-[#0a66c2]/10 px-4 py-2 rounded-full">
      <Sparkles size={16} className="text-[#0a66c2]" />
      <span className="text-xs font-bold text-[#0a66c2] uppercase tracking-wider">Limited Access</span>
    </div>
    
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-slate-900">
      Ready to Launch{' '}
      <span className="text-[#0a66c2] relative inline-block">
        Your Career?
        <motion.div 
          className="absolute -bottom-2 left-0 w-full h-2 bg-[#0a66c2]/20 rounded-full"
          initial={{ scaleX: 0 }} 
          whileInView={{ scaleX: 1 }} 
          transition={{ delay: 0.5, duration: 0.8 }} 
        />
      </span>
    </h2>
    
    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
      Join <span className="font-bold text-[#0a66c2]">2,500+</span> Tap Academy interns who've already transformed their learning into dream jobs at top tech companies.
    </p>
    
    <StatsDisplay />
    
    <CTAButton onGetStarted={onGetStarted} />
  </motion.div>
);

const StatsDisplay = () => (
  <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
    {stats.map((stat, idx) => (
      <div key={idx} className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
          {stat.icon}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{stat.value}</p>
          <p className="text-xs text-slate-500">{stat.label}</p>
        </div>
      </div>
    ))}
  </div>
);

const CTAButton = ({ onGetStarted }) => (
  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center lg:items-start gap-4 pt-6">
    <motion.button 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }} 
      onClick={onGetStarted}
      className="group relative bg-[#0a66c2] text-white py-4 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-blue-200 hover:shadow-2xl transition-all overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-2">
        Access Intern Dashboard
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </span>
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-[#0a66c2]" 
        initial={{ x: '100%' }} 
        whileHover={{ x: 0 }} 
        transition={{ duration: 0.3 }} 
      />
    </motion.button>
    
    <p className="text-xs text-slate-400 flex items-center gap-1">
      <span className="w-1 h-1 bg-green-500 rounded-full" />
      No credit card required • Free for Tap Academy students
    </p>
  </div>
);

const CTAPlacements = () => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} 
    whileInView={{ opacity: 1, x: 0 }} 
    transition={{ delay: 0.3 }} 
    className="relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a66c2]/20 to-blue-400/20 rounded-3xl blur-2xl transform rotate-6" />
    
    <div className="relative bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-slate-900">Recent Placements</h4>
        <span className="text-xs text-[#0a66c2] font-bold bg-blue-50 px-3 py-1 rounded-full">This Month</span>
      </div>
      
      <div className="space-y-4">
        {placements.map((item, idx) => (
          <PlacementItem key={idx} item={item} />
        ))}
      </div>
      
      <div className="my-6 border-t border-slate-200" />
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">Trusted by</p>
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-16 h-6 bg-slate-200 rounded opacity-50" />
          ))}
        </div>
      </div>
    </div>
    
    <motion.div 
      animate={{ y: [0, -10, 0] }} 
      transition={{ duration: 3, repeat: Infinity }}
      className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg"
    >
      <span className="text-xs font-bold flex items-center gap-1">
        <Zap size={12} className="fill-white" /> Limited Time
      </span>
    </motion.div>
  </motion.div>
);

const PlacementItem = ({ item }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    transition={{ delay: item.delay }}
    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-white hover:shadow-md transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0a66c2] to-blue-400 flex items-center justify-center text-white font-bold text-sm">
        {item.name.charAt(0)}
      </div>
      <div>
        <p className="font-bold text-sm text-slate-900">{item.name}</p>
        <p className="text-xs text-slate-500">{item.role} • {item.company}</p>
      </div>
    </div>
    <div className="px-3 py-1 bg-green-100 rounded-full">
      <span className="text-[10px] font-bold text-green-700">Hired</span>
    </div>
  </motion.div>
);

PlacementItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    delay: PropTypes.number.isRequired
  }).isRequired
};

CTAContent.propTypes = {
  onGetStarted: PropTypes.func.isRequired
};

CTAButton.propTypes = {
  onGetStarted: PropTypes.func.isRequired
};

CTASection.propTypes = {
  onGetStarted: PropTypes.func.isRequired
};

export default CTASection;