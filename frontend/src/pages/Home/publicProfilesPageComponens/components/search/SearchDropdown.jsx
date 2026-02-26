import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';
import ProfileAvatar from '../profiles/ProfileAvatar';

const SearchDropdown = ({ suggestions, isOpen, onSelect, onClose }) => {
  if (!isOpen || !suggestions.length) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute w-full bg-white border border-gray-200 shadow-xl rounded-2xl mt-2 z-50 overflow-hidden"
      >
        {suggestions.map((profile, index) => {
          const profileId = profile.userId?._id || profile.userId;
          const fullName = profile.user?.fullName || 
                          (profile.userId?.firstName && profile.userId?.lastName 
                            ? `${profile.userId.firstName} ${profile.userId.lastName}`
                            : profile.userId?.firstName || profile.userId?.lastName || "User");

          return (
            <motion.div
              key={profile.id || profile._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => {
                onSelect(profileId);
                onClose();
              }}
              className="flex items-center gap-4 p-4 cursor-pointer border-b last:border-none"
            >
              <ProfileAvatar 
                avatarUrl={profile.avatarUrl} 
                name={fullName}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {fullName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {profile.headline || "No headline updated"}
                </p>
                {profile.location && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {profile.location}
                  </p>
                )}
              </div>
              <ChevronRight size={20} className="text-gray-300 flex-shrink-0" />
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDropdown;