import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Users, Code2, Globe, Heart, Zap } from 'lucide-react';
import PropTypes from 'prop-types';
import LandingPageLayout from '../../../../layouts/LandingPageLayout';
import { fadeInUp, staggerContainer } from '../animations/variants';
import VideoModal from '../components/videoModel/VideoModal';

const activityFeed = [
  { user: 'Priya S.', avatar: 'P', activity: 'completed Spring Boot Microservices', time: '2m ago', color: 'from-blue-500 to-[#0a66c2]' },
  { user: 'Rahul M.', avatar: 'R', activity: 'shared React portfolio', time: '15m ago', color: 'from-purple-500 to-pink-500' },
  { user: 'Anjali K.', avatar: 'A', activity: 'got hired at Google', time: '1h ago', color: 'from-green-500 to-emerald-500' }
];

const HeroSection = ({ onGetStarted }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoUrl = "/videos/Sucess story video.mp4";

  return (
    <>
      <section className="relative z-10 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-20 right-20 w-72 h-72 bg-[#0a66c2]/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
          />
        </div>

        <LandingPageLayout>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left space-y-5 sm:space-y-6"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0a66c2]/10 to-blue-400/10 backdrop-blur-md border border-[#0a66c2]/20 px-3 py-1.5 rounded-full">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 bg-[#0a66c2] rounded-full" />
                <span className="text-[10px] sm:text-xs font-bold text-[#0a66c2] uppercase tracking-wider">Tap Academy Exclusive</span>
                <Sparkles size={12} className="text-[#0a66c2]" />
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black leading-[1.2] tracking-tight">
                <span className="text-slate-900">Connect.</span><br />
                <span className="text-slate-900">Share.</span><br />
                <motion.span className="relative inline-block mt-1">
                  <span className="relative z-10 bg-gradient-to-r from-[#0a66c2] to-blue-500 bg-clip-text text-transparent italic">Get Hired.</span>
                  <motion.div className="absolute -bottom-1.5 left-0 w-full h-2 bg-[#0a66c2]/20 rounded-full" 
                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }} />
                </motion.span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The exclusive social hub where <span className="font-bold text-[#0a66c2]">Tap Academy students</span>{' '}
                transform their learning journey into career opportunities. Document your progress, connect with peers, and get noticed by top employers.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center lg:items-start gap-3 pt-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={onGetStarted}
                  className="group relative w-full sm:w-auto bg-gradient-to-r from-[#0a66c2] to-blue-500 text-white text-sm sm:text-base font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-200/50 hover:shadow-2xl transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Join the Intern Network
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight size={16} />
                    </motion.span>
                  </span>
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#0a66c2]" initial={{ x: '100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVideoOpen(true)}
                  className="w-full sm:w-auto bg-white text-slate-700 text-sm sm:text-base font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-[#0a66c2]/30 hover:shadow-lg transition-all group"
                >
                  <Play size={16} className="group-hover:text-[#0a66c2] transition-colors" /> 
                  See Success Stories
                </motion.button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div key={i} whileHover={{ scale: 1.1, y: -2 }} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden shadow-md">
                      <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt="User" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0a66c2] text-white flex items-center justify-center text-[10px] font-bold shadow-md">+2.5k</div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-900">2,500+ Active Interns</p>
                  <p className="text-[10px] text-slate-500">Joined this month</p>
                </div>
              </motion.div>
            </motion.div>

            <HeroRightPanel activityFeed={activityFeed} />
          </div>
        </LandingPageLayout>

        <ScrollIndicator />
      </section>

      <VideoModal 
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoSrc={videoUrl}
      />
    </>
  );
};

const HeroRightPanel = ({ activityFeed }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} 
    animate={{ opacity: 1, x: 0 }} 
    transition={{ duration: 0.8, delay: 0.3 }} 
    className="relative hidden lg:block"
  >
    <div className="relative">
      <motion.div 
        animate={{ y: [0, -8, 0] }} 
        transition={{ duration: 6, repeat: Infinity }} 
        className="relative bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0a66c2] to-blue-500 flex items-center justify-center">
              <Zap className="text-white w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">Tap Academy Feed</h3>
              <p className="text-[10px] text-slate-400">Live Activity</p>
            </div>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="w-1.5 h-1.5 bg-green-500 rounded-full" 
          />
        </div>

        <div className="space-y-3">
          {activityFeed.map((item, idx) => (
            <ActivityItem key={idx} item={item} index={idx} />
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200">
          <button className="text-[10px] font-bold text-[#0a66c2] hover:text-blue-600 flex items-center gap-1 group">
            View all activity
            <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      <TechBadge position="top-right" />
      <TechBadge position="bottom-left" />
    </div>
  </motion.div>
);

const ActivityItem = ({ item, index }) => (
  <motion.div 
    key={index} 
    initial={{ opacity: 0, x: -20 }} 
    animate={{ opacity: 1, x: 0 }} 
    transition={{ delay: 0.5 + (index * 0.1) }}
    className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg hover:bg-white hover:shadow-md transition-all group"
  >
    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xs`}>
      {item.avatar}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-xs text-slate-900">{item.user}</span>
        <span className="text-[8px] text-slate-400">{item.time}</span>
      </div>
      <p className="text-[10px] text-slate-600">{item.activity}</p>
    </div>
    <motion.div 
      whileHover={{ scale: 1.1 }} 
      className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Heart size={10} className="text-red-400" />
    </motion.div>
  </motion.div>
);

const TechBadge = ({ position }) => {
  const positions = {
    'top-right': 'absolute -top-5 -right-5',
    'bottom-left': 'absolute -bottom-5 -left-5'
  };

  const content = {
    'top-right': {
      icon: <Code2 size={12} className="text-[#0a66c2]" />,
      label: 'JAVA',
      progress: '75%'
    },
    'bottom-left': {
      icon: <Globe size={12} className="text-blue-500" />,
      label: 'MERN',
      peers: '24 peers online'
    }
  };

  return (
    <motion.div 
      animate={{ 
        rotate: position === 'top-right' ? [0, 5, 0] : [0, -5, 0], 
        y: position === 'top-right' ? [0, -12, 0] : [0, -8, 0] 
      }} 
      transition={{ duration: position === 'top-right' ? 8 : 7, repeat: Infinity }}
      className={`${positions[position]} bg-white rounded-xl border-2 border-slate-200 p-3 shadow-xl w-36`}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        {content[position].icon}
        <span className="text-[8px] font-bold text-slate-400">{content[position].label}</span>
      </div>
      {position === 'top-right' ? (
        <>
          <div className="w-full h-1 bg-slate-200 rounded-full mb-1">
            <div className="w-3/4 h-full bg-[#0a66c2] rounded-full" />
          </div>
          <p className="text-[7px] text-slate-500">{content[position].progress} completed</p>
        </>
      ) : (
        <div className="flex items-center gap-1">
          <Users size={10} className="text-slate-400" />
          <span className="text-[8px] text-slate-600">{content[position].peers}</span>
        </div>
      )}
    </motion.div>
  );
};

const ScrollIndicator = () => (
  <motion.div 
    animate={{ y: [0, 8, 0] }} 
    transition={{ duration: 2, repeat: Infinity }}
    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden lg:block"
  >
    <div className="w-5 h-8 border-2 border-slate-300 rounded-full flex justify-center">
      <div className="w-1 h-1.5 bg-slate-400 rounded-full mt-1.5" />
    </div>
  </motion.div>
);

HeroSection.propTypes = {
  onGetStarted: PropTypes.func.isRequired
};

export default HeroSection;