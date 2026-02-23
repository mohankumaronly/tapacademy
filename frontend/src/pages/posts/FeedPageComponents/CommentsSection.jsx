import { Send } from "lucide-react";
import Comment from "./Comment";

const CommentsSection = ({
  postId,
  user,
  comments,
  commentText,
  loading,
  onAddComment,
  onCommentChange
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onAddComment(postId);
    }
  };

  return (
    <div 
      id={`comments-${postId}`}
      className="bg-gray-50 p-4 border-t border-gray-200 animate-in slide-in-from-bottom-2 duration-300"
    >
      <div className="flex gap-2 mb-4">
        <img
          src={user?.avatarUrl || "/avatar-placeholder.png"}
          className="w-8 h-8 rounded-full object-cover"
          alt="Your avatar"
        />
        <div className="flex-1 flex gap-2">
          <input
            value={commentText}
            onChange={(e) => onCommentChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-300"
            placeholder="Add a comment..."
          />
          <button 
            onClick={() => onAddComment(postId)}
            disabled={!commentText?.trim()}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 duration-200"
          >
            <Send size={18}/>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {comments?.map((c, idx) => (
            <Comment key={c._id} comment={c} index={idx} />
          ))}
          {(!comments || comments.length === 0) && (
            <p className="text-center text-gray-500 py-2">No comments yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;