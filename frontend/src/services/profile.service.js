import api from "./api";

// Fix: Add userId parameter
export const getMyProfile = (userId) => {
  // If userId is provided and it's not the current user's profile,
  // you might need a different endpoint. But based on your router,
  // /profile/me always returns the authenticated user's profile
  // So we'll use the userId for the profile by ID endpoint instead
  if (userId) {
    return getProfileById(userId);
  }
  return api.get("/profile/me");
};

export const updateProfile = (data) => {
  return api.put("/profile", data);
};

export const getProfileById = (userId) => {
  return api.get(`/profile/${userId}`);
};

export const getPublicProfiles = (search = "", page = 1, limit = 10) => {
  return api.get(`/profile/public?search=${search}&page=${page}&limit=${limit}`);
};

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return api.post("/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const toggleVisibility = () => {
  return api.patch("/profile/visibility");
};