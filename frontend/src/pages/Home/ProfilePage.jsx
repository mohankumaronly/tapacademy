import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import useInputText from "../../Hooks/InputHooks";
import InputText from "../../common/InputText";
import ProfileLayout from "../../layouts/ProfileLayout";
import FollowListModal from "../../components/FollowListModal";

import {
  getMyProfile,
  updateProfile,
  uploadAvatar,
} from "../../services/profile.service";

import {
  toggleFollow,
  getFollowStats,
  getFollowers,
  getFollowing,
} from "../../services/follow.service";

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

  const profileUserId = userId || user?.id;
  const isMyProfile = profileUserId === user?.id;

  /* ================= FORM ================= */

  const { formData, onChange, reset, setFormData } = useInputText({
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
  });

  /* ================= STATES ================= */

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState("");

  const [followStats, setFollowStats] = useState({
    followers: 0,
    following: 0,
    isFollowing: false,
  });

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  /* ================= LOAD PROFILE ================= */

  useEffect(() => {
    if (!profileUserId) return;

    const loadProfile = async () => {
      const res = await getMyProfile(profileUserId);
      const p = res.data.data;

      setFormData({
        headline: p.headline || "",
        bio: p.bio || "",
        skills: p.skills?.join(", ") || "",
        github: p.github || "",
        linkedin: p.linkedin || "",
        portfolio: p.portfolio || "",
        education: p.education || "",
        college: p.college || "",
        batchName: p.batchName || "",
        location: p.location || "",
        isProfilePublic: p.isProfilePublic ?? true,
        avatarUrl: p.avatarUrl || "",
      });
    };

    loadProfile();
  }, [profileUserId, setFormData]);

  /* ================= LOAD FOLLOW STATS ================= */

  useEffect(() => {
    if (!profileUserId) return;

    const loadStats = async () => {
      const res = await getFollowStats(profileUserId);
      setFollowStats(res.data.data);
    };

    loadStats();
  }, [profileUserId]);

  /* ================= FOLLOW ================= */

  const handleFollow = async () => {
    const res = await toggleFollow(profileUserId);
    const followed = res.data.followed;

    setFollowStats(prev => ({
      ...prev,
      isFollowing: followed,
      followers: followed
        ? prev.followers + 1
        : Math.max(prev.followers - 1, 0),
    }));
  };

  /* ================= FOLLOW LIST ================= */

  const openFollowers = async () => {
    const res = await getFollowers(profileUserId);
    setFollowersList(res.data.data);
    setShowFollowers(true);
  };

  const openFollowing = async () => {
    const res = await getFollowing(profileUserId);
    setFollowingList(res.data.data);
    setShowFollowing(true);
  };

  /* ================= AVATAR ================= */

  const handleAvatarUpload = async e => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setUploadingAvatar(true);

    const res = await uploadAvatar(file);

    setFormData(p => ({
      ...p,
      avatarUrl: res.data.data.avatarUrl,
    }));

    setUploadingAvatar(false);
  };

  /* ================= SAVE ================= */

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);

    await updateProfile({
      ...formData,
      skills: formData.skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
    });

    setMessage("Profile updated successfully");
    setSaving(false);
  };

  /* ================= VISIBILITY (FIXED PROPERLY) ================= */

  const handleToggleVisibility = async () => {
    const newValue = !formData.isProfilePublic;

    await updateProfile({
      ...formData,
      isProfilePublic: newValue,
      skills: formData.skills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean),
    });

    setFormData(prev => ({
      ...prev,
      isProfilePublic: newValue,
    }));
  };

  /* ================= LOADING ================= */

  if (loading || !user) {
    return (
      <ProfileLayout>
        <div className="text-gray-500">Loading profile...</div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">

        <h1 className="text-2xl font-semibold text-center mb-6">
          User Profile
        </h1>

        {/* AVATAR */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.avatarUrl || "/avatar-placeholder.png"}
            className="w-24 h-24 rounded-full object-cover border mb-2"
          />

          {isMyProfile && (
            <label className="text-blue-600 text-sm cursor-pointer">
              {uploadingAvatar ? "Uploading..." : "Change Avatar"}
              <input hidden type="file" onChange={handleAvatarUpload} />
            </label>
          )}
        </div>

        {/* STATS */}
        <div className="flex justify-center gap-12 mb-6 text-center">
          <div onClick={openFollowers} className="cursor-pointer">
            <p className="text-xl font-semibold">{followStats.followers}</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>

          <div onClick={openFollowing} className="cursor-pointer">
            <p className="text-xl font-semibold">{followStats.following}</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
        </div>

        {/* FOLLOW BUTTON */}
        {!isMyProfile && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded text-white ${
                followStats.isFollowing
                  ? "bg-red-500"
                  : "bg-blue-600"
              }`}
            >
              {followStats.isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}

        {/* VISIBILITY */}
        {isMyProfile && (
          <div className="flex justify-between p-3 border rounded mb-6">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-gray-500">
                {formData.isProfilePublic ? "Public" : "Private"}
              </p>
            </div>

            <button
              onClick={handleToggleVisibility}
              className={`px-4 py-2 rounded text-white ${
                formData.isProfilePublic
                  ? "bg-green-600"
                  : "bg-gray-600"
              }`}
            >
              {formData.isProfilePublic ? "Public" : "Private"}
            </button>
          </div>
        )}

        {message && (
          <p className="text-center text-green-600 mb-4">{message}</p>
        )}

        {/* EDIT FORM */}
        {isMyProfile && (
          <form onSubmit={handleSubmit} className="space-y-4">

            <InputText name="headline" label="Headline" value={formData.headline} onChange={onChange} />
            <InputText name="bio" label="Bio" value={formData.bio} onChange={onChange} />
            <InputText name="skills" label="Skills" value={formData.skills} onChange={onChange} />
            <InputText name="github" label="GitHub" value={formData.github} onChange={onChange} />
            <InputText name="linkedin" label="LinkedIn" value={formData.linkedin} onChange={onChange} />
            <InputText name="portfolio" label="Portfolio" value={formData.portfolio} onChange={onChange} />
            <InputText name="education" label="Education" value={formData.education} onChange={onChange} />
            <InputText name="college" label="College" value={formData.college} onChange={onChange} />
            <InputText name="batchName" label="Batch Name" value={formData.batchName} onChange={onChange} />
            <InputText name="location" label="Location" value={formData.location} onChange={onChange} />

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={reset} className="border px-4 py-2 rounded">
                Reset
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-black text-white px-4 py-2 rounded"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* FOLLOW MODALS */}

      {showFollowers && (
        <FollowListModal
          title="Followers"
          users={followersList}
          onClose={() => setShowFollowers(false)}
          onOpenProfile={id => navigate(`/profile/${id}`)}
        />
      )}

      {showFollowing && (
        <FollowListModal
          title="Following"
          users={followingList}
          onClose={() => setShowFollowing(false)}
          onOpenProfile={id => navigate(`/profile/${id}`)}
        />
      )}

    </ProfileLayout>
  );
};

export default ProfilePage;
