import api from "./api";

export const toggleFollow = (userId) => {
  return api.post(`/profile/follow/${userId}`);
};

export const getFollowStats = (userId) => {
  return api.get(`/profile/follow-stats/${userId}`);
};

export const getFollowers = id =>
  api.get(`/profile/followers/${id}`);

export const getFollowing = id =>
  api.get(`/profile/following/${id}`);
