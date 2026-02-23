import { Heart, MessageCircle, Send } from "lucide-react";

const PostActions = ({ postId, hasLiked, onLike, onToggleComments }) => {
  return (
    <div className="px-4 py-2 flex justify-around">
      <button 
        id={`like-btn-${postId}`}
        onClick={() => onLike(postId)} 
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
          hasLiked 
            ? "text-red-500 hover:bg-red-50" 
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        <Heart className={`w-5 h-5 transition-all duration-200 ${hasLiked && "fill-current scale-110"}`} />
        <span className="text-sm font-medium">Like</span>
      </button>

      <button 
        id={`comment-btn-${postId}`}
        onClick={() => onToggleComments(postId)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 transition-transform duration-200" />
        <span className="text-sm font-medium">Comment</span>
      </button>

      <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-200 hover:scale-105">
        <Send className="w-5 h-5 transition-transform duration-200" />
        <span className="text-sm font-medium">Share</span>
      </button>
    </div>
  );
};

export default PostActions;