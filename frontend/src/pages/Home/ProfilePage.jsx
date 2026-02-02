import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useInputText from "../../Hooks/InputHooks";
import InputText from "../../common/InputText";
import ProfileLayout from "../../layouts/ProfileLayout";
import {
  getMyProfile,
  updateProfile,
  uploadAvatar,
} from "../../services/profile.service";

const ProfilePage = () => {
  const { user, loading } = useAuth();

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

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!user) return;

    getMyProfile()
      .then((res) => {
        const profile = res.data.data;

        setFormData({
          headline: profile.headline || "",
          bio: profile.bio || "",
          skills: profile.skills?.join(", ") || "",
          github: profile.github || "",
          linkedin: profile.linkedin || "",
          portfolio: profile.portfolio || "",
          education: profile.education || "",
          college: profile.college || "",
          batchName: profile.batchName || "",
          location: profile.location || "",
          isProfilePublic: profile.isProfilePublic ?? true,
          avatarUrl: profile.avatarUrl || "", 
        });
      })
      .catch((err) => {
        if (err.response?.status !== 404) console.error(err);
      });
  }, [user]);

 const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("Image must be under 10MB");
    return;
  }

  try {
    setUploadingAvatar(true);

    const res = await uploadAvatar(file);

    if (res.data?.success) {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: res.data.data.avatarUrl,
      }));
    } else {
      throw new Error("Upload failed");
    }
  } catch (err) {
    console.error(err);
    alert("Avatar upload failed");
  } finally {
    setUploadingAvatar(false);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateProfile({
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = () => {
    onChange({
      target: {
        name: "isProfilePublic",
        value: !formData.isProfilePublic,
      },
    });
  };

  if (loading) {
    return (
      <ProfileLayout>
        <div className="text-gray-500">Loading profile...</div>
      </ProfileLayout>
    );
  }

  if (!user) {
    return (
      <ProfileLayout>
        <div className="text-red-500">Please login to view profile</div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="w-full max-w-2xl bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          User Profile
        </h1>

        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.avatarUrl || "/avatar-placeholder.png"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover mb-3 border"
          />

          <label className="text-sm text-blue-600 cursor-pointer">
            {uploadingAvatar ? "Uploading..." : "Change Avatar"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
            />
          </label>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputText label="First Name" value={user.firstName} readOnly />
          <InputText label="Last Name" value={user.lastName} readOnly />
          <InputText label="Email" value={user.email} readOnly />
        </div>

        <div className="flex items-center justify-between mb-6 p-3 border rounded">
          <div>
            <p className="font-medium">Profile Visibility</p>
            <p className="text-sm text-gray-500">
              {formData.isProfilePublic ? "Public" : "Private"}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleVisibility}
            className={`px-4 py-2 rounded text-white ${
              formData.isProfilePublic ? "bg-green-600" : "bg-gray-600"
            }`}
          >
            {formData.isProfilePublic ? "Public" : "Private"}
          </button>
        </div>

        {message && (
          <div className="mb-4 text-sm text-center text-green-600">
            {message}
          </div>
        )}

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
            <button type="button" onClick={reset} className="px-4 py-2 border rounded">
              Reset
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-black text-white rounded"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </ProfileLayout>
  );
};

export default ProfilePage;
