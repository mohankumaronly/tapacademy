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
import { toggleFollow } from "../../services/follow.service";
import { useAuth } from "../../context/AuthContext";

const FeedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const menuRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");

  /* CLOSE MENU */
  useEffect(() => {
    const close = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* LOAD FEED */
  useEffect(() => {
    const loadFeed = async () => {
      const res = await feed();
      const feedPosts = res.data.data;

      setPosts(feedPosts);

      const map = {};
      feedPosts.forEach(p => {
        map[p.author._id] = p.isFollowingAuthor || false;
      });

      setFollowingMap(map);
      setLoading(false);
    };

    loadFeed();
  }, []);

  /* LIKE */
  const handleLike = async (postId) => {
    setPosts(p =>
      p.map(post =>
        post._id === postId
          ? {
              ...post,
              likes: post.likes.includes(user.id)
                ? post.likes.filter(id => id !== user.id)
                : [...post.likes, user.id],
            }
          : post
      )
    );

    try { await likePost(postId); } catch {}
  };

  /* FOLLOW / UNFOLLOW */
  const handleFollow = async (authorId) => {
    setFollowingMap(prev => ({
      ...prev,
      [authorId]: !prev[authorId],
    }));

    try {
      await toggleFollow(authorId);
    } catch {
      setFollowingMap(prev => ({
        ...prev,
        [authorId]: !prev[authorId],
      }));
    }
  };

  /* EDIT */
  const startEdit = post => {
    setEditingPost(post._id);
    setEditText(post.text);
    setMenuOpen(null);
  };

  const saveEdit = async postId => {
    if (!editText.trim()) return;
    const res = await updatePost(postId, editText);
    setPosts(p => p.map(post => post._id === postId ? res.data.data : post));
    setEditingPost(null);
  };

  /* DELETE */
  const handleDelete = async postId => {
    if (window.confirm("Delete this post?")) {
      await deletePost(postId);
      setPosts(p => p.filter(post => post._id !== postId));
    }
  };

  /* COMMENTS */
  const toggleComments = async postId => {
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

  const handleAddComment = async postId => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    const res = await addComment(postId, text);

    setComments(p => ({
      ...p,
      [postId]: [res.data.data, ...(p[postId] || [])],
    }));

    setCommentText(p => ({ ...p, [postId]: "" }));
  };

  if (loading || !user) return <Loading />;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">

      {posts.map(post => {
        const isOwner = String(post.author._id) === String(user.id);
        const hasLiked = post.likes.includes(user.id);

        return (
          <div key={post._id} className="bg-white border rounded-xl shadow-sm">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4">

              <div className="flex items-center gap-3">

                <div
                  onClick={() => navigate(`/profile/${post.author._id}`)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <img
                    src={post.authorProfile?.avatarUrl || "/avatar-placeholder.png"}
                    className="w-10 h-10 rounded-full object-cover border"
                    alt="avatar"
                  />
                  <p className="font-semibold">
                    {post.author.firstName} {post.author.lastName}
                  </p>
                </div>

                {!isOwner && (
                  <button
                    onClick={() => handleFollow(post.author._id)}
                    className={`text-xs px-3 py-1 rounded-full border transition ${
                      followingMap[post.author._id]
                        ? "bg-gray-200 text-gray-700"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {followingMap[post.author._id] ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === post._id ? null : post._id)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {menuOpen === post._id && (
                    <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow z-50">
                      <button onClick={() => startEdit(post)} className="block w-full px-4 py-2 text-left hover:bg-gray-50">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(post._id)} className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* TEXT */}
            <div className="px-4 pb-3">
              {editingPost === post._id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingPost(null)}><X size={18}/></button>
                    <button onClick={() => saveEdit(post._id)}><Check size={18}/></button>
                  </div>
                </div>
              ) : (
                post.text && <p>{post.text}</p>
              )}
            </div>

            {/* MEDIA */}
            {post.media?.url && (
              post.postType === "image" ? (
                <img src={post.media.url} className="w-full max-h-[500px] object-contain" />
              ) : (
                <video controls className="w-full max-h-[500px]">
                  <source src={post.media.url} />
                </video>
              )
            )}

            {/* ACTIONS */}
            <div className="p-4 flex gap-6">
              <button onClick={() => handleLike(post._id)} className={hasLiked ? "text-red-500" : ""}>
                <Heart className={`w-6 h-6 ${hasLiked && "fill-current"}`} /> {post.likes.length}
              </button>

              <button onClick={() => toggleComments(post._id)}>
                <MessageCircle className="w-6 h-6" /> {post.commentsCount}
              </button>
            </div>

            {/* COMMENTS */}
            {openComments[post._id] && (
              <div className="bg-gray-50 p-4 border-t">

                <div className="flex gap-2 mb-3">
                  <input
                    value={commentText[post._id] || ""}
                    onChange={e => setCommentText(p => ({ ...p, [post._id]: e.target.value }))}
                    className="flex-1 border rounded-full px-4 py-1.5 text-sm"
                    placeholder="Add comment..."
                  />
                  <button onClick={() => handleAddComment(post._id)}>
                    <Send size={18}/>
                  </button>
                </div>

                {loadingComments[post._id]
                  ? <p className="text-sm text-gray-400">Loading...</p>
                  : comments[post._id]?.map(c => (
                    <div key={c._id} className="flex gap-2 mb-2">
                      <img src={c.authorProfile?.avatarUrl || "/avatar-placeholder.png"} className="w-7 h-7 rounded-full" />
                      <div className="bg-white px-3 py-1 rounded-xl text-sm">
                        <strong>{c.author.firstName}</strong> {c.text}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

          </div>
        );
      })}

    </div>
  );
};

export default FeedPage;
