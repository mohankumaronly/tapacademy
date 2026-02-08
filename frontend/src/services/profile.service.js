import api from "./api";

export const getMyProfile = () => {
  return api.get("/profile/me");
};

export const updateProfile = (data) => {
  return api.put("/profile", data);
};

// export const getPublicProfiles = () => {
//   return api.get("/profile/public");
// };

export const getProfileById = (userId) => {
  return api.get(`/profile/${userId}`);
};

export const getPublicProfiles = (search = "") => {
  return api.get(`/profile/public?search=${search}`);
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
