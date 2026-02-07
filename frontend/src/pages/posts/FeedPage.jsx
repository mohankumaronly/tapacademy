import { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Check,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Loading from "../../components/Loading";
import {
  feed,
  likePost,
  updatePost,
  deletePost,
} from "../../services/post.service";
import { addComment, getComments } from "../../services/comment.service";
import { useAuth } from "../../context/AuthContext";

const FeedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");

  /* ---------------- LOAD FEED ---------------- */

  useEffect(() => {
    feed()
      .then(res => setPosts(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- LIKE (OPTIMISTIC) ---------------- */

  const handleLike = async (postId) => {
    setPosts(p =>
      p.map(post =>
        post._id === postId
          ? { ...post, likes: [...post.likes, user.id] }
          : post
      )
    );

    try {
      const res = await likePost(postId);

      setPosts(p =>
        p.map(post =>
          post._id === postId
            ? { ...post, likes: Array(res.data.likesCount).fill(1) }
            : post
        )
      );
    } catch {
      console.error("Like failed");
    }
  };

  /* ---------------- COMMENTS ---------------- */

  const toggleComments = async (postId) => {
    setOpenComments(p => ({ ...p, [postId]: !p[postId] }));

    if (comments[postId]) return;

    setLoadingComments(p => ({ ...p, [postId]: true }));

    try {
      const res = await getComments(postId);
      setComments(p => ({ ...p, [postId]: res.data.data }));
    } finally {
      setLoadingComments(p => ({ ...p, [postId]: false }));
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    const res = await addComment(postId, text);

    setComments(p => ({
      ...p,
      [postId]: [res.data.data, ...(p[postId] || [])],
    }));

    setCommentText(p => ({ ...p, [postId]: "" }));
  };

  /* ---------------- EDIT ---------------- */

  const startEdit = (post) => {
    setEditingPost(post._id);
    setEditText(post.text);
    setMenuOpen(null);
  };

  const saveEdit = async (postId) => {
    if (!editText.trim()) return;

    const res = await updatePost(postId, editText);

    setPosts(p =>
      p.map(post => (post._id === postId ? res.data.data : post))
    );

    setEditingPost(null);
    setEditText("");
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (postId) => {
    await deletePost(postId);
    setPosts(p => p.filter(post => post._id !== postId));
  };

  /* ---------------- UI ---------------- */

  if (loading || !user) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">

      {posts.map(post => {
        const isOwner = String(post.author._id) === String(user.id);

        return (
          <div key={post._id} className="bg-white shadow rounded-lg p-4">

            {/* HEADER */}
            <div className="flex justify-between mb-2">

              <div
                onClick={() => navigate(`/profile/${post.author._id}`)}
                className="flex items-center gap-3 cursor-pointer hover:opacity-80"
              >
                <img
                  src={post.authorProfile?.avatarUrl || "/avatar-placeholder.png"}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="avatar"
                />
                <p className="font-medium">
                  {post.author.firstName} {post.author.lastName}
                </p>
              </div>

              {isOwner && (
                <div className="relative">

                  <button
                    onClick={() =>
                      setMenuOpen(menuOpen === post._id ? null : post._id)
                    }
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuOpen === post._id && (
                    <div className="absolute right-0 bg-white shadow rounded text-sm z-50">

                      <button
                        onClick={() => startEdit(post)}
                        className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(post._id)}
                        className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                      >
                        Delete
                      </button>

                    </div>
                  )}
                </div>
              )}
            </div>

            {/* TEXT */}
            {editingPost === post._id ? (
              <div className="flex gap-2 mb-3">
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className="flex-1 border rounded px-3 py-1 text-sm"
                />
                <button onClick={() => saveEdit(post._id)}>
                  <Check size={18} />
                </button>
                <button onClick={() => setEditingPost(null)}>
                  <X size={18} />
                </button>
              </div>
            ) : (
              post.text && <p className="mb-3 text-gray-800">{post.text}</p>
            )}

            {/* MEDIA */}
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

            {/* ACTIONS */}
            <div className="flex gap-4 mt-3">

              <button
                onClick={() => handleLike(post._id)}
                className="flex items-center gap-1 text-sm hover:text-red-600 active:scale-125 transition"
              >
                <Heart
                  className={`w-5 h-5 ${
                    post.likes.length ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {post.likes.length}
              </button>

              <button
                onClick={() => toggleComments(post._id)}
                className="flex items-center gap-1 text-sm hover:text-blue-600"
              >
                <MessageCircle className="w-5 h-5" />
                {post.commentsCount}
              </button>

            </div>

            {/* COMMENTS */}
            {openComments[post._id] && (
              <div className="mt-3 border-t pt-3 space-y-3">

                <div className="flex gap-2">
                  <input
                    value={commentText[post._id] || ""}
                    onChange={e =>
                      setCommentText(p => ({
                        ...p,
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
                  <div key={c._id} className="flex gap-2">

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
        );
      })}
    </div>
  );
};

export default FeedPage;
