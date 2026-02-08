import api from "./api";

export const toggleFollow = (userId) => {
  return api.post(`/profile/follow/${userId}`);
};

export const getFollowStats = (userId) => {
  return api.get(`/profile/follow-stats/${userId}`);
};
