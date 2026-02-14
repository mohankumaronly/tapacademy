import React from "react";
import Header from "./LayoutComponents/Header";
// import Header from "../components/LayoutComponents/Header";

const ProfileLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Profile Info (optional, can be added here if needed) */}
          <div className="hidden lg:block lg:col-span-3">
            {/* This space can be used for additional profile widgets */}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {children}
            </div>
          </div>

          {/* Right Sidebar - Suggestions/News */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-20">
              <h3 className="font-semibold text-gray-700 mb-3">Add to your feed</h3>
              <div className="space-y-4">
                {/* Sample suggestions - you can make this dynamic */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Company Name</p>
                      <p className="text-xs text-gray-500">Industry</p>
                    </div>
                  </div>
                  <button className="text-xs text-blue-600 font-medium border border-blue-600 px-3 py-1 rounded-full hover:bg-blue-50">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileLayout;   