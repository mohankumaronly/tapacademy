import api from "./api";

export const createPost = (formData) => {
  return api.post("/post", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const feed = () =>{
  return api.get('/post/feed');
}

export const likePost = (postId) => {
  return api.post(`/post/${postId}/like`);
};

export const updatePost = (id, text) => {
  return api.put(`/post/${id}`, { text });
};

export const deletePost = (id) => {
  return api.delete(`/post/${id}`);
};



