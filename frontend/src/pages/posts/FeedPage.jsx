import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { Heart } from "lucide-react";
import { feed, likePost } from "../../services/post.service";
import { useNavigate } from "react-router-dom";

const FeedPage = () => {
    const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feed()
      .then(res => setPosts(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (postId) => {
    try {
      const res = await likePost(postId);

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, likes: Array(res.data.likesCount).fill(1) }
            : post
        )
      );
    } catch (err) {
      console.error("Like failed");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {posts.map(post => (
        <div key={post._id} className="bg-white shadow rounded-lg p-4">

        <div
        className="flex items-center gap-3 mb-2 cursor-pointer hover:opacity-80 transition"
        onClick={() => navigate(`/profile/${post.author._id}`)}
        >
        <img
            src={post.authorProfile?.avatarUrl || "/avatar-placeholder.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
        />

        <p className="font-medium">
            {post.author?.firstName} {post.author?.lastName}
        </p>
        </div>


          {post.text && (
            <p className="mb-3 text-gray-800">{post.text}</p>
          )}

          {post.postType === "image" && post.media?.url && (
            <img
              src={post.media.url}
              className="rounded-lg w-full max-h-[400px] object-cover"
            />
          )}

          {post.postType === "video" && post.media?.url && (
            <video controls className="rounded-lg w-full max-h-[400px]">
              <source src={post.media.url} />
            </video>
          )}

        <button
        onClick={() => handleLike(post._id)}
        className={`mt-3 flex items-center gap-1 text-sm transition active:scale-125 
            ${post.likes.length > 0 ? "text-red-600" : "text-gray-700 hover:text-red-600"}
        `}
        >
        <Heart
            className={`w-5 h-5 transition-all duration-300 
            ${post.likes.length > 0 ? "fill-red-600 scale-110" : "fill-none"}
            `}
        />
        <span>{post.likes.length}</span>
        </button>

        </div>
      ))}
    </div>
  );
};

export default FeedPage;
