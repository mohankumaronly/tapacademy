import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Eye } from 'lucide-react';
import SkillsList from './SkillsList';
import ProfileAvatar from './ProfileAvatar';

const ProfileCard = ({ profile, index, onExplore }) => {
  const getFullName = () => {
    return profile.user?.fullName || 
           (profile.userId?.firstName && profile.userId?.lastName 
             ? `${profile.userId.firstName} ${profile.userId.lastName}`
             : profile.userId?.firstName || profile.userId?.lastName || "User");
  };

  const getProfileId = () => {
    return profile.userId?._id || profile.userId;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={() => onExplore(getProfileId())}
      className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 cursor-pointer transition-all duration-300 flex flex-col items-center text-center"
    >
      <ProfileAvatar 
        avatarUrl={profile.avatarUrl}
        name={getFullName()}
        showStatus={true}
      />

      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 truncate w-full">
        {getFullName()}
      </h3>
      
      <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-3">
        {profile.headline || <span className="text-gray-300 italic">No headline</span>}
      </p>

      <SkillsList skills={profile.skills} techStack={profile.techStack} />

      {profile.company && profile.role && (
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
          <Briefcase size={12} className="text-gray-400" />
          {profile.role} at {profile.company}
        </p>
      )}

      {profile.location && (
        <p className="text-xs text-gray-400 flex items-center gap-1 mb-4">
          <MapPin size={12} /> {profile.location}
        </p>
      )}

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation();
          onExplore(getProfileId());
        }}
        className="mt-2 w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        <Eye size={16} />
        Explore Profile
      </motion.button>
    </motion.div>
  );
};

export default ProfileCard;