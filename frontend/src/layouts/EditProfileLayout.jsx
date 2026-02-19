import React from "react";
import { motion } from "framer-motion";
import Header from "./LayoutComponents/Header";

const EditProfileLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Simple Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Update your professional information</p>
          </div>
        </div>

        {/* Main Content - Full Width */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* Content - Full Width */}
            <div className="p-6 w-full">
              {children}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default EditProfileLayout;   