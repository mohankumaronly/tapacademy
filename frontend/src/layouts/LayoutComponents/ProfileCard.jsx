import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../services/profile.service';
import { getFollowStats } from '../../services/follow.service';

const ProfileCard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [followStats, setFollowStats] = useState({
        followers: 0,
        following: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        const loadProfileData = async () => {
            try {
                // Load profile data
                const profileRes = await getMyProfile(user.id);
                const profile = profileRes.data.data;
                setProfileData(profile);

                // Load follow stats
                const statsRes = await getFollowStats(user.id);
                setFollowStats(statsRes.data.data);
            } catch (error) {
                console.error('Error loading profile data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfileData();
    }, [user?.id]);

    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        return user?.email?.[0]?.toUpperCase() || 'U';
    };

    if (!user || loading) return null;

    // Use profileData if available, fallback to user object
    const avatarUrl = profileData?.avatarUrl || user?.avatarUrl || null;
    const headline = profileData?.headline || user?.headline || 'Add your headline';
    const location = profileData?.location || null;

    return (
        <motion.div 
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => navigate(`/profile/${user.id}`)}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-20 cursor-pointer"
        >
            {/* Profile Info - Simplified without banner */}
            <div className="px-4 py-4">
                <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex justify-center mb-3"
                >
                    {avatarUrl ? (
                        <img 
                            src={avatarUrl} 
                            alt={user.firstName}
                            className="w-20 h-20 rounded-full border-2 border-gray-200 object-cover"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full border-2 border-gray-200 flex items-center justify-center text-white font-bold text-xl">
                            {getInitials()}
                        </div>
                    )}
                </motion.div>
                
                <motion.h3 
                    whileHover={{ color: "#2563eb" }}
                    className="text-center font-semibold text-lg"
                >
                    {user.firstName} {user.lastName}
                </motion.h3>
                
                <p className="text-center text-gray-500 text-sm">
                    {headline}
                </p>

                {location && (
                    <p className="text-center text-xs text-gray-400 mt-1">
                        {location}
                    </p>
                )}
                
                <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Followers</span>
                        <span className="text-blue-600 font-semibold">
                            {followStats.followers}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Following</span>
                        <span className="text-blue-600 font-semibold">
                            {followStats.following}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileCard;