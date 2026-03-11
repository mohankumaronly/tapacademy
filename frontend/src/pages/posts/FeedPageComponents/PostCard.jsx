import { useRef, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostStats from "./PostStats";
import PostActions from "./PostActions";
import CommentsSection from "./CommentsSection";

let sharedObserver = null;

const getObserver = () => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {
            });
          } else {
            video.pause();
          }
        });
      },
      { 
        threshold: 0.5,
        rootMargin: "50px"
      }
    );
  }
  return sharedObserver;
};

const areEqual = (prevProps, nextProps) => {
  if (prevProps.post._id !== nextProps.post._id) return false;
  if (prevProps.post.content !== nextProps.post.content) return false;
  if (prevProps.post.likes?.length !== nextProps.post.likes?.length) return false;
  if (prevProps.post.commentsCount !== nextProps.post.commentsCount) return false;
  if (prevProps.post.author?.avatarUrl !== nextProps.post.author?.avatarUrl) return false;
  
  if (prevProps.post.isNew !== nextProps.post.isNew) return false;
  if (prevProps.post.isUpdated !== nextProps.post.isUpdated) return false;
  
  if (prevProps.hasLiked !== nextProps.hasLiked) return false;
  if (prevProps.followingMap[prevProps.post.author._id] !== 
      nextProps.followingMap[nextProps.post.author._id]) return false;
  
  if (prevProps.menuOpen !== nextProps.menuOpen) return false;
  if (prevProps.editingPost !== nextProps.editingPost) return false;
  if (prevProps.editText !== nextProps.editText) return false;
  
  if (prevProps.openComments?.[prevProps.post._id] !== 
      nextProps.openComments?.[nextProps.post._id]) return false;
  
  const prevComments = prevProps.comments?.[prevProps.post._id]?.length || 0;
  const nextComments = nextProps.comments?.[nextProps.post._id]?.length || 0;
  if (prevComments !== nextComments) return false;
  
  if (prevProps.commentText !== nextProps.commentText) return false;
  if (prevProps.loadingComments !== nextProps.loadingComments) return false;
  
  return true;
};

const PostCard = ({
  post,
  index,
  user,
  isOwner,
  hasLiked,
  followingMap,
  menuOpen,
  editingPost,
  editText,
  openComments,
  comments,
  commentText,
  loadingComments,
  onMenuToggle,
  onLike,
  onFollow,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditChange,
  onDelete,
  onToggleComments,
  onAddComment,
  onCommentChange
}) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = getObserver();
    const videoElement = videoRef.current;

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  const handleProfileClick = () => navigate(`/profile/${post.author._id}`);

  const handleCommentChange = (value) => {
    onCommentChange(value, post._id);
  };

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
        post.isNew ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50/30' : ''
      } ${post.isUpdated ? 'ring-2 ring-green-500 ring-opacity-50' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {post.isNew && (
        <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-t-lg">
          New Post
        </div>
      )}

      {post.isUpdated && (
        <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-t-lg">
          Updated
        </div>
      )}

      <PostHeader
        post={post}
        isOwner={isOwner}
        followingMap={followingMap}
        menuOpen={menuOpen}
        onProfileClick={handleProfileClick}
        onMenuToggle={onMenuToggle}
        onFollow={onFollow}
        onEditStart={() => onEditStart(post)}
        onDelete={() => onDelete(post._id)}
      />

      <PostContent
        post={post}
        isEditing={editingPost === post._id}
        editText={editText}
        onEditChange={onEditChange}
        onEditSave={() => onEditSave(post._id)}
        onEditCancel={onEditCancel}
        videoRef={videoRef}
      />

      <PostStats
        likes={post.likes}
        commentsCount={post.commentsCount}
      />

      <PostActions
        postId={post._id}
        hasLiked={hasLiked}
        onLike={onLike}
        onToggleComments={onToggleComments}
      />

      {openComments?.[post._id] && (
        <CommentsSection
          postId={post._id}
          user={user}
          comments={comments?.[post._id] || []}
          commentText={commentText?.[post._id] || ""}
          loading={loadingComments?.[post._id]}
          onAddComment={onAddComment}
          onCommentChange={handleCommentChange}
        />
      )}
    </div>
  );
};

export default memo(PostCard, areEqual);