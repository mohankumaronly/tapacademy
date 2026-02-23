import { useState } from "react";
import { addComment, getComments } from "../../../../services/comment.service";

const useComments = () => {
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  const toggleComments = async (postId) => {
    const button = document.getElementById(`comment-btn-${postId}`);
    if (button) {
      button.classList.add('scale-125');
      setTimeout(() => button.classList.remove('scale-125'), 200);
    }

    setOpenComments(p => ({ ...p, [postId]: !p[postId] }));
    if (comments[postId]) return;

    setLoadingComments(p => ({ ...p, [postId]: true }));
    try {
      const res = await getComments(postId);
      setComments(p => ({ ...p, [postId]: res.data.data }));
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoadingComments(p => ({ ...p, [postId]: false }));
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    const commentTextCopy = text;
    setCommentText(p => ({ ...p, [postId]: "" }));

    try {
      await addComment(postId, commentTextCopy);
    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentText(p => ({ ...p, [postId]: commentTextCopy }));
    }
  };

  return {
    openComments,
    comments,
    commentText,
    loadingComments,
    setComments,
    toggleComments,
    handleAddComment,
    setCommentText
  };
};

export default useComments;