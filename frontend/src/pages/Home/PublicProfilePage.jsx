import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

  /* ---------- LOAD PROFILE + FOLLOW STATS ---------- */

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
        if (err.response?.status === 404) {
          setError("This profile is private or does not exist");
        } else {
          setError("Something went wrong while loading profile");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  /* ---------- FOLLOW / UNFOLLOW ---------- */
const handleFollow = async () => {
  if (followLoading) return;

  try {
    setFollowLoading(true);

    // Optimistic update (instant UI)
    setFollowStats(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing
        ? prev.followers - 1
        : prev.followers + 1,
    }));

    const res = await toggleFollow(userId);
    const data = res.data?.data || {};

    // Normalize backend response
    setFollowStats(prev => ({
      ...prev,
      isFollowing: Boolean(data.isFollowing),
      followers: Number(
        data.followers ?? data.followersCount ?? prev.followers
      ),
      following: Number(
        data.following ?? data.followingCount ?? prev.following
      ),
    }));

  } catch (err) {
    console.error("Follow failed", err);

    // rollback on error
    setFollowStats(prev => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing
        ? prev.followers + 1
        : prev.followers - 1,
    }));
  } finally {
    setFollowLoading(false);
  }
};


  /* ---------- UI STATES ---------- */

  if (loading) return <Loading />;

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center mt-10 text-gray-500">Profile not available</div>;
  }

  /* ---------- UI ---------- */

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="bg-white shadow rounded-lg p-6 space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-5">
            <img
              src={profile.avatarUrl || "/avatar-placeholder.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />

            <div>
              <h1 className="text-2xl font-semibold">
                {profile.userId.firstName} {profile.userId.lastName}
              </h1>

              {profile.headline && (
                <p className="text-gray-600 mt-1">{profile.headline}</p>
              )}

              {profile.location && (
                <p className="text-sm text-gray-500 mt-1">📍 {profile.location}</p>
              )}
            </div>
          </div>

          {/* ===== FOLLOW BUTTON ===== */}
          {!isOwnProfile && (
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-6 py-2 rounded text-white transition ${
                followStats.isFollowing
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {followLoading
                ? "Please wait..."
                : followStats.isFollowing
                ? "Following"
                : "Follow"}
            </button>
          )}
        </div>

        {/* ===== STATS ===== */}
        <div className="flex gap-6 text-sm text-gray-700">
          <p>
            <strong>{followStats.followers}</strong> Followers
          </p>
          <p>
            <strong>{followStats.following}</strong> Following
          </p>
        </div>

        {/* ===== BIO ===== */}
        {profile.bio && (
          <section>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-700">{profile.bio}</p>
          </section>
        )}

        {/* ===== SKILLS ===== */}
        {profile.skills?.length > 0 && (
          <section>
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ===== EDUCATION ===== */}
        {(profile.education || profile.college || profile.batchName) && (
          <section>
            <h3 className="font-semibold mb-2">Education</h3>
            <div className="text-gray-700 space-y-1">
              {profile.education && <p>🎓 {profile.education}</p>}
              {profile.college && <p>🏫 {profile.college}</p>}
              {profile.batchName && <p>📘 Batch: {profile.batchName}</p>}
            </div>
          </section>
        )}

        {/* ===== LINKS ===== */}
        {(profile.github || profile.linkedin || profile.portfolio) && (
          <section>
            <h3 className="font-semibold mb-2">Links</h3>
            <div className="flex flex-wrap gap-4">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  LinkedIn
                </a>
              )}
              {profile.portfolio && (
                <a href={profile.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  Portfolio
                </a>
              )}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default PublicProfilePage;
