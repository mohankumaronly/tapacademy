import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostStats from "./PostStats";
import PostActions from "./PostActions";
import CommentsSection from "./CommentsSection";

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
  const videoRefs = useRef({});

  // Video intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (videoRefs.current[post._id]) {
      observer.observe(videoRefs.current[post._id]);
    }

    return () => {
      if (videoRefs.current[post._id]) {
        observer.unobserve(videoRefs.current[post._id]);
      }
    };
  }, [post._id]);

  const handleProfileClick = () => navigate(`/profile/${post.author._id}`);

  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
        post.isNew ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50/30' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {post.isNew && (
        <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-t-lg">
          New Post
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
        videoRef={(el) => videoRefs.current[post._id] = el}
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

      {openComments[post._id] && (
        <CommentsSection
          postId={post._id}
          user={user}
          comments={comments[post._id]}
          commentText={commentText[post._id] || ""}
          loading={loadingComments[post._id]}
          onAddComment={onAddComment}
          onCommentChange={(value) => onCommentChange(p => ({ ...p, [post._id]: value }))}
        />
      )}
    </div>
  );
};

export default PostCard;