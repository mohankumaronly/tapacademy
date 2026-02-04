import { useState } from "react";
import useInputText from "../../Hooks/InputHooks";
import { createPost } from "../../services/post.service";

const CreatePostPage = () => {
  const { formData, onChange, reset } = useInputText({
    text: "",
  });

  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      return setMessage("Post text is required");
    }

    const payload = new FormData();
    payload.append("text", formData.text);

    if (media) {
      payload.append("media", media);
    }

    try {
      setLoading(true);
      setMessage("");

      await createPost(payload);

      setMessage("Post created successfully");
      reset();
      setMedia(null);
      setPreview(null);
    } catch (err) {
      setMessage("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Post</h1>

      {message && (
        <div className="mb-3 text-sm text-center text-gray-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="text"
          placeholder="What's on your mind?"
          value={formData.text}
          onChange={onChange}
          rows={4}
          className="w-full border rounded p-3 resize-none"
        />

        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        {preview && (
          <div className="border rounded p-2">
            {preview.type === "image" ? (
              <img
                src={preview.url}
                alt="preview"
                className="w-full rounded"
              />
            ) : (
              <video
                src={preview.url}
                controls
                className="w-full rounded"
              />
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              reset();
              setMedia(null);
              setPreview(null);
            }}
            className="px-4 py-2 border rounded"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostPage;
