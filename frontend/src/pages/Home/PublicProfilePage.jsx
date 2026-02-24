import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, GraduationCap, Link as LinkIcon, Github, Linkedin, 
  Briefcase, UserPlus, Check, MessageCircle, MoreHorizontal,
  Award, ExternalLink, Users, Calendar, ArrowLeft, Mail,
  Building, Globe, ChevronRight, Loader2, Heart, MessageSquare,
  Share2, Clock, Image, Video
} from "lucide-react";

import Loading from "../../components/Loading";
import { getProfileById } from "../../services/profile.service";
import { getFollowStats, toggleFollow, getFollowers, getFollowing } from "../../services/follow.service";
import { useAuth } from "../../context/AuthContext";
import FollowListModal from "../../components/FollowListModal";
import { getUserPosts, likePost, deletePost, updatePost } from "../../services/post.service";
import { addComment, getComments } from "../../services/comment.service";

// Import the same components used in FeedPage
import PostCard from "../posts/FeedPageComponents/PostCard";
import useComments from "../posts/FeedPageComponents/hooks/useComments";
import usePostActions from "../posts/FeedPageComponents/hooks/usePostActions";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0, isFollowing: false });
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Following state for post authors
  const [followingMap, setFollowingMap] = useState({});
  
  // Use the same hooks from FeedPage
  const { 
    openComments, 
    comments, 
    commentText, 
    loadingComments,
    toggleComments,
    handleAddComment,
    setCommentText
  } = useComments();

  const {
    editingPost,
    editText,
    menuOpen,
    setMenuOpen,
    setEditingPost,
    setEditText,
    handleLike,
    handleFollow: handlePostFollow,
    startEdit,
    saveEdit,
    handleDelete
  } = usePostActions({ posts, setPosts, followingMap, setFollowingMap, user });

  // Modal states
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  const isOwnProfile = user?.id === userId;

