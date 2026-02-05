import api from "./api";

export const addComment = (postId, text) => {
  return api.post("/comments", { postId, text });
};

export const getComments = (postId) => {
  return api.get(`/comments/${postId}`);
};
