import api from "./api";

export const createPost = (formData, onUploadProgress) => {
  return api.post("/post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

export const feed = (page = 1, limit = 10) => {
  return api.get(`/post/feed?page=${page}&limit=${limit}`);
};

export const likePost = (postId) => {
  return api.post(`/post/${postId}/like`);
};

export const updatePost = (id, text) => {
  return api.put(`/post/${id}`, { text });
};

export const deletePost = (id) => {
  return api.delete(`/post/${id}`);
};

export const getUserPosts = (userId) => {
  return api.get(`/profile/${userId}/posts`);
};