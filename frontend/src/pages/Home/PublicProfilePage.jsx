import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { 
  MapPin, GraduationCap, Link as LinkIcon, Github, Linkedin, 
  Briefcase, UserPlus, UserMinus, CheckCircle2, Award, 
  ExternalLink, Mail
} from "lucide-react";

import Loading from "../../components/Loading";
import { getProfileById } from "../../services/profile.service";
import { getFollowStats, toggleFollow } from "../../services/follow.service";
import { useAuth } from "../../context/AuthContext";

const ProfileSection = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
    <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-3">
      <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
        <Icon size={20} />
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0, isFollowing: false });
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState("");

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

  const renderValue = (val, placeholder = "Not updated") => 
    val ? val : <span className="text-gray-300 italic font-normal">{placeholder}</span>;

  if (loading) return <Loading />;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500 font-bold">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-5 sm:p-10 space-y-8 animate-in fade-in duration-500">
      
      <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <img
              src={profile.avatarUrl || "/avatar-placeholder.png"}
              className="w-32 h-32 rounded-3xl object-cover ring-4 ring-blue-50 shadow-xl"
              alt="Profile"
            />
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-lg">
               <CheckCircle2 size={24} className="text-blue-500 fill-blue-50" />
            </div>
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {profile.userId.firstName} {profile.userId.lastName}
              </h1>
              <p className="text-blue-600 font-semibold text-lg">{renderValue(profile.headline, "Full Stack Developer")}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-2">
                <MapPin size={16} />
                <span className="text-sm">{renderValue(profile.location)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="font-bold text-gray-900">{followStats.followers}</span>
                <span className="text-gray-500 text-sm ml-1">Followers</span>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                <span className="font-bold text-gray-900">{followStats.following}</span>
                <span className="text-gray-500 text-sm ml-1">Following</span>
              </div>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`w-full md:w-auto px-10 py-3 rounded-2xl font-bold transition-all transform active:scale-95 ${
                followStats.isFollowing
                  ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
              }`}
            >
              {followStats.isFollowing ? "Unfollow" : "Follow User"}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-8">
          <ProfileSection title="Connect" icon={LinkIcon}>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600 group">
                <Github size={18} className="group-hover:text-black" />
                {profile.github ? (
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-sm hover:underline hover:text-blue-600 transition">GitHub Profile</a>
                ) : renderValue(null)}
              </div>
              <div className="flex items-center gap-3 text-gray-600 group">
                <Linkedin size={18} className="group-hover:text-blue-700" />
                {profile.linkedin ? (
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-sm hover:underline hover:text-blue-600 transition">LinkedIn Profile</a>
                ) : renderValue(null)}
              </div>
            </div>
          </ProfileSection>

          <ProfileSection title="Tech Stack" icon={Award}>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, i) => (
                  <span key={i} className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold border border-blue-100">
                    {skill}
                  </span>
                ))
              ) : renderValue(null, "No skills added")}
            </div>
          </ProfileSection>
        </div>
        <div className="lg:col-span-8 space-y-8">
          <ProfileSection title="About Me" icon={Briefcase}>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {renderValue(profile.bio, "This user hasn't written a biography yet.")}
            </p>
          </ProfileSection>

          <ProfileSection title="Background" icon={GraduationCap}>
            <div className="relative pl-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500 before:rounded-full">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{renderValue(profile.education, "Degree Info")}</h4>
                  <p className="text-gray-500">{renderValue(profile.college, "Institution Name")}</p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                  Class of {profile.batchName || "N/A"}
                </div>
              </div>
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;