const PostStats = ({ likes, commentsCount }) => {
  return (
    <div className="px-4 py-2 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-1">
        <div className="flex -space-x-1">
          {likes?.slice(0, 3).map((likeUser, i) => (
            <img
              key={likeUser._id || i}
              src={likeUser.avatarUrl || "/avatar-placeholder.png"}
              className="w-5 h-5 rounded-full border-2 border-white object-cover"
              alt={`${likeUser.firstName || 'User'}`}
              title={`${likeUser.firstName || 'User'} ${likeUser.lastName || ''}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">{likes?.length || 0} {likes?.length === 1 ? 'like' : 'likes'}</span>
      </div>
      <span className="text-sm text-gray-500">{commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}</span>
    </div>
  );
};

export default PostStats;