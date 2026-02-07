import { useEffect, useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Check,
  X,
  Send
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
  const menuRef = useRef(null); 

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    feed()
      .then(res => setPosts(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = async (postId) => {
    setPosts(p =>
      p.map(post =>
        post._id === postId
          ? { 
              ...post, 
              likes: post.likes.includes(user.id) 
                ? post.likes.filter(id => id !== user.id) 
                : [...post.likes, user.id] 
            }
          : post
      )
    );
    try { await likePost(postId); } catch { console.error("Like failed"); }
  };

  const startEdit = (post) => {
    setEditingPost(post._id);
    setEditText(post.text);
    setMenuOpen(null);
  };

  const saveEdit = async (postId) => {
    if (!editText.trim()) return;
    const res = await updatePost(postId, editText);
    setPosts(p => p.map(post => (post._id === postId ? res.data.data : post)));
    setEditingPost(null);
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Delete this post?")) {
      await deletePost(postId);
      setPosts(p => p.filter(post => post._id !== postId));
    }
  };

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
    setComments(p => ({ ...p, [postId]: [res.data.data, ...(p[postId] || [])] }));
    setCommentText(p => ({ ...p, [postId]: "" }));
  };

  if (loading || !user) return <Loading />;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      {posts.map(post => {
        const isOwner = String(post.author._id) === String(user.id);
        const hasLiked = post.likes.includes(user.id);

        return (
          <div key={post._id} className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex justify-between items-center p-4">
              <div
                onClick={() => navigate(`/profile/${post.author._id}`)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={post.authorProfile?.avatarUrl || "/avatar-placeholder.png"}
                  className="w-10 h-10 rounded-full object-cover border"
                  alt="avatar"
                />
                <p className="font-semibold text-gray-900">
                  {post.author.firstName} {post.author.lastName}
                </p>
              </div>

              {isOwner && (
                <div className="relative">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full transition"
                    onClick={() => setMenuOpen(menuOpen === post._id ? null : post._id)}
                  >
                    <MoreVertical size={20} className="text-gray-500" />
                  </button>

                  {menuOpen === post._id && (
                    <div 
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-32 bg-white border shadow-lg rounded-lg z-50 py-1"
                    >
                      <button
                        onClick={() => startEdit(post)}
                        className="block px-4 py-2 hover:bg-gray-50 w-full text-left text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="block px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-4 pb-3">
              {editingPost === post._id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    rows="3"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingPost(null)} className="text-gray-500"><X size={18}/></button>
                    <button onClick={() => saveEdit(post._id)} className="text-green-600"><Check size={18}/></button>
                  </div>
                </div>
              ) : (
                post.text && <p className="text-gray-800 text-[15px]">{post.text}</p>
              )}
            </div>

            {post.media?.url && (
              <div className="bg-black flex items-center justify-center">
                {post.postType === "image" ? (
                  <img src={post.media.url} className="w-full h-auto max-h-[500px] object-contain" alt="post" />
                ) : (
                  <video controls className="w-full max-h-[500px]">
                    <source src={post.media.url} />
                  </video>
                )}
              </div>
            )}
            
            <div className="p-4 flex gap-6">
              <button
                onClick={() => handleLike(post._id)}
                className={`flex items-center gap-2 text-sm font-medium ${hasLiked ? "text-red-500" : "text-gray-600"}`}
              >
                <Heart className={`w-6 h-6 ${hasLiked ? "fill-current" : ""}`} />
                {post.likes.length}
              </button>
              <button
                onClick={() => toggleComments(post._id)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600"
              >
                <MessageCircle className="w-6 h-6" />
                {post.commentsCount}
              </button>
            </div>

            {openComments[post._id] && (
              <div className="bg-gray-50 p-4 border-t">
                <div className="flex gap-2 mb-4">
                  <input
                    value={commentText[post._id] || ""}
                    onChange={e => setCommentText(p => ({ ...p, [post._id]: e.target.value }))}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white border rounded-full px-4 py-1.5 text-sm outline-none"
                  />
                  <button onClick={() => handleAddComment(post._id)} className="text-blue-600 px-2">
                    <Send size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  {loadingComments[post._id] ? <p className="text-xs text-gray-400 text-center">Loading...</p> : 
                    comments[post._id]?.map(c => (
                      <div key={c._id} className="flex gap-2">
                        <img src={c.authorProfile?.avatarUrl || "/avatar-placeholder.png"} className="w-7 h-7 rounded-full object-cover" />
                        <div className="bg-white p-2 rounded-2xl rounded-tl-none border text-sm shadow-sm">
                          <p className="font-bold text-[11px]">{c.author.firstName} {c.author.lastName}</p>
                          <p className="text-gray-700">{c.text}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FeedPage;