import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { fadeInUp } from '../../animations/variants';

const JourneyStepCard = ({ step }) => {
  return (
    <motion.div 
      variants={fadeInUp} 
      className="bg-[#f4f2ee] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 border border-slate-200 relative group hover:bg-white hover:shadow-xl transition-all h-full"
    >
      <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-8 h-8 sm:w-10 sm:h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">
        {step.step}
      </div>
      <div className="bg-white w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 text-[#0a66c2] shadow-sm border border-slate-100">
        {step.icon}
      </div>
      <h3 className="text-lg sm:text-xl font-black mb-2 sm:mb-3 text-slate-900">{step.title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{step.desc}</p>
    </motion.div>
  );
};

JourneyStepCard.propTypes = {
  step: PropTypes.shape({
    step: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired
  }).isRequired
};

export default JourneyStepCard;