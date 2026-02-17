import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const VideoModal = ({ isOpen, onClose, videoSrc }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl"
        >
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-[#0a66c2] transition-colors z-10"
          >
            <X size={24} />
          </button>
          
          <div className="bg-black rounded-2xl overflow-hidden">
            <video 
              src={videoSrc}
              controls
              autoPlay
              className="w-full"
              style={{ maxHeight: '80vh' }}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <p className="text-white text-center mt-4 text-sm">
            Tap Academy Success Stories
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

VideoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  videoSrc: PropTypes.string.isRequired
};

export default VideoModal;