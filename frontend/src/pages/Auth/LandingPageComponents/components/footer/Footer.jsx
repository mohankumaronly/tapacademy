import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, ArrowRight, Heart } from 'lucide-react';
import PropTypes from 'prop-types';
import LandingPageLayout from '../../../../../layouts/LandingPageLayout';
import TapAcademyLogo from '../../../../../common/TapAcademyLogo';
import { SOCIAL_LINKS } from '../../constants/social';
import { CREATOR } from '../../constants/creator';

const quickLinks = [
  'About Tap Academy',
  'Internship Programs',
  'Success Stories',
  'Hiring Partners',
  'FAQs'
];

const Footer = () => {
  return (
    <footer className="relative z-10 bg-white border-t border-slate-200">
      <LandingPageLayout className="py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          <FooterBrand />
          <FooterLinks />
          <FooterSocial />
          
        </div>

        <FooterCopyright />
      </LandingPageLayout>
    </footer>
  );
};

const FooterBrand = () => (
  <div className="lg:col-span-5 space-y-6">
    <TapAcademyLogo />
    
    <p className="text-sm text-slate-500 leading-relaxed max-w-md">
      The exclusive professional network built for Tap Academy students. 
      Connect with peers, showcase your projects, and launch your tech career.
    </p>
    
    <div className="pt-4">
      <p className="text-xs text-slate-400 font-medium mb-3">Created by</p>
      <CreatorInfo />
    </div>
  </div>
);

const CreatorInfo = () => (
  <div className="flex items-center gap-4">
    <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0a66c2] to-blue-400 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
        <span className="text-white font-black text-sm">{CREATOR.initials}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-800 group-hover:text-[#0a66c2] transition-colors">{CREATOR.name}</span>
        <span className="text-[10px] text-slate-500 font-medium">{CREATOR.role}</span>
      </div>
    </a>
  </div>
);

const FooterLinks = () => (
  <div className="lg:col-span-3">
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Quick Links</h4>
    <ul className="space-y-3">
      {quickLinks.map((link, idx) => (
        <li key={idx}>
          <a href="https://thetapacademy.com" className="text-sm text-slate-600 hover:text-[#0a66c2] font-medium transition-colors">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const FooterSocial = () => (
  <div className="lg:col-span-4">
    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Connect With Creator</h4>
    
    <div className="space-y-4">
      <SocialLink
        href={SOCIAL_LINKS.linkedin}
        icon={<Linkedin className="w-4 h-4 text-[#0a66c2]" />}
        title="LinkedIn Profile"
        subtitle="/in/mohan-kumar-3151a1308"
        hoverBg="hover:bg-[#0a66c2]"
        hoverIcon="group-hover:text-white"
      />

      <SocialLink
        href={SOCIAL_LINKS.github}
        icon={<Github className="w-4 h-4 text-slate-700" />}
        title="GitHub Profile"
        subtitle="/mohankumaronly"
        hoverBg="hover:bg-slate-800"
        hoverIcon="group-hover:text-white"
      />
    </div>
  </div>
);

const SocialLink = ({ href, icon, title, subtitle, hoverBg, hoverIcon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-3 p-3 bg-[#f4f2ee] rounded-xl hover:bg-[#0a66c2]/5 transition-all group border border-slate-200"
  >
    <div className={`p-2 bg-white rounded-lg shadow-sm group-hover:${hoverBg} transition-colors`}>
      {React.cloneElement(icon, { className: `w-4 h-4 group-hover:${hoverIcon} transition-colors` })}
    </div>
    <div className="flex-1">
      <p className="text-sm font-bold text-slate-800 group-hover:text-[#0a66c2] transition-colors">{title}</p>
      <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{subtitle}</p>
    </div>
    <ArrowRight size={14} className="text-slate-400 group-hover:text-[#0a66c2] group-hover:translate-x-1 transition-all" />
  </a>
);

SocialLink.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  hoverBg: PropTypes.string.isRequired,
  hoverIcon: PropTypes.string.isRequired
};

const FooterCopyright = () => (
  <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
    <p className="text-[10px] sm:text-xs text-slate-400 order-2 sm:order-1">
      © 2026 Tap Academy Experiences. All rights reserved.
    </p>
    <div className="flex items-center gap-2 order-1 sm:order-2">
      <span className="text-[10px] sm:text-xs text-slate-400 flex items-center gap-1.5">
        Built with 
        <motion.span 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }} 
          className="inline-flex"
        >
          <Heart size={12} className="text-red-500 fill-red-500" />
        </motion.span>
        by
      </span>
      <a 
        href={SOCIAL_LINKS.github} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[10px] sm:text-xs font-bold text-slate-700 hover:text-[#0a66c2] transition-colors flex items-center gap-1"
      >
        {CREATOR.name}
        <motion.span whileHover={{ x: 2 }} className="inline-flex">
          <ArrowRight size={10} />
        </motion.span>
      </a>
    </div>
  </div>
);

export default Footer;