const loadUserPosts = useCallback(async () => {
  if (!userId) return;
  
  try {
    setPostsLoading(true);
    const response = await getUserPosts(userId);
    console.log("Posts response:", response.data);
    
    const transformedPosts = (response.data.data || []).map(post => {
      
      // Get the author's avatar URL
      const authorAvatarUrl = post.author?.avatarUrl || null;
      
      // ✅ DON'T transform likes - they already have avatarUrl from the controller!
      // Just use them as-is
      const likes = post.likes || [];
      
      console.log("Likes from API:", likes); // Should show objects with avatarUrl
      
      return {
        ...post,
        _id: post._id,
        text: post.text || '',
        media: post.media || null,
        postType: post.postType || 'text',
        createdAt: post.createdAt,
        author: {
          _id: post.author?._id || userId,
          firstName: post.author?.firstName || 'User',
          lastName: post.author?.lastName || '',
          title: post.authorProfile?.headline || profile?.headline || ''
        },
        authorProfile: {
          avatarUrl: authorAvatarUrl
        },
        // Use the likes directly from the API
        likes: likes,
        commentsCount: post.commentsCount || 0,
        isPublic: post.isPublic !== false,
        isNew: false
      };
    });
    
    console.log("Final transformed posts:", transformedPosts);
    setPosts(transformedPosts);
    
  } catch (err) {
    console.error("Error loading user posts:", err);
    setPosts([]);
  } finally {
    setPostsLoading(false);
  }
}, [userId, profile, user?.id]);

  // Load follow status for post authors
  useEffect(() => {
    const loadFollowStatuses = async () => {
      if (!posts.length || !user?.id) return;
      
      const uniqueAuthorIds = [...new Set(posts
        .map(post => post.author?._id)
        .filter(id => id && id !== user?.id))];
      
      const followStatuses = {};
      await Promise.all(
        uniqueAuthorIds.map(async (authorId) => {
          try {
            const statsRes = await getFollowStats(authorId);
            if (statsRes.data?.data) {
              followStatuses[authorId] = statsRes.data.data.isFollowing || false;
            }
          } catch (err) {
            console.error(`Error checking follow status for ${authorId}:`, err);
          }
        })
      );
      
      setFollowingMap(followStatuses);
    };

    loadFollowStatuses();
  }, [posts, user?.id]);

  // Load profile data
  const loadProfileData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        getProfileById(userId),
        getFollowStats(userId)
      ]);
      
      console.log("Profile data:", profileRes.data);
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

  // Load all data on mount or userId change
  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId, loadProfileData]);

  // Load posts separately when profile is available
  useEffect(() => {
    if (userId && profile) {
      loadUserPosts();
    }
  }, [userId, profile, loadUserPosts]);

  // Profile follow handler
  const handleProfileFollow = async () => {
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
      
      if (res.data.success && res.data.data) {
        const { isFollowing, followersCount } = res.data.data;
        
        setFollowStats(prev => ({
          ...prev,
          isFollowing: isFollowing,
          followers: followersCount,
        }));
        
        // Update followingMap for this user
        setFollowingMap(prev => ({
          ...prev,
          [userId]: isFollowing
        }));
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
      setFollowStats(originalStats);
      
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to update follow status. Please try again.");
      }
    } finally {
      setFollowLoading(false);
    }
  };

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
                    {profile?.userId?.firstName} {profile?.userId?.lastName}
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {profile?.headline || "Professional"}
                  </p>
                  
                  {profile?.location && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                      <MapPin size={12} />
                      {profile.location}
                    </p>
                  )}

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

                  <div className="mt-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-900">{posts.length}</span> posts
                  </div>

                  {!isOwnProfile && (
                    <div className="flex gap-2 mt-4 w-full">
                      <button
                        onClick={handleProfileFollow}
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
                {profile?.bio || "No bio added yet."}
              </p>
            </motion.div>

            {/* Skills Section */}
            {profile?.skills?.length > 0 && (
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
                {profile?.github && (
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
                {profile?.linkedin && (
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
                {profile?.portfolio && (
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
                {!profile?.github && !profile?.linkedin && !profile?.portfolio && (
                  <p className="text-gray-400 text-sm italic">No contact information added.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-8 space-y-4">
            {/* Experience Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <Briefcase size={16} className="text-blue-600" />
                Experience
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {profile?.experience || (
                    <span className="text-gray-400 italic">No experience added yet.</span>
                  )}
                </p>
              </div>
            </motion.div>

            {/* Education Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                <GraduationCap size={16} className="text-blue-600" />
                Education
              </h3>
              <div className="space-y-4">
                {(profile?.education || profile?.college) ? (
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
            </motion.div>

            {/* Posts Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-1">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
                  <MessageSquare size={16} className="text-blue-600" />
                  Posts
                </h3>
                {posts.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                  </span>
                )}
              </div>
              
              {postsLoading ? (
                <div className="flex justify-center py-12 bg-white rounded-xl border border-gray-200">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
{posts.map((post, index) => {
  console.log("Post being sent to PostCard:", {
    id: post._id,
    author: post.author,
    avatarUrl: post.author?.avatarUrl
  });
  
  return (
    <PostCard
      key={post._id}
      post={post}
      index={index}
      user={user}
      isOwner={user?.id === post.author?._id}
      hasLiked={post.likes?.some(like => like._id === user?.id) || false}
      followingMap={followingMap}
      menuOpen={menuOpen}
      editingPost={editingPost}
      editText={editText}
      openComments={openComments}
      comments={comments}
      commentText={commentText}
      loadingComments={loadingComments}
      onMenuToggle={setMenuOpen}
      onLike={handleLike}
      onFollow={handlePostFollow}
      onEditStart={startEdit}
      onEditSave={saveEdit}
      onEditCancel={() => setEditingPost(null)}
      onEditChange={setEditText}
      onDelete={handleDelete}
      onToggleComments={toggleComments}
      onAddComment={handleAddComment}
      onCommentChange={setCommentText}
    />
  );
})}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-xl border border-gray-200">
                  <MessageSquare size={40} className="mb-3 text-gray-300" />
                  <p className="text-sm">No posts yet</p>
                  {isOwnProfile && (
                    <p className="text-xs text-gray-400 mt-1">
                      Create your first post to share with the community
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Follow Modals */}
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