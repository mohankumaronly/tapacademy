import { useState, useCallback } from "react";
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

    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));

    if (!comments[postId]) {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      try {
        const res = await getComments(postId);
        console.log('Fetched comments for post', postId, ':', res.data.data); // Debug log
        setComments(prev => ({ ...prev, [postId]: res.data.data }));
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setLoadingComments(prev => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    const commentTextCopy = text;
    setCommentText(prev => ({ ...prev, [postId]: "" }));

    try {
      const response = await addComment(postId, commentTextCopy);
      console.log('Comment added via API:', response);

    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentText(prev => ({ ...prev, [postId]: commentTextCopy }));
    }
  };

  const addCommentFromWebSocket = useCallback((postId, newComment) => {
    console.log('Adding comment from WebSocket for post', postId, ':', newComment);

    setComments(prevComments => {
      const currentComments = prevComments[postId] || [];

      const commentExists = currentComments.some(c => c._id === newComment._id);
      if (commentExists) {
        console.log('Comment already exists, skipping');
        return prevComments;
      }

      return {
        ...prevComments,
        [postId]: [newComment, ...currentComments]
      };
    });
  }, []);

  const removeCommentFromWebSocket = useCallback((postId, commentId) => {
    console.log('Removing comment from WebSocket for post', postId, ':', commentId);

    setComments(prevComments => {
      const currentComments = prevComments[postId] || [];

      return {
        ...prevComments,
        [postId]: currentComments.filter(c => c._id !== commentId)
      };
    });
  }, []);

  const clearCommentsForPost = useCallback((postId) => {
    setComments(prev => {
      const newComments = { ...prev };
      delete newComments[postId];
      return newComments;
    });

    setOpenComments(prev => {
      const newOpen = { ...prev };
      delete newOpen[postId];
      return newOpen;
    });
  }, []);

  return {
    openComments,
    comments,
    commentText,
    loadingComments,
    setComments,
    setCommentText,
    setOpenComments,
    toggleComments,
    handleAddComment,
    addCommentFromWebSocket,
    removeCommentFromWebSocket,
    clearCommentsForPost
  };
};

export default useComments;