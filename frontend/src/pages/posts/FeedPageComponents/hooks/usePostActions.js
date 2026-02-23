import { useState } from "react";
import { deletePost, likePost, updatePost } from "../../../../services/post.service";
import { toggleFollow } from "../../../../services/follow.service";

const usePostActions = ({ posts, setPosts, followingMap, setFollowingMap, user }) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");

  const handleLike = async (postId) => {
    const button = document.getElementById(`like-btn-${postId}`);
    if (button) {
      button.classList.add('scale-125');
      setTimeout(() => button.classList.remove('scale-125'), 200);
    }

    const currentUser = user.id;
    const post = posts.find(p => p._id === postId);
    const isCurrentlyLiked = post?.likes.some(u => u._id === currentUser);

    setPosts(p =>
      p.map(post =>
        post._id === postId
          ? {
              ...post,
              likes: isCurrentlyLiked
                ? post.likes.filter(u => u._id !== currentUser)
                : [...post.likes, {
                    _id: currentUser,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatarUrl: user.avatarUrl
                  }],
            }
          : post
      )
    );

    try { 
      await likePost(postId); 
    } catch (error) {
      console.error("Error liking post:", error);
      setPosts(p =>
        p.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: isCurrentlyLiked
                  ? [...post.likes, {
                      _id: currentUser,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      avatarUrl: user.avatarUrl
                    }]
                  : post.likes.filter(u => u._id !== currentUser),
              }
            : post
        )
      );
    }
  };

  const handleFollow = async (authorId) => {
    setFollowingMap(prev => ({ ...prev, [authorId]: !prev[authorId] }));
    try {
      await toggleFollow(authorId);
    } catch (error) {
      console.error("Error toggling follow:", error);
      setFollowingMap(prev => ({ ...prev, [authorId]: !prev[authorId] }));
    }
  };

  const startEdit = (post) => {
    setEditingPost(post._id);
    setEditText(post.text);
    setMenuOpen(null);
  };

  const saveEdit = async (postId) => {
    if (!editText.trim()) return;
    try {
      const res = await updatePost(postId, editText);
      setPosts(p => p.map(post => post._id === postId ? res.data.data : post));
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Delete this post?")) {
      try {
        await deletePost(postId);
        setPosts(p => p.filter(post => post._id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return {
    menuOpen,
    editingPost,
    editText,
    setMenuOpen,
    setEditingPost,
    setEditText,
    handleLike,
    handleFollow,
    startEdit,
    saveEdit,
    handleDelete
  };
};

export default usePostActions;