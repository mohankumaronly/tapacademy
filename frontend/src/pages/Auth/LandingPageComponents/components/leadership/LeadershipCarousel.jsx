import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import PropTypes from 'prop-types';
import Section from '../../layout/Section';
import LeadershipCard from './LeadershipCard';
import { useCarousel } from '../../hooks/useCarousel';

const LeadershipCarousel = ({ leaders, autoPlayInterval = 5000 }) => {
  const { currentIndex, direction, nextSlide, prevSlide, goToSlide } = useCarousel(leaders.length, autoPlayInterval);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.5
      }
    })
  };

  return (
    <Section bgWhite className="py-20 sm:py-24 lg:py-32 overflow-hidden">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#0a66c2]/10 px-4 py-2 rounded-full mb-6"
        >
          <span className="text-xs font-bold text-[#0a66c2] uppercase tracking-wider">
            Leadership Team
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black mb-4 text-slate-900"
        >
          Meet the {' '}
          <span className="bg-gradient-to-r from-[#0a66c2] to-blue-500 bg-clip-text text-transparent">
            Visionaries
          </span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-slate-600 max-w-2xl mx-auto"
        >
          The passionate minds behind Tap Academy, dedicated to transforming education through technology
        </motion.p>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[500px] sm:h-[450px] md:h-[400px] lg:h-[380px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full"
            >
              <LeadershipCard leader={leaders[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        <CarouselNavigation 
          onPrev={prevSlide} 
          onNext={nextSlide}
          currentIndex={currentIndex}
          totalItems={leaders.length}
          goToSlide={goToSlide}
        />
      </div>
    </Section>
  );
};

const CarouselNavigation = ({ onPrev, onNext, currentIndex, totalItems, goToSlide }) => (
  <>
    <div className="hidden md:block">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 p-3 rounded-full bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all group z-20"
      >
        <ChevronLeft size={24} className="text-slate-600 group-hover:text-[#0a66c2] transition-colors" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 p-3 rounded-full bg-white border border-slate-200 shadow-xl hover:shadow-2xl transition-all group z-20"
      >
        <ChevronRight size={24} className="text-slate-600 group-hover:text-[#0a66c2] transition-colors" />
      </motion.button>
    </div>

    <div className="flex justify-center items-center gap-2 mt-8">
      {Array.from({ length: totalItems }).map((_, index) => (
        <motion.button
          key={index}
          onClick={() => goToSlide(index)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <div
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 h-2 bg-[#0a66c2]'
                : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
            }`}
          />
        </motion.button>
      ))}
    </div>

    <div className="flex justify-center items-center gap-4 mt-6 md:hidden">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        className="p-3 rounded-full bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all group"
      >
        <ChevronLeft size={20} className="text-slate-600 group-hover:text-[#0a66c2] transition-colors" />
      </motion.button>
      
      <span className="text-sm font-medium text-slate-500">
        {currentIndex + 1} / {totalItems}
      </span>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className="p-3 rounded-full bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all group"
      >
        <ChevronRight size={20} className="text-slate-600 group-hover:text-[#0a66c2] transition-colors" />
      </motion.button>
    </div>
  </>
);

CarouselNavigation.propTypes = {
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  goToSlide: PropTypes.func.isRequired
};

LeadershipCarousel.propTypes = {
  leaders: PropTypes.array.isRequired,
  autoPlayInterval: PropTypes.number
};

export default LeadershipCarousel;