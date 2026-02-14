import { useState, useRef } from "react";
import useInputText from "../../Hooks/InputHooks";
import { createPost } from "../../services/post.service";
import { Image, Video, X, Send, Loader2 } from "lucide-react";

const CreatePostPage = () => {
  const { formData, onChange, reset } = useInputText({
    text: "",
  });

  const fileInputRef = useRef(null);
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMedia(file);
    const url = URL.createObjectURL(file);
    setPreview({
      url,
      type: file.type.startsWith("video") ? "video" : "image",
    });
  };

  const removeMedia = () => {
    setMedia(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim() && !media) {
      return setMessage({ text: "Please add some text or media", type: "error" });
    }

    const payload = new FormData();
    payload.append("text", formData.text);
    if (media) payload.append("media", media);

    try {
      setLoading(true);
      setMessage({ text: "", type: "" });
      await createPost(payload);

      setMessage({ text: "Post created successfully!", type: "success" });
      reset();
      removeMedia();
    } catch (err) {
      setMessage({ text: "Failed to create post. Try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Create Post</h1>
          {message.text && (
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              message.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}>
              {message.text}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <textarea
            name="text"
            placeholder="What's on your mind?"
            value={formData.text}
            onChange={onChange}
            rows={4}
            className="w-full text-lg text-gray-800 placeholder-gray-400 border-none focus:ring-0 resize-none outline-none"
          />

          {preview && (
            <div className="relative group rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition"
              >
                <X size={18} />
              </button>
              
              {preview.type === "image" ? (
                <img src={preview.url} alt="preview" className="w-full h-auto max-h-[400px] object-contain" />
              ) : (
                <video src={preview.url} controls className="w-full max-h-[400px]" />
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Add Image or Video"
              >
                <Image size={22} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
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

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { reset(); removeMedia(); setMessage({text: "", type: ""}) }}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition"
              >
                Clear
              </button>
              
              <button
                type="submit"
                disabled={loading || (!formData.text.trim() && !media)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all shadow-md ${
                  loading || (!formData.text.trim() && !media)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Posting
                  </>
                ) : (
                  <>
                    <span>Post</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;