import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import Comment from "./Comment";
import userPlaceholder from "../../../assets/images/user.png"

const CommentsSection = ({
  postId,
  user,
  comments = [], 
  commentText,
  loading,
  postingComment, 
  onAddComment,
  onCommentChange
}) => {
  const commentsEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (comments?.length > 0) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [comments?.length]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleAddComment();
    }
  };

  const handleAddComment = () => {
    if (!commentText?.trim() || loading || postingComment) return;
    onAddComment(postId);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div 
      id={`comments-${postId}`}
      className="bg-gray-50 p-4 border-t border-gray-200 animate-in slide-in-from-bottom-2 duration-300"
    >
      <div className="flex gap-2 mb-4">
        <img
          src={user?.avatarUrl || userPlaceholder}
          className="w-8 h-8 rounded-full object-cover"
          alt="Your avatar"
        />
        <div className="flex-1 flex gap-2">
          <input
            ref={inputRef}
            value={commentText || ""}
            onChange={(e) => onCommentChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-300"
            placeholder={postingComment ? "Posting comment..." : "Add a comment..."}
            disabled={loading || postingComment}
          />
          <button 
            onClick={handleAddComment}
            disabled={!commentText?.trim() || loading || postingComment}
            className={`p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 duration-200 relative ${
              postingComment ? 'cursor-wait' : ''
            }`}
          >
            {postingComment ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={18}/>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {comments && comments.length > 0 ? (
            comments.map((c, idx) => (
              <Comment key={c._id} comment={c} index={idx} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
          )}
          <div ref={commentsEndRef} />
        </div>
      )}
    </div>
  );
};

export default CommentsSection;