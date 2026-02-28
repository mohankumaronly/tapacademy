import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Video, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { createPost } from "../../../services/post.service";

const CreatePostModal = ({ isOpen, onClose, user }) => {
  const [modalAnimation, setModalAnimation] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [newPostPreview, setNewPostPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'
  const [createPostMessage, setCreatePostMessage] = useState({ text: "", type: "" });
  
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  
  useEffect(() => {
    const closeModal = e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };
    
    if (isOpen) {
      setTimeout(() => setModalAnimation("animate-in fade-in zoom-in duration-300"), 100);
      document.addEventListener("mousedown", closeModal);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener("mousedown", closeModal);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewPostMedia(file);
    const url = URL.createObjectURL(file);
    setNewPostPreview({
      url,
      type: file.type.startsWith("video") ? "video" : "image",
    });
    
    // Reset states when new file is selected
    setUploadProgress(0);
    setUploadStatus(null);
    setCreatePostMessage({ text: "", type: "" });
  };

  const removeMedia = () => {
    setNewPostMedia(null);
    setNewPostPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadProgress(0);
    setUploadStatus(null);
  };

  const resetForm = () => {
    setNewPostText("");
    removeMedia();
    setCreatePostMessage({ text: "", type: "" });
    setUploadProgress(0);
    setUploadStatus(null);
  };

  const handleClose = () => {
    setModalAnimation("animate-out fade-out zoom-out duration-200");
    setTimeout(() => {
      onClose();
      setModalAnimation("");
      resetForm();
    }, 200);
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim() && !newPostMedia) {
      setCreatePostMessage({ 
        text: "Please add some text or media", 
        type: "error" 
      });
      setUploadStatus('error');
      return;
    }

    const payload = new FormData();
    payload.append("text", newPostText);
    if (newPostMedia) payload.append("media", newPostMedia);

    try {
      setUploadStatus('uploading');
      setCreatePostMessage({ text: "", type: "" });
      
      // Pass the onUploadProgress callback to track upload progress
      await createPost(payload, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });
      
      setUploadStatus('success');
      setUploadProgress(100);
      setCreatePostMessage({ text: "Post created successfully!", type: "success" });
      
      // Close modal after success
      setTimeout(handleClose, 1500);
    } catch (error) {
      console.error("Error creating post:", error);
      setUploadStatus('error');
      setCreatePostMessage({ text: "Failed to create post. Try again.", type: "error" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        className={`bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col ${modalAnimation}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Create a post</h2>
          <button
            onClick={handleClose}
            disabled={uploadStatus === 'uploading'}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors hover:rotate-90 duration-200 ${
              uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.avatarUrl || "/avatar-placeholder.png"}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              alt="Your avatar"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">Post to anyone</p>
            </div>
          </div>

          {/* Status Message */}
          {(uploadStatus === 'success' || uploadStatus === 'error') && (
            <div className={`mb-4 flex items-center gap-2 px-4 py-3 rounded-xl ${
              uploadStatus === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {uploadStatus === 'success' ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <AlertCircle size={20} className="text-red-600" />
              )}
              <span className="text-sm font-medium">
                {uploadStatus === 'success' 
                  ? 'Post created successfully!' 
                  : createPostMessage.text || 'Failed to create post'}
              </span>
            </div>
          )}

          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="What do you want to talk about?"
            className="w-full text-lg text-gray-800 placeholder-gray-400 border-none focus:ring-0 resize-none outline-none min-h-[120px]"
            autoFocus
            disabled={uploadStatus === 'uploading'}
          />

          {newPostPreview && (
            <div className="mt-4 animate-in fade-in zoom-in duration-300">
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={removeMedia}
                  disabled={uploadStatus === 'uploading'}
                  className={`absolute top-2 right-2 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition hover:scale-110 duration-200 ${
                    uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <X size={18} />
                </button>
                
                {newPostPreview.type === "image" ? (
                  <img 
                    src={newPostPreview.url} 
                    alt="preview" 
                    className="w-full h-auto max-h-[300px] object-contain" 
                  />
                ) : (
                  <video 
                    src={newPostPreview.url} 
                    controls 
                    className="w-full max-h-[300px]" 
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 border-t border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Add to your post:</span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadStatus === 'uploading'}
                className={`p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all hover:scale-110 duration-200 ${
                  uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Add Image"
              >
                <ImageIcon size={22} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadStatus === 'uploading'}
                className={`p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-all hover:scale-110 duration-200 ${
                  uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Add Video"
              >
                <Video size={22} />
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Progress Bar - Shows where loading used to be */}
          {uploadStatus === 'uploading' && (
            <div className="px-6 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" />
                  Uploading...
                </span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              {newPostMedia && (
                <p className="text-xs text-gray-400 mt-1">
                  Uploading {newPostMedia.name}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploadStatus === 'uploading'}
              className={`px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition hover:scale-105 duration-200 ${
                uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Cancel
            </button>
            
            <button
              onClick={handleCreatePost}
              disabled={uploadStatus === 'uploading' || uploadStatus === 'success' || (!newPostText.trim() && !newPostMedia)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                uploadStatus === 'uploading' || uploadStatus === 'success' || (!newPostText.trim() && !newPostMedia)
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 hover:scale-105 duration-200"
              }`}
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                </>
              ) : uploadStatus === 'success' ? (
                <>
                  <CheckCircle size={18} />
                  Posted!
                </>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;