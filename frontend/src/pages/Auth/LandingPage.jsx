import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackgroundElements from './LandingPageComponents/layout/BackgroundElements';
import BrandBar from './LandingPageComponents/components/brand/BrandBar';
import HeroSection from './LandingPageComponents/hero/HeroSection';
import ConnectivitySection from './LandingPageComponents/components/connectivity/ConnectivitySection';
import JourneySteps from './LandingPageComponents/components/journey/JourneySteps';
import LeadershipCarousel from './LandingPageComponents/components/leadership/LeadershipCarousel';
import CTASection from './LandingPageComponents/components/cta/CTASection';
import Footer from './LandingPageComponents/components/footer/Footer';
import { LEADERS } from './LandingPageComponents/constants/leadership';


const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => navigate('/auth/register');
  const handleWatchStories = () => {
    // Add your success stories navigation logic here
    console.log('Watch success stories');
  };

  return (
    <div className="min-h-screen bg-[#f4f2ee] font-sans text-slate-900 overflow-x-hidden relative">
      <BackgroundElements />
      <BrandBar />
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <HeroSection 
          onGetStarted={handleGetStarted}
          onWatchStories={handleWatchStories}
        />
        <ConnectivitySection />
        <JourneySteps />
        <LeadershipCarousel 
          leaders={LEADERS}
          autoPlayInterval={5000}
        />
        <CTASection onGetStarted={handleGetStarted} />
        <Footer />
      </motion.div>
    </div>
  );
};

export default LandingPage;