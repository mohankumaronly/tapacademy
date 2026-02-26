import React from 'react';

const ProfileAvatar = ({ avatarUrl, name, size = 'lg', showStatus = false }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  return (
    <div className="relative mb-4">
      <img
        src={avatarUrl || "/avatar-placeholder.png"}
        className={`${sizeClasses[size]} rounded-full object-cover border-4 border-gray-50 group-hover:border-blue-100 transition-all`}
        alt={name || 'Profile'}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/avatar-placeholder.png";
        }}
      />
      {showStatus && (
        <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

export default ProfileAvatar;