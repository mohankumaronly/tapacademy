import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicProfiles } from "../../services/profile.service";
import Loading from "../../components/Loading";

const PublicProfilesPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getPublicProfiles()
      .then((res) => {
        setProfiles(res.data.data);
      })
      .catch(() => {
        setError("Failed to load public profiles");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );
  }

  if (profiles.length === 0) {
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
        {profiles.map((profile) => (
          <div
            key={profile._id}
            onClick={() => navigate(`/profile/${profile.userId._id}`)}
            className="flex items-center justify-between bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition"
          >
            
            <div className="flex items-center gap-4">
              <img
                src={profile.avatarUrl || "/avatar-placeholder.png"}
                alt="avatar"
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

            <div className="text-sm text-blue-600 font-medium">
              View profile →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicProfilesPage;
