import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, GraduationCap, Link as LinkIcon, Github, Linkedin, 
  Briefcase, UserPlus, Check, MessageCircle, MoreHorizontal,
  Award, ExternalLink, Users, Calendar, ArrowLeft, Mail,
  Building, Globe, ChevronRight, Loader2
} from "lucide-react";

import Loading from "../../components/Loading";
import { getProfileById } from "../../services/profile.service";
import { getFollowStats, toggleFollow, getFollowers, getFollowing } from "../../services/follow.service";
import { useAuth } from "../../context/AuthContext";
import FollowListModal from "../../components/FollowListModal";

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
  
  // Modal states
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

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

  // Modal handlers with loading states
  const openFollowers = async () => {
    try {
      setLoadingModal(true);
      setShowFollowers(true);
      const res = await getFollowers(userId);
      setFollowersList(res.data.data || []);
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setLoadingModal(false);
    }
  };

  const openFollowing = async () => {
    try {
      setLoadingModal(true);
      setShowFollowing(true);
      const res = await getFollowing(userId);
      setFollowingList(res.data.data || []);
    } catch (error) {
      console.error("Error fetching following:", error);
    } finally {
      setLoadingModal(false);
    }
  };

  const getInitials = () => {
    if (profile?.userId?.firstName && profile?.userId?.lastName) {
      return `${profile.userId.firstName[0]}${profile.userId.lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-500 font-semibold text-lg mb-2">Oops!</p>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {/* Sticky Back Button */}
      <div className="sticky top-0 z-10 bg-[#f3f2ef]/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="p-1 rounded-full group-hover:bg-gray-200 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-4 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
                        alt={profile.userId?.firstName}
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-full border-4 border-white bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
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

                  {/* Followers/Following with loading states */}
                  <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100 w-full">
                    <button 
                      onClick={openFollowers}
                      className="text-center hover:opacity-80 transition-opacity group relative"
                      disabled={loadingModal}
                    >
                      {loadingModal && showFollowers ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 size={16} className="animate-spin text-blue-600" />
                        </div>
                      ) : (
                        <>
                          <span className="block font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {followStats.followers}
                          </span>
                          <span className="text-xs text-gray-500">Followers</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={openFollowing}
                      className="text-center hover:opacity-80 transition-opacity group relative"
                      disabled={loadingModal}
                    >
                      {loadingModal && showFollowing ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 size={16} className="animate-spin text-blue-600" />
                        </div>
                      ) : (
                        <>
                          <span className="block font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {followStats.following}
                          </span>
                          <span className="text-xs text-gray-500">Following</span>
                        </>
                      )}
                    </button>
                  </div>

                  {!isOwnProfile && (
                    <div className="flex gap-2 mt-4 w-full">
                      <button
                        onClick={handleFollow}
                        disabled={followLoading}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          followStats.isFollowing
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
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
                      
                      <button className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <MessageCircle size={16} />
                        Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* About Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                About
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                {profile.bio || "No bio added yet."}
              </p>
            </motion.div>

            {/* Skills Section */}
            {profile.skills?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                  <Award size={16} className="text-blue-600" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <Mail size={16} className="text-blue-600" />
                Contact Info
              </h3>
              <div className="space-y-3">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors group p-2 -mx-2 rounded-lg hover:bg-gray-50"
                  >
                    <Github size={18} className="text-gray-500 group-hover:text-blue-600" />
                    <span className="flex-1">GitHub</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors group p-2 -mx-2 rounded-lg hover:bg-gray-50"
                  >
                    <Linkedin size={18} className="text-gray-500 group-hover:text-blue-600" />
                    <span className="flex-1">LinkedIn</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {profile.portfolio && (
                  <a
                    href={profile.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 transition-colors group p-2 -mx-2 rounded-lg hover:bg-gray-50"
                  >
                    <Globe size={18} className="text-gray-500 group-hover:text-blue-600" />
                    <span className="flex-1">Portfolio</span>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {!profile.github && !profile.linkedin && !profile.portfolio && (
                  <p className="text-gray-400 text-sm italic">No contact information added.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-8 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="border-b border-gray-200 px-6">
                <nav className="flex space-x-8">
                  {["about", "experience", "education"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 text-sm font-medium border-b-2 transition-all relative ${
                        activeTab === tab
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "about" && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-base">
                            <Briefcase size={18} className="text-blue-600" />
                            Experience
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {profile.experience || (
                                <span className="text-gray-400 italic">No experience added yet.</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-base">
                            <GraduationCap size={18} className="text-blue-600" />
                            Education
                          </h3>
                          <div className="space-y-4">
                            {(profile.education || profile.college) ? (
                              <div className="bg-gray-50 rounded-lg p-4">
                                {profile.education && (
                                  <p className="font-medium text-gray-900">{profile.education}</p>
                                )}
                                {profile.college && (
                                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                    <Building size={14} className="text-gray-400" />
                                    {profile.college}
                                  </div>
                                )}
                                {profile.batchName && (
                                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                    <Calendar size={12} className="text-gray-400" />
                                    Class of {profile.batchName}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-sm italic bg-gray-50 rounded-lg p-4">
                                No education details added.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "experience" && (
                      <div className="py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Briefcase className="text-blue-600" size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Experience</h4>
                            <div className="mt-3 bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {profile.experience || "No experience details added yet."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "education" && (
                      <div className="py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <GraduationCap className="text-blue-600" size={24} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Education</h4>
                            <div className="mt-3 bg-gray-50 rounded-lg p-4">
                              {profile.education && (
                                <p className="text-sm text-gray-600">{profile.education}</p>
                              )}
                              {profile.college && (
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                  <Building size={14} className="text-gray-400" />
                                  {profile.college}
                                </div>
                              )}
                              {profile.batchName && (
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                  <Calendar size={12} className="text-gray-400" />
                                  Batch of {profile.batchName}
                                </div>
                              )}
                              {!profile.education && !profile.college && (
                                <p className="text-gray-400 text-sm italic">
                                  No education details added yet.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Activity Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                <Calendar size={16} className="text-blue-600" />
                Activity
              </h3>
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Users size={40} className="mb-3 text-gray-300" />
                <p className="text-sm">No recent activity to show</p>
                <p className="text-xs text-gray-400 mt-1">Check back later for updates</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Follow Modals with Loading State */}
      <AnimatePresence>
        {showFollowers && (
          <FollowListModal
            title="Followers"
            users={followersList}
            onClose={() => setShowFollowers(false)}
            onOpenProfile={(id) => {
              setShowFollowers(false);
              if (id === userId) return;
              navigate(`/profile/${id}`);
            }}
            loading={loadingModal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFollowing && (
          <FollowListModal
            title="Following"
            users={followingList}
            onClose={() => setShowFollowing(false)}
            onOpenProfile={(id) => {
              setShowFollowing(false);
              if (id === userId) return;
              navigate(`/profile/${id}`);
            }}
            loading={loadingModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicProfilePage;