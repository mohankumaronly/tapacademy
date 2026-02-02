import api from "./api";

export const getMyProfile = () => {
  return api.get("/profile/me");
};

export const updateProfile = (data) => {
  return api.put("/profile", data);
};
