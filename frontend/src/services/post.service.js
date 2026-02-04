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


