import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  MapPin, 
  GraduationCap, 
  Link as LinkIcon, 
  Github, 
  Linkedin, 
  Globe, 
  Briefcase, 
  UserPlus, 
  UserMinus,
  CheckCircle2,
  Award,
  CircleOff
} from "lucide-react";

import Loading from "../../components/Loading";
import { getProfileById } from "../../services/profile.service";
import { getFollowStats, toggleFollow } from "../../services/follow.service";
import { useAuth } from "../../context/AuthContext";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
    isFollowing: false,
  });

  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const profileRes = await getProfileById(userId);
        setProfile(profileRes.data.data);

        const statsRes = await getFollowStats(userId);
        const stats = statsRes.data?.data || {};

        setFollowStats({
          followers: stats.followers || 0,
          following: stats.following || 0,
          isFollowing: stats.isFollowing || false,
        });
      } catch (err) {
        setError(err.response?.status === 404 ? "Profile not found" : "Loading error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  const handleFollow = async () => {
    if (followLoading) return;
    try {
      setFollowLoading(true);
      setFollowStats(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
      }));
      const res = await toggleFollow(userId);
      const data = res.data?.data || {};
      setFollowStats(prev => ({
        ...prev,
        isFollowing: Boolean(data.isFollowing),
        followers: data.followers ?? prev.followers,
        following: data.following ?? prev.following,
      }));
    } catch {
      setFollowStats(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        followers: prev.isFollowing ? prev.followers + 1 : prev.followers - 1,
      }));
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* HEADER SECTION (NO BANNER) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={profile.avatarUrl || "/avatar-placeholder.png"}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-100 shadow-sm"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
              {profile.userId.firstName} {profile.userId.lastName}
              <CheckCircle2 size={18} className="text-blue-500" />
            </h1>
            <p className="text-gray-600 font-medium">
              {profile.headline || <span className="text-gray-400 italic font-normal text-sm">Headline not updated</span>}
            </p>
            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-500">
                <MapPin size={14} /> {profile.location || <span className="text-gray-300 italic">Not updated</span>}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-gray-700 font-bold">{followStats.followers} <span className="font-normal text-gray-500">Followers</span></span>
              <span className="text-gray-700 font-bold">{followStats.following} <span className="font-normal text-gray-500">Following</span></span>
            </div>
          </div>
          
          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-8 py-2 rounded-full font-bold transition-all ${
                followStats.isFollowing
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              }`}
            >
              {followStats.isFollowing ? <><UserMinus size={18} className="inline mr-2"/>Following</> : <><UserPlus size={18} className="inline mr-2"/>Follow</>}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SIDEBAR: LINKS & SKILLS */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <LinkIcon size={16} className="text-blue-500" /> Professional Links
            </h3>
            <div className="space-y-3">
              {profile.github ? (
                <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600">
                  <Github size={18} /> GitHub
                </a>
              ) : <div className="flex items-center gap-3 text-sm text-gray-300"><Github size={18}/> Not updated</div>}
              
              {profile.linkedin ? (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600">
                  <Linkedin size={18} /> LinkedIn
                </a>
              ) : <div className="flex items-center gap-3 text-sm text-gray-300"><Linkedin size={18}/> Not updated</div>}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={16} className="text-purple-500" /> Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills?.length > 0 ? (
                profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-300 italic flex items-center gap-1"><CircleOff size={12}/> No skills listed</p>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT: ABOUT & EDUCATION */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-500" /> About
            </h3>
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {profile.bio || <span className="text-gray-400 italic">No biography provided yet.</span>}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap size={22} className="text-blue-500" /> Education
            </h3>
            <div className="space-y-4">
              <div className="pl-4 border-l-2 border-blue-50 py-1">
                <p className="font-bold text-gray-900">
                  {profile.education || <span className="text-gray-300 italic font-normal">Degree not updated</span>}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {profile.college || <span className="text-gray-300 italic">College/University not updated</span>}
                </p>
                <div className="mt-2 inline-block px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wide">
                  {profile.batchName || "Batch not specified"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;