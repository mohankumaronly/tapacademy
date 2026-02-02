import api from "./api";

export const getMyProfile = () => {
  return api.get("/profile/me");
};

export const updateProfile = (data) => {
  return api.put("/profile", data);
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
