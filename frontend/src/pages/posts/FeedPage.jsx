import { useEffect, useState, useRef } from "react";
import {
  Heart,
  MessageCircle,
  MoreVertical,
  Check,
  X,
  Send,
  Image as ImageIcon,
  Video,
  Calendar,
  FileText,
  Smile,
  Linkedin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// import Loading from "../../components/Loading";
// import HomePageLayout from "./HomePageLayout"; // Adjust the import path as needed
import {
  feed,
  likePost,
  updatePost,
  deletePost,
} from "../../services/post.service";
import { addComment, getComments } from "../../services/comment.service";
import { toggleFollow } from "../../services/follow.service";
import { useAuth } from "../../context/AuthContext";
import HomePageLayout from "../../layouts/HomepageLayout";
import Loading from "../../components/Loading";

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
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostText, setNewPostText] = useState("");

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
      try {
        const res = await feed();
        const feedPosts = res.data.data;

        setPosts(feedPosts);

        const map = {};
        feedPosts.forEach(p => {
          map[p.author._id] = p.isFollowingAuthor || false;
        });

        setFollowingMap(map);
      } catch (error) {
        console.error("Error loading feed:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadFeed();
    }
  }, [user]);

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

    try { await likePost(postId); } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  /* FOLLOW / UNFOLLOW */
  const handleFollow = async (authorId) => {
    setFollowingMap(prev => ({
      ...prev,
      [authorId]: !prev[authorId],
    }));

    try {
      await toggleFollow(authorId);
    } catch (error) {
      console.error("Error toggling follow:", error);
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
    try {
      const res = await updatePost(postId, editText);
      setPosts(p => p.map(post => post._id === postId ? res.data.data : post));
      setEditingPost(null);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  /* DELETE */
  const handleDelete = async postId => {
    if (window.confirm("Delete this post?")) {
      try {
        await deletePost(postId);
        setPosts(p => p.filter(post => post._id !== postId));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
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
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoadingComments(p => ({ ...p, [postId]: false }));
    }
  };

  const handleAddComment = async postId => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      const res = await addComment(postId, text);

      setComments(p => ({
        ...p,
        [postId]: [res.data.data, ...(p[postId] || [])],
      }));

      setCommentText(p => ({ ...p, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  /* CREATE POST */
  const handleCreatePost = () => {
    // Implement your create post logic here
    setShowCreatePost(false);
    setNewPostText("");
  };

  if (loading || !user) return <Loading />;

  return (
    <HomePageLayout>
      {/* Create Post Box - LinkedIn Style */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatarUrl || "/avatar-placeholder.png"}
            className="w-12 h-12 rounded-full object-cover border"
            alt="Your avatar"
          />
          <button
            onClick={() => setShowCreatePost(true)}
            className="flex-1 text-left border border-gray-300 rounded-full px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Start a post
          </button>
        </div>

        {/* Create Post Modal/Input (simplified version) */}
        {showCreatePost && (
          <div className="mt-4 border-t pt-4">
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full text-blue-500">
                  <ImageIcon size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full text-green-500">
                  <Video size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full text-yellow-500">
                  <Smile size={20} />
                </button>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPostText.trim()}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post Action Buttons */}
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
          <PostActionButton icon={ImageIcon} text="Photo" color="text-blue-500" />
          <PostActionButton icon={Video} text="Video" color="text-green-500" />
          <PostActionButton icon={Calendar} text="Event" color="text-purple-500" />
          <PostActionButton icon={FileText} text="Write article" color="text-orange-500" />
        </div>
      </div>

      {/* Feed Posts */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Linkedin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-500">Follow people to see their posts here</p>
        </div>
      ) : (
        posts.map(post => {
          const isOwner = String(post.author._id) === String(user.id);
          const hasLiked = post.likes.includes(user.id);

          return (
            <div key={post._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-4">
              {/* HEADER */}
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => navigate(`/profile/${post.author._id}`)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={post.authorProfile?.avatarUrl || "/avatar-placeholder.png"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                      alt="avatar"
                    />
                    <div>
                      <p className="font-semibold group-hover:text-blue-600 transition-colors">
                        {post.author.firstName} {post.author.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {post.author.title || "Professional"}
                      </p>
                    </div>
                  </div>

                  {!isOwner && (
                    <button
                      onClick={() => handleFollow(post.author._id)}
                      className={`text-xs px-3 py-1 rounded-full border transition ${
                        followingMap[post.author._id]
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
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
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {menuOpen === post._id && (
                      <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50">
                        <button 
                          onClick={() => startEdit(post)} 
                          className="block w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(post._id)} 
                          className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
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
                      className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingPost(null)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <X size={18}/>
                      </button>
                      <button 
                        onClick={() => saveEdit(post._id)}
                        className="p-1 hover:bg-gray-100 rounded-full text-green-600"
                      >
                        <Check size={18}/>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>
                )}
              </div>

              {/* MEDIA */}
              {post.media?.url && (
                <div className="border-y border-gray-200">
                  {post.postType === "image" ? (
                    <img 
                      src={post.media.url} 
                      className="w-full max-h-[500px] object-contain bg-black/5"
                      alt="Post content"
                    />
                  ) : (
                    <video 
                      controls 
                      className="w-full max-h-[500px] bg-black/5"
                    >
                      <source src={post.media.url} />
                    </video>
                  )}
                </div>
              )}

              {/* LIKES COUNT */}
              <div className="px-4 py-2 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-1">
                    {post.likes.slice(0, 3).map((like, i) => (
                      <div key={i} className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{post.likes.length} likes</span>
                </div>
                <span className="text-sm text-gray-500">{post.commentsCount} comments</span>
              </div>

              {/* ACTIONS */}
              <div className="px-4 py-2 flex justify-around">
                <button 
                  onClick={() => handleLike(post._id)} 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    hasLiked 
                      ? "text-red-500 hover:bg-red-50" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasLiked && "fill-current"}`} />
                  <span className="text-sm font-medium">Like</span>
                </button>

                <button 
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Comment</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
                  <Send className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              {/* COMMENTS */}
              {openComments[post._id] && (
                <div className="bg-gray-50 p-4 border-t border-gray-200">

                  <div className="flex gap-2 mb-4">
                    <img
                      src={user?.avatarUrl || "/avatar-placeholder.png"}
                      className="w-8 h-8 rounded-full object-cover"
                      alt="Your avatar"
                    />
                    <div className="flex-1 flex gap-2">
                      <input
                        value={commentText[post._id] || ""}
                        onChange={e => setCommentText(p => ({ ...p, [post._id]: e.target.value }))}
                        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a comment..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(post._id);
                          }
                        }}
                      />
                      <button 
                        onClick={() => handleAddComment(post._id)}
                        disabled={!commentText[post._id]?.trim()}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={18}/>
                      </button>
                    </div>
                  </div>

                  {loadingComments[post._id] ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {comments[post._id]?.map(c => (
                        <div key={c._id} className="flex gap-2">
                          <img 
                            src={c.authorProfile?.avatarUrl || "/avatar-placeholder.png"} 
                            className="w-8 h-8 rounded-full object-cover"
                            alt={c.author.firstName}
                          />
                          <div className="flex-1">
                            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm">
                              <p className="font-semibold text-sm">
                                {c.author.firstName} {c.author.lastName}
                              </p>
                              <p className="text-sm text-gray-800">{c.text}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-2">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      {comments[post._id]?.length === 0 && (
                        <p className="text-center text-gray-500 py-2">No comments yet</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </HomePageLayout>
  );
};

// Helper component for post action buttons
const PostActionButton = ({ icon: Icon, text, color }) => (
  <button className="flex items-center space-x-2 text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors group">
    <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`} />
    <span className="text-sm hidden md:block">{text}</span>
  </button>
);

export default FeedPage;