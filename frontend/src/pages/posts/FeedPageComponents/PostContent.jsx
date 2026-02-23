import { X, Check } from "lucide-react";

const PostContent = ({
  post,
  isEditing,
  editText,
  onEditChange,
  onEditSave,
  onEditCancel,
  videoRef
}) => {
  if (isEditing) {
    return (
      <div className="px-4 pb-3 space-y-2 animate-in fade-in duration-200">
        <textarea
          value={editText}
          onChange={e => onEditChange(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={onEditCancel}
            className="p-1 hover:bg-gray-100 rounded-full transition-all hover:rotate-90 duration-200"
          >
            <X size={18}/>
          </button>
          <button 
            onClick={onEditSave}
            className="p-1 hover:bg-gray-100 rounded-full text-green-600 transition-all hover:scale-110 duration-200"
          >
            <Check size={18}/>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>
      </div>

      {post.media?.url && (
        <div className="border-y border-gray-200">
          {post.postType === "image" ? (
            <img 
              src={post.media.url} 
              className="w-full max-h-[500px] object-contain bg-black/5 hover:scale-[1.02] transition-transform duration-300"
              alt="Post content"
            />
          ) : (
            <video 
              ref={videoRef}
              controls 
              muted
              loop
              playsInline
              className="w-full max-h-[500px] bg-black/5 hover:scale-[1.02] transition-transform duration-300"
            >
              <source src={post.media.url} />
            </video>
          )}
        </div>
      )}
    </>
  );
};

export default PostContent;