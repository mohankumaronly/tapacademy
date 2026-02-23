const Comment = ({ comment, index }) => {
  return (
    <div 
      className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <img 
        src={comment.authorProfile?.avatarUrl || "/avatar-placeholder.png"} 
        className="w-8 h-8 rounded-full object-cover"
        alt={comment.author.firstName}
      />
      <div className="flex-1">
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="font-semibold text-sm">
            {comment.author.firstName} {comment.author.lastName}
          </p>
          <p className="text-sm text-gray-800">{comment.text}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-2">
          {new Date(comment.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default Comment;