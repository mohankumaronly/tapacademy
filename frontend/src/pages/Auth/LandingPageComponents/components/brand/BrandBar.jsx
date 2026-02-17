import React from 'react';
import { motion } from 'framer-motion';
import { Github, ArrowRight } from 'lucide-react';
import PropTypes from 'prop-types';
import LandingPageLayout from '../../../../../layouts/LandingPageLayout';
import TapAcademyLogo from '../../../../../common/TapAcademyLogo';

const BrandBar = ({ githubUrl = "https://github.com/mohankumaronly/tapacademy" }) => {
  return (
    <LandingPageLayout className="relative z-50 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TapAcademyLogo />

        <motion.a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <Github size={16} className="text-white" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold flex items-center gap-1">
              Get This Full Stack Project For Free
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-[8px] opacity-80">
              Open Source • Free
            </span>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-green-400 rounded-full"
          />
        </motion.a>
      </div>
    </LandingPageLayout>
  );
};

BrandBar.propTypes = {
  githubUrl: PropTypes.string
};

export default BrandBar;