import { MoreVertical } from "lucide-react";
import PostMenu from "./PostMenu";

const PostHeader = ({
  post,
  isOwner,
  followingMap,
  menuOpen,
  onProfileClick,
  onMenuToggle,
  onFollow,
  onEditStart,
  onDelete
}) => {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center gap-3">
        <div
          onClick={onProfileClick}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={post.authorProfile?.avatarUrl || "/avatar-placeholder.png"}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-colors group-hover:scale-105 duration-200"
            alt="avatar"
          />
          <div>
            <p className="font-semibold group-hover:text-blue-600 transition-colors">
              {post.author.firstName} {post.author.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {post.author.title || "Professional"}
            </p>
          </div>
        </div>

        {!isOwner && (
          <button
            onClick={() => onFollow(post.author._id)}
            className={`text-xs px-3 py-1 rounded-full border transition-all hover:scale-105 duration-200 ${
              followingMap[post.author._id]
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {followingMap[post.author._id] ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {isOwner && (
        <div className="relative">
          <button
            onClick={() => onMenuToggle(menuOpen === post._id ? null : post._id)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors hover:rotate-90 duration-200"
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen === post._id && (
            <PostMenu
              onEdit={onEditStart}
              onDelete={onDelete}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PostHeader;