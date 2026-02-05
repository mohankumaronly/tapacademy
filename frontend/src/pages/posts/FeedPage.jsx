import { useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import { feed, likePost } from "../../services/post.service";
import { addComment, getComments } from "../../services/comment.service";

const FeedPage = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  useEffect(() => {
    feed()
      .then(res => setPosts(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (postId) => {
    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? { ...p, likes: [...p.likes, "temp"] }
          : p
      )
    );

    try {
      const res = await likePost(postId);

      setPosts(prev =>
        prev.map(p =>
          p._id === postId
            ? { ...p, likes: Array(res.data.likesCount).fill(1) }
            : p
        )
      );
    } catch {
      console.error("Like failed");
    }
  };

  const toggleComments = async (postId) => {
    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    if (comments[postId]) return;

    setLoadingComments(prev => ({ ...prev, [postId]: true }));

    try {
      const res = await getComments(postId);
      setComments(prev => ({
        ...prev,
        [postId]: res.data.data,
      }));
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;

    const res = await addComment(postId, commentText[postId]);

    setComments(prev => ({
      ...prev,
      [postId]: [res.data.data, ...(prev[postId] || [])],
    }));

    setCommentText(prev => ({ ...prev, [postId]: "" }));
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
              className="w-10 h-10 rounded-full object-cover"
              alt="avatar"
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
              alt="post"
            />
          )}

          {post.postType === "video" && post.media?.url && (
            <video controls className="rounded-lg w-full max-h-[400px]">
              <source src={post.media.url} />
            </video>
          )}

          <div className="flex gap-4 mt-3 items-center">

            <button
              onClick={() => handleLike(post._id)}
              className="flex items-center gap-1 text-sm hover:text-red-600 active:scale-125 transition"
            >
              <Heart
                className={`w-5 h-5 ${
                  post.likes.length ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>{post.likes.length}</span>
            </button>

            <button
              onClick={() => toggleComments(post._id)}
              className="flex items-center gap-1 text-sm hover:text-blue-600 transition"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.commentsCount}</span>
            </button>

          </div>

          {openComments[post._id] && (
            <div className="mt-3 border-t pt-3 space-y-3">

              <div className="flex gap-2">
                <input
                  value={commentText[post._id] || ""}
                  onChange={e =>
                    setCommentText(prev => ({
                      ...prev,
                      [post._id]: e.target.value,
                    }))
                  }
                  placeholder="Write a comment..."
                  className="flex-1 border rounded px-3 py-1 text-sm"
                />
                <button
                  onClick={() => handleAddComment(post._id)}
                  className="text-blue-600 text-sm"
                >
                  Post
                </button>
              </div>

              {loadingComments[post._id] && (
                <p className="text-sm text-gray-400">Loading comments...</p>
              )}

              {comments[post._id]?.map(c => (
                <div key={c._id} className="flex gap-2 items-start">

                  <img
                    src={c.authorProfile?.avatarUrl || "/avatar-placeholder.png"}
                    className="w-7 h-7 rounded-full object-cover"
                  />

                  <div className="bg-gray-100 rounded-lg px-3 py-1 text-sm">
                    <p className="font-bold">
                      {c.author.firstName} {c.author.lastName}
                    </p>
                    <p>{c.text}</p>
                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      ))}

    </div>
  );
};

export default FeedPage;
