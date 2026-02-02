import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfileById } from "../../services/profile.service";
import Loading from "../../components/Loading";

const PublicProfilePage = () => {
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError("");

    getProfileById(userId)
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setError("This profile is private or does not exist");
        } else {
          setError("Something went wrong while loading the profile");
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Profile not available
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        
        {/* ===== HEADER ===== */}
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
              <p className="text-gray-600 mt-1">
                {profile.headline}
              </p>
            )}

            {profile.location && (
              <p className="text-sm text-gray-500 mt-1">
                📍 {profile.location}
              </p>
            )}
          </div>
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
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 rounded text-sm"
                >
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
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  GitHub
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  LinkedIn
                </a>
              )}
              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
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
