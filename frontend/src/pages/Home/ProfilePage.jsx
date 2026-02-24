import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, Github, Linkedin, Mail, MapPin, Briefcase, 
  GraduationCap, Award, Calendar, ExternalLink, 
  Folder, GitBranch, Star, Users, BookOpen,
  Edit3, Camera, Check, X, Save, Clock, Heart,
  Twitter, Globe, MessageCircle, UserPlus,
  Terminal, Cpu, Coffee, Zap, Lock, Sparkles
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import useInputText from "../../Hooks/InputHooks";
import InputText from "../../common/InputText";
import FollowListModal from "../../components/FollowListModal";
import EditProfileLayout from "../../layouts/EditProfileLayout";

import {
  getMyProfile,
  updateProfile,
  uploadAvatar,
  getProfileById,
  toggleVisibility,
} from "../../services/profile.service";

import {
  toggleFollow,
  getFollowStats,
  getFollowers,
  getFollowing,
} from "../../services/follow.service";

// Skill Tag Component
const SkillTag = ({ skill, level }) => (
  <div className="group relative">
    <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-default">
      {skill}
    </span>
    {level && (
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {level}
      </div>
    )}
  </div>
);

// Interest Tag Component
const InterestTag = ({ interest }) => (
  <span className="inline-block px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition-colors cursor-default">
    {interest}
  </span>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
        <Icon size={18} className="text-blue-600" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
    {trend && (
      <p className="text-xs text-green-600 flex items-center gap-1">
        <Zap size={12} />
        {trend}
      </p>
    )}
  </div>
);

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

  const profileUserId = userId || user?.id;
  const isMyProfile = profileUserId === user?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [profileOwner, setProfileOwner] = useState(null);

  const { formData, onChange, setFormData } = useInputText({
    headline: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    portfolio: "",
    education: "",
    college: "",
    batchName: "",
    location: "",
    isProfilePublic: true,
    avatarUrl: "",
    twitter: "",
    website: "",
    experience: "",
    company: "",
    role: "",
    techStack: "",
    interests: "",
  });

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState("");
  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
    isFollowing: false,
  });

  // Modal states with loading
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    if (!profileUserId) return;

    const loadProfile = async () => {
      try {
        let res;
        if (isMyProfile) {
          res = await getMyProfile(profileUserId);
        } else {
          res = await getProfileById(profileUserId);
        }
        
        const p = res.data.data;
        setProfileOwner(p.user || p.userId);

        setFormData({
          headline: p.headline || "",
          bio: p.bio || "",
          skills: Array.isArray(p.skills) ? p.skills.join(", ") : p.skills || "",
          github: p.github || "",
          linkedin: p.linkedin || "",
          portfolio: p.portfolio || "",
          education: p.education || "",
          college: p.college || "",
          batchName: p.batchName || "",
          location: p.location || "",
          isProfilePublic: p.isProfilePublic ?? true,
          avatarUrl: p.avatarUrl || "",
          twitter: p.twitter || "",
          website: p.website || "",
          experience: p.experience || "",
          company: p.company || "",
          role: p.role || "",
          techStack: Array.isArray(p.techStack) ? p.techStack.join(", ") : p.techStack || "",
          interests: Array.isArray(p.interests) ? p.interests.join(", ") : p.interests || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        setMessage("Failed to load profile");
      }
    };

    loadProfile();
  }, [profileUserId, isMyProfile, setFormData]);

  useEffect(() => {
    if (!profileUserId) return;

    const loadStats = async () => {
      try {
        const res = await getFollowStats(profileUserId);
        setFollowStats(res.data.data);
      } catch (error) {
        console.error("Error loading follow stats:", error);
      }
    };

    loadStats();
  }, [profileUserId]);

  const handleFollow = async () => {
    try {
      const res = await toggleFollow(profileUserId);
      const followed = res.data.followed;

      setFollowStats(prev => ({
        ...prev,
        isFollowing: followed,
        followers: followed ? prev.followers + 1 : Math.max(prev.followers - 1, 0),
      }));
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  // Updated modal handlers with loading states
  const openFollowers = async () => {
    try {
      setLoadingModal(true);
      setShowFollowers(true);
      const res = await getFollowers(profileUserId);
      setFollowersList(res.data.data || []);
    } catch (error) {
      console.error("Error fetching followers:", error);
      setMessage("Failed to load followers");
    } finally {
      setLoadingModal(false);
    }
  };

  const openFollowing = async () => {
    try {
      setLoadingModal(true);
      setShowFollowing(true);
      const res = await getFollowing(profileUserId);
      setFollowingList(res.data.data || []);
    } catch (error) {
      console.error("Error fetching following:", error);
      setMessage("Failed to load following");
    } finally {
      setLoadingModal(false);
    }
  };

  const handleAvatarUpload = async e => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploadingAvatar(true);
    try {
      const res = await uploadAvatar(file);
      setFormData(p => ({ ...p, avatarUrl: res.data.data.avatarUrl }));
      setMessage("Avatar updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setMessage("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile({
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        techStack: formData.techStack.split(",").map(t => t.trim()).filter(Boolean),
        interests: formData.interests.split(",").map(i => i.trim()).filter(Boolean),
      });
      setMessage("Profile updated successfully");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const res = await toggleVisibility();
      setFormData(p => ({ ...p, isProfilePublic: res.data.data.isProfilePublic }));
      setMessage(`Profile is now ${res.data.data.isProfilePublic ? 'public' : 'private'}`);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error toggling visibility:", error);
      setMessage("Failed to toggle visibility");
    }
  };

  const getInitials = () => {
    if (profileOwner?.firstName && profileOwner?.lastName) {
      return `${profileOwner.firstName[0]}${profileOwner.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (profileOwner?.firstName && profileOwner?.lastName) {
      return `${profileOwner.firstName} ${profileOwner.lastName}`;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return "User";
  };

  const renderSkills = () => {
    const skills = formData.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const techStack = formData.techStack?.split(',').map(t => t.trim()).filter(Boolean) || [];
    const allSkills = [...new Set([...skills, ...techStack])];
    
    if (allSkills.length === 0) {
      return <p className="text-gray-400">No skills added</p>;
    }
    
    return allSkills.map((skill, i) => (
      <SkillTag key={i} skill={skill} level="Expert" />
    ));
  };

  const renderInterests = () => {
    const interests = formData.interests?.split(',').map(i => i.trim()).filter(Boolean) || [];
    if (interests.length === 0) return null;
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-purple-600" />
          Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, i) => (
            <InterestTag key={i} interest={interest} />
          ))}
        </div>
      </div>
    );
  };

  const sections = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "skills", label: "Skills", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
  ];

  if (loading) {
    return (
      <EditProfileLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
            <Terminal className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600" size={20} />
          </div>
        </div>
      </EditProfileLayout>
    );
  }

  return (
    <EditProfileLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl border-4 border-gray-100 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                      {getInitials()}
                    </div>
                  )}
                </div>
                {isMyProfile && (
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                    {uploadingAvatar ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Camera size={14} className="text-white" />
                    )}
                    <input hidden type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                  </label>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    {getDisplayName()}
                  </h1>
                  <p className="text-lg text-gray-600">{formData.headline || "Developer"}</p>
                  {formData.company && formData.role && (
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.role} at {formData.company}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isMyProfile ? (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                          followStats.isFollowing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {followStats.isFollowing ? <Check size={18} /> : <UserPlus size={18} />}
                        {followStats.isFollowing ? 'Following' : 'Follow'}
                      </button>
                      <button className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Mail size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <Edit3 size={18} />
                        Edit Profile
                      </button>
                      <button
                        onClick={handleToggleVisibility}
                        className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                          formData.isProfilePublic
                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={formData.isProfilePublic ? "Profile is public" : "Profile is private"}
                      >
                        {formData.isProfilePublic ? <Globe size={18} /> : <Lock size={18} />}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Location & Links */}
              <div className="flex flex-wrap gap-4 mb-4">
                {formData.location && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} />
                    {formData.location}
                  </span>
                )}
                {formData.github && (
                  <a href={formData.github} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    <Github size={14} />
                    GitHub
                  </a>
                )}
                {formData.linkedin && (
                  <a href={formData.linkedin} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    <Linkedin size={14} />
                    LinkedIn
                  </a>
                )}
                {formData.twitter && (
                  <a href={formData.twitter} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    <Twitter size={14} />
                    Twitter
                  </a>
                )}
                {formData.portfolio && (
                  <a href={formData.portfolio} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    <Globe size={14} />
                    Portfolio
                  </a>
                )}
                {formData.website && (
                  <a href={formData.website} target="_blank" rel="noopener noreferrer"
                     className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
                    <ExternalLink size={14} />
                    Website
                  </a>
                )}
              </div>

              {/* Stats with loading states */}
              <div className="flex gap-6">
                <button 
                  onClick={openFollowers} 
                  className="flex items-center gap-2 group relative min-w-[80px]"
                  disabled={loadingModal}
                >
                  {loadingModal && showFollowers ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {followStats.followers}
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                        Followers
                      </span>
                    </>
                  )}
                </button>
                <button 
                  onClick={openFollowing} 
                  className="flex items-center gap-2 group relative min-w-[80px]"
                  disabled={loadingModal}
                >
                  {loadingModal && showFollowing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {followStats.following}
                      </span>
                      <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors">
                        Following
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Bio */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {formData.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Tech Stack & Skills */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {renderSkills()}
                    </div>
                  </div>

                  {/* Interests */}
                  {renderInterests()}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === "skills" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {renderSkills()}
                  </div>
                </div>
                {renderInterests()}
              </div>
            )}

            {/* Experience Section */}
            {activeSection === "experience" && (
              <div className="space-y-6">
                {(formData.experience || formData.company) && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Work Experience</h3>
                    {formData.company && (
                      <div className="mb-3">
                        <p className="font-medium text-gray-900">{formData.role || "Developer"}</p>
                        <p className="text-sm text-gray-600">{formData.company}</p>
                      </div>
                    )}
                    {formData.experience && (
                      <p className="text-sm text-gray-600">{formData.experience}</p>
                    )}
                  </div>
                )}

                {(formData.education || formData.college) && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                    {formData.education && (
                      <p className="font-medium text-gray-900">{formData.education}</p>
                    )}
                    {formData.college && (
                      <p className="text-sm text-gray-600 mt-1">{formData.college}</p>
                    )}
                    {formData.batchName && (
                      <p className="text-xs text-gray-400 mt-2">Class of {formData.batchName}</p>
                    )}
                  </div>
                )}

                {!formData.experience && !formData.company && !formData.education && !formData.college && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <p className="text-gray-400">No experience or education details added yet.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Message Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
                message.includes('Failed') ? 'bg-red-500' : 'bg-green-500'
              } text-white`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b p-6">
                <h2 className="text-xl font-bold">Edit Profile</h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <InputText name="headline" label="Headline" value={formData.headline} onChange={onChange} />
                <InputText name="bio" label="Bio" value={formData.bio} onChange={onChange} multiline rows={4} />
                <InputText name="company" label="Company" value={formData.company} onChange={onChange} />
                <InputText name="role" label="Role" value={formData.role} onChange={onChange} />
                <InputText name="skills" label="Skills (comma separated)" value={formData.skills} onChange={onChange} />
                <InputText name="techStack" label="Tech Stack (comma separated)" value={formData.techStack} onChange={onChange} />
                <InputText name="interests" label="Interests (comma separated)" value={formData.interests} onChange={onChange} />
                <InputText name="experience" label="Experience" value={formData.experience} onChange={onChange} multiline rows={3} />
                <InputText name="education" label="Education" value={formData.education} onChange={onChange} />
                <InputText name="college" label="College" value={formData.college} onChange={onChange} />
                <InputText name="batchName" label="Batch Year" value={formData.batchName} onChange={onChange} />
                <InputText name="location" label="Location" value={formData.location} onChange={onChange} />
                
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="font-medium mb-3">Social Links</h3>
                  <div className="space-y-3">
                    <InputText name="github" label="GitHub" value={formData.github} onChange={onChange} />
                    <InputText name="linkedin" label="LinkedIn" value={formData.linkedin} onChange={onChange} />
                    <InputText name="twitter" label="Twitter" value={formData.twitter} onChange={onChange} />
                    <InputText name="portfolio" label="Portfolio" value={formData.portfolio} onChange={onChange} />
                    <InputText name="website" label="Website" value={formData.website} onChange={onChange} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Follow Modals with Loading Prop */}
      <AnimatePresence>
        {showFollowers && (
          <FollowListModal
            title="Followers"
            users={followersList}
            onClose={() => setShowFollowers(false)}
            onOpenProfile={id => navigate(`/profile/${id}`)}
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
            onOpenProfile={id => navigate(`/profile/${id}`)}
            loading={loadingModal}
          />
        )}
      </AnimatePresence>
    </EditProfileLayout>
  );
};

export default ProfilePage;