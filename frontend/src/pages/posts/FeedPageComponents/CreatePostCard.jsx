import { Image, Video, Calendar, FileText } from "lucide-react";
import PostActionButton from "./PostActionButton";

const CreatePostCard = ({ user, wsConnected, onOpenModal }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center space-x-3">
        <img
          src={user?.avatarUrl || "/avatar-placeholder.png"}
          className="w-12 h-12 rounded-full object-cover border"
          alt="Your avatar"
        />
        <button
          onClick={onOpenModal}
          className="flex-1 text-left border border-gray-300 rounded-full px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Start a post
        </button>
      </div>

      {!wsConnected && (
        <div className="mt-2 text-xs text-yellow-600 flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          Reconnecting to real-time updates...
        </div>
      )}

      <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
        <PostActionButton icon={Image} text="Photo" color="text-blue-500" onClick={onOpenModal} />
        <PostActionButton icon={Video} text="Video" color="text-green-500" onClick={onOpenModal} />
        <PostActionButton icon={Calendar} text="Event" color="text-purple-500" />
        <PostActionButton icon={FileText} text="Write article" color="text-orange-500" />
      </div>
    </div>
  );
};

export default CreatePostCard;