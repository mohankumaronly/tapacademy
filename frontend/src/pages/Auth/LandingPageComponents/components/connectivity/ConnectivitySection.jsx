import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Share2, FileText, Briefcase } from 'lucide-react';
import Section from '../../layout/Section';
import ConnectivityCard from './ConnectivityCard';
import NetworkVisual from './NetworkVisual';
import { fadeInUp } from '../../animations/variants';

const features = [
  { icon: <Globe className="text-[#0a66c2]" size={18} />, title: "Network with Peer Interns", desc: "Follow fellow Tap Academy students. See what they're building in their MERN or Java Fullstack modules." },
  { icon: <Share2 className="text-[#0a66c2]" size={18} />, title: "Share Daily Progress", desc: "Don't just code in silence. Post snippets of your Spring Boot APIs or React components to get community feedback." },
  { icon: <FileText className="text-[#0a66c2]" size={18} />, title: "Automatic Resume Building", desc: "Our platform aggregates your documented learning into a job-ready resume highlighting actual project history." },
  { icon: <Briefcase className="text-[#0a66c2]" size={18} />, title: "Get Noticed by Partners", desc: "Showcase your database schemas and code logic directly to hiring partners associated with Tap Academy." }
];

const ConnectivitySection = () => {
  return (
    <Section className="py-12 sm:py-16 lg:py-20">
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }} 
        variants={fadeInUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center"
      >
        <div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6 leading-tight text-slate-900">
            Turn Your Learning into <br className="hidden sm:block" />
            <span className="text-[#0a66c2]">Proof of Work.</span>
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {features.map((feature, idx) => (
              <ConnectivityCard key={idx} feature={feature} />
            ))}
          </div>
        </div>
        <div className="mt-6 lg:mt-0">
          <NetworkVisual />
        </div>
      </motion.div>
    </Section>
  );
};

export default ConnectivitySection;