import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Share2, Rocket } from 'lucide-react';
import Section from '../../layout/Section';
import JourneyStepCard from './JourneyStepCard';
import { staggerContainer } from '../../animations/variants';

const steps = [
  { icon: <Camera size={24} />, step: "1", title: "Document Tech Journey", desc: "Take snapshots of your progress as you master MERN or Java Fullstack at Tap Academy." },
  { icon: <Share2 size={24} />, step: "2", title: "Network with Peers", desc: "Connect with fellow students, share solutions, and build your professional community." },
  { icon: <Rocket size={24} />, step: "3", title: "Get Noticed by Recruiters", desc: "Let your live portfolio do the talking. Turn your intern activity into a job-ready profile." }
];

const JourneySteps = () => {
  return (
    <Section bgWhite className="py-12 sm:py-16 lg:py-20 border-y border-slate-200">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <h2 className="text-3xl sm:text-4xl font-black mb-3 sm:mb-4 text-slate-900">Connect. Grow. Succeed.</h2>
        <div className="h-1 w-16 sm:w-20 bg-[#0a66c2] mx-auto rounded-full" />
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-500 font-medium italic">
          Learning happens at the Academy. Success happens here.
        </p>
      </div>

      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, margin: "-100px" }} 
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
      >
        {steps.map((step, idx) => (
          <JourneyStepCard key={idx} step={step} />
        ))}
      </motion.div>
    </Section>
  );
};

export default JourneySteps;