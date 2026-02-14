import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Floating bubbles - very subtle */}
      {[...Array(15)].map((_, i) => {
        // Generate random values that are consistent across renders
        const width = 50 + Math.random() * 100;
        const height = width;
        const left = Math.random() * 100;
        const xMove = (Math.random() - 0.5) * 200;
        const duration = 10 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-50/30"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              left: `${left}%`,
              bottom: "-100px",
            }}
            animate={{ 
              y: [0, -window.innerHeight - 200],
              x: [0, xMove],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear"
            }}
          />
        );
      })}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* 404 Number with animation */}
        <motion.div
          animate={{ 
            y: [-15, 15, -15],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <h1 className="text-8xl md:text-9xl font-bold text-blue-600 drop-shadow-lg">
            404
          </h1>
        </motion.div>

        {/* Title with scale animation */}
        <motion.h2
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4"
        >
          Page Not Found
        </motion.h2>

        {/* Description with fade animation */}
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-gray-600 text-base md:text-lg mb-10 max-w-md mx-auto"
        >
          The page you're looking for doesn't exist or has been moved to another dimension.
        </motion.p>

        {/* Buttons container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary button - White with blue text */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/home")}
            className="px-8 py-3.5 bg-white text-blue-600 rounded-xl font-medium border-2 border-blue-200 hover:border-blue-400 transition-all shadow-md"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Home
            </span>
          </motion.button>

          {/* Secondary button - White with gray text */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(107, 114, 128, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-8 py-3.5 bg-white text-gray-700 rounded-xl font-medium border-2 border-gray-200 hover:border-gray-400 transition-all shadow-md"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </span>
          </motion.button>
        </motion.div>

        {/* Additional help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-400 mt-8"
        >
          Need help? <button onClick={() => navigate("/contact")} className="text-blue-500 hover:underline">Contact Support</button>
        </motion.p>
      </div>
    </div>
  );
};

export default NotFoundPage;  