import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, GraduationCap, Link as LinkIcon, Github, Linkedin, 
  Briefcase, UserPlus, Check, MessageCircle, MoreHorizontal,
  Award, ExternalLink, Users, Calendar
} from "lucide-react";

import Loading from "../../components/Loading";
import { getProfileById } from "../../services/profile.service";
import { getFollowStats, toggleFollow } from "../../services/follow.service";
import { useAuth } from "../../context/AuthContext";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0, isFollowing: false });
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");

  const isOwnProfile = user?.id === userId;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        getProfileById(userId),
        getFollowStats(userId)
      ]);
      
      setProfile(profileRes.data.data);
      const stats = statsRes.data?.data || {};
      setFollowStats({
        followers: stats.followers || 0,
        following: stats.following || 0,
        isFollowing: stats.isFollowing || false,
      });
    } catch (err) {
      setError(err.response?.status === 404 ? "Profile not found" : "Error loading profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) loadData();
  }, [userId, loadData]);

  const handleFollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);
    
    const originalStats = { ...followStats };
    setFollowStats(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1
    }));

    try {
      const res = await toggleFollow(userId);
      const data = res.data?.data || {};
      setFollowStats(prev => ({
        ...prev,
        isFollowing: Boolean(data.isFollowing),
        followers: data.followers ?? prev.followers
      }));
    } catch {
      setFollowStats(originalStats);
    } finally {
      setFollowLoading(false);
    }
  };

  const getInitials = () => {
    if (profile?.userId?.firstName && profile?.userId?.lastName) {
      return `${profile.userId.firstName[0]}${profile.userId.lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-red-500 font-semibold">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <div className="h-16"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                        alt={profile.userId?.firstName}
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                        {getInitials()}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  <h1 className="text-xl font-bold text-gray-900">
                    {profile.userId?.firstName} {profile.userId?.lastName}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {profile.headline || "Professional"}
                  </p>
                  
                  {profile.location && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                      <MapPin size={12} />
                      {profile.location}
                    </p>
                  )}

                  <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100 w-full">
                    <div className="text-center">
                      <span className="block font-bold text-gray-900">{followStats.followers}</span>
                      <span className="text-xs text-gray-500">Followers</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-bold text-gray-900">{followStats.following}</span>
                      <span className="text-xs text-gray-500">Following</span>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <div className="flex gap-2 mt-4 w-full">
                      <button
                        onClick={handleFollow}
                        disabled={followLoading}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          followStats.isFollowing
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {followLoading ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : followStats.isFollowing ? (
                          <>
                            <Check size={16} />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={16} />
                            Follow
                          </>
                        )}
                      </button>
                      
                      <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <MessageCircle size={16} />
                        Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">About</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                {profile.bio || "No bio added yet."}
              </p>
            </motion.div>

            {profile.skills?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Contact Info</h3>
              <div className="space-y-3">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin size={16} />
                    <span>LinkedIn</span>
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                )}
                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <LinkIcon size={16} />
                    <span>Portfolio</span>
                    <ExternalLink size={12} className="ml-auto" />
                  </a>
                )}
                {!profile.github && !profile.linkedin && !profile.portfolio && (
                  <p className="text-gray-400 text-sm italic">No contact information added.</p>
                )}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-gray-200"
            >
              <div className="border-b border-gray-200 px-6">
                <nav className="flex space-x-8">
                  {["about", "experience", "education"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors relative ${
                        activeTab === tab
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-base">
                        <Briefcase size={18} className="text-blue-600" />
                        Experience
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {profile.experience || "No experience added yet."}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-base">
                        <GraduationCap size={18} className="text-blue-600" />
                        Education
                      </h3>
                      <div className="space-y-4">
                        {profile.education && (
                          <div>
                            <p className="font-medium text-gray-900">{profile.education}</p>
                            {profile.college && (
                              <p className="text-sm text-gray-600">{profile.college}</p>
                            )}
                            {profile.batchName && (
                              <p className="text-xs text-gray-400 mt-1">Class of {profile.batchName}</p>
                            )}
                          </div>
                        )}
                        {!profile.education && !profile.college && (
                          <p className="text-gray-400 text-sm italic">No education details added.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "experience" && (
                  <div className="py-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Briefcase className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Experience</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {profile.experience || "No experience details added yet."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "education" && (
                  <div className="py-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <GraduationCap className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Education</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {profile.education || "No education details added yet."}
                        </p>
                        {profile.college && (
                          <p className="text-sm text-gray-600 mt-2">{profile.college}</p>
                        )}
                        {profile.batchName && (
                          <p className="text-xs text-gray-400 mt-1">Batch of {profile.batchName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Activity Section (Optional) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide">Activity</h3>
              <div className="flex items-center justify-center py-8 text-gray-400">
                <Users size={32} className="mr-3" />
                <p className="text-sm">No recent activity</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage; 