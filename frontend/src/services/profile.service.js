import api from "./api";

export const getMyProfile = (userId) => {
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