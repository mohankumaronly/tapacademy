import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ConnectivityCard = ({ feature }) => {
  return (
    <motion.div 
      whileHover={{ x: 8 }} 
      className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-[#0a66c2]/30 hover:shadow-md transition-all"
    >
      <div className="shrink-0 bg-blue-50 p-1.5 sm:p-2 rounded-lg">
        {feature.icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-base sm:text-lg text-slate-800 mb-0.5">
          {feature.title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {feature.desc}
        </p>
      </div>
    </motion.div>
  );
};

ConnectivityCard.propTypes = {
  feature: PropTypes.shape({
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired
  }).isRequired
};

export default ConnectivityCard;