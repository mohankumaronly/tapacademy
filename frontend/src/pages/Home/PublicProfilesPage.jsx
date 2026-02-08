import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../components/Loading";
import { getPublicProfiles } from "../../services/profile.service";
import { toggleFollow, getFollowStats } from "../../services/follow.service";
import { useAuth } from "../../context/AuthContext";

const PublicProfilesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [followMap, setFollowMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const res = await getPublicProfiles();
        const list = res.data.data;

        setProfiles(list);

        const map = {};

        await Promise.all(
          list.map(async p => {
            const stats = await getFollowStats(p.userId._id);
            map[p.userId._id] = stats.data.data.isFollowing;
          })
        );

        setFollowMap(map);
      } catch {
        setError("Failed to load public profiles");
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, []);


  const handleFollow = async (e, userId) => {
    e.stopPropagation();

    try {
      const res = await toggleFollow(userId);
      const followed = res.data.followed;

      setFollowMap(prev => ({
        ...prev,
        [userId]: followed,
      }));
    } catch (err) {
      console.error("Follow failed", err);
    }
  };


  if (loading) return <Loading />;

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (!profiles.length) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No public profiles available
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-semibold mb-6 text-center">
        Explore Profiles
      </h1>

      <div className="space-y-4">
        {profiles.map(profile => {
          const profileId = profile.userId._id;
          const isMyProfile = profileId === user?.id;
          const isFollowing = followMap[profileId];

          return (
            <div
              key={profile._id}
              onClick={() => navigate(`/profile/${profileId}`)}
              className="flex items-center justify-between bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
            >

              <div className="flex items-center gap-4">
                <img
                  src={profile.avatarUrl || "/avatar-placeholder.png"}
                  className="w-14 h-14 rounded-full object-cover border"
                />

                <div>
                  <h3 className="font-medium text-lg">
                    {profile.userId.firstName} {profile.userId.lastName}
                  </h3>

                  {profile.headline && (
                    <p className="text-sm text-gray-600">
                      {profile.headline}
                    </p>
                  )}
                </div>
              </div>

              {!isMyProfile && (
                <button
                  onClick={e => handleFollow(e, profileId)}
                  className={`px-4 py-1.5 rounded text-sm font-medium transition ${
                    isFollowing
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicProfilesPage;