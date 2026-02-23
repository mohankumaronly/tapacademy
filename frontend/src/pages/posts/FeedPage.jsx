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
  Linkedin,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  feed,
  likePost,
  updatePost,
  deletePost,
  createPost,
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
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const videoRefs = useRef({});
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [wsConnected, setWsConnected] = useState(false);

  const [openComments, setOpenComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [loadingComments, setLoadingComments] = useState({});

  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editText, setEditText] = useState("");
  
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [modalAnimation, setModalAnimation] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [newPostPreview, setNewPostPreview] = useState(null);
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [createPostMessage, setCreatePostMessage] = useState({ text: "", type: "" });

  // WebSocket connection setup
  useEffect(() => {
    if (!user) return;

    const connectWebSocket = () => {
      // Use VITE_WS_URL from env (ws://localhost:8000)
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
      console.log('Connecting to WebSocket:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setWsConnected(true);
        
        // Clear any reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
        
        // Get token from localStorage (assuming you store it there during login)
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
        
        if (token) {
          wsRef.current.send(JSON.stringify({
            type: 'AUTH',
            token: token
          }));
        } else {
          console.warn('No token found for WebSocket authentication');
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', message.type);
          
          switch (message.type) {
            case 'NEW_POST':
              handleNewPost(message.data);
              break;
            case 'POST_UPDATED':
              handlePostUpdated(message.data);
              break;
            case 'POST_DELETED':
              handlePostDeleted(message.data.postId);
              break;
            default:
              console.log('Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsConnected(false);
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setWsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, 5000);
        }
      };
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [user]);

  // Handle new post from WebSocket
  const handleNewPost = (newPost) => {
    // Check if post already exists to avoid duplicates
    setPosts(prevPosts => {
      const postExists = prevPosts.some(post => post._id === newPost._id);
      if (postExists) return prevPosts;
      
      // Add animation class to new post
      const postWithAnimation = {
        ...newPost,
        isNew: true
      };
      
      // Remove animation class after animation completes
      setTimeout(() => {
        setPosts(current => 
          current.map(p => 
            p._id === newPost._id ? { ...p, isNew: false } : p
          )
        );
      }, 3000);
      
      return [postWithAnimation, ...prevPosts];
    });

    // Update following map for the new post's author
    setFollowingMap(prev => ({
      ...prev,
      [newPost.author._id]: newPost.isFollowingAuthor || false
    }));

    // Show notification (optional)
    if (Notification.permission === 'granted') {
      new Notification('New Post', {
        body: `${newPost.author.firstName} ${newPost.author.lastName} posted something new`,
        icon: newPost.authorProfile?.avatarUrl || '/avatar-placeholder.png'
      });
    }
  };

  // Handle post update from WebSocket
  const handlePostUpdated = (updatedPost) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id
          ? { ...updatedPost, isUpdated: true }
          : post
      )
    );
  };

  // Handle post deletion from WebSocket
  const handlePostDeleted = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {}); 
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "0px"
      }
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [posts]); 

  useEffect(() => {
    const close = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    const closeModal = e => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleCloseModal();
      }
    };
    
    if (isCreatePostModalOpen) {
      setTimeout(() => setModalAnimation("animate-in fade-in zoom-in duration-300"), 100);
      document.addEventListener("mousedown", closeModal);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener("mousedown", closeModal);
      document.body.style.overflow = 'unset';
    };
  }, [isCreatePostModalOpen]);

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

  const handleLike = async (postId) => {
    const button = document.getElementById(`like-btn-${postId}`);
    if (button) {
      button.classList.add('scale-125');
      setTimeout(() => button.classList.remove('scale-125'), 200);
    }

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

    try { 
      await likePost(postId); 
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

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

  const toggleComments = async postId => {
    const button = document.getElementById(`comment-btn-${postId}`);
    if (button) {
      button.classList.add('scale-125');
      setTimeout(() => button.classList.remove('scale-125'), 200);
    }

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setNewPostMedia(file);
    const url = URL.createObjectURL(file);
    setNewPostPreview({
      url,
      type: file.type.startsWith("video") ? "video" : "image",
    });
  };

  const removeNewPostMedia = () => {
    setNewPostMedia(null);
    setNewPostPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetCreatePost = () => {
    setNewPostText("");
    removeNewPostMedia();
    setCreatePostMessage({ text: "", type: "" });
  };

  const openCreatePostModal = () => {
    setIsCreatePostModalOpen(true);
    resetCreatePost();
  };

  const handleCloseModal = () => {
    setModalAnimation("animate-out fade-out zoom-out duration-200");
    setTimeout(() => {
      setIsCreatePostModalOpen(false);
      setModalAnimation("");
      resetCreatePost();
    }, 200);
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim() && !newPostMedia) {
      return setCreatePostMessage({ 
        text: "Please add some text or media", 
        type: "error" 
      });
    }

    const payload = new FormData();
    payload.append("text", newPostText);
    if (newPostMedia) payload.append("media", newPostMedia);

    try {
      setCreatePostLoading(true);
      setCreatePostMessage({ text: "", type: "" });
      
      const res = await createPost(payload);
      
      setCreatePostMessage({ 
        text: "Post created successfully!", 
        type: "success" 
      });
      
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
      
    } catch (error) {
      console.error("Error creating post:", error);
      setCreatePostMessage({ 
        text: "Failed to create post. Try again.", 
        type: "error" 
      });
    } finally {
      setCreatePostLoading(false);
    }
  };

  if (loading || !user) return <Loading />;

  return (
    <HomePageLayout>
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatarUrl || "/avatar-placeholder.png"}
            className="w-12 h-12 rounded-full object-cover border"
            alt="Your avatar"
          />
          <button
            onClick={openCreatePostModal}
            className="flex-1 text-left border border-gray-300 rounded-full px-4 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Start a post
          </button>
        </div>

        {/* WebSocket connection status indicator (optional) */}
        {!wsConnected && (
          <div className="mt-2 text-xs text-yellow-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            Reconnecting to real-time updates...
          </div>
        )}

        <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
          <PostActionButton 
            icon={ImageIcon} 
            text="Photo" 
            color="text-blue-500" 
            onClick={openCreatePostModal}
          />
          <PostActionButton 
            icon={Video} 
            text="Video" 
            color="text-green-500"
            onClick={openCreatePostModal}
          />
          <PostActionButton icon={Calendar} text="Event" color="text-purple-500" />
          <PostActionButton icon={FileText} text="Write article" color="text-orange-500" />
        </div>
      </div>

      {isCreatePostModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div 
            ref={modalRef}
            className={`bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col ${modalAnimation}`}
          >
            {/* ... rest of the modal JSX remains the same ... */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-800">Create a post</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:rotate-90 duration-200"
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

              {createPostMessage.text && (
                <div className={`mb-3 text-xs font-medium px-3 py-2 rounded-full ${
                  createPostMessage.type === "success" 
                    ? "bg-green-100 text-green-600" 
                    : "bg-red-100 text-red-600"
                }`}>
                  {createPostMessage.text}
                </div>
              )}

              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full text-lg text-gray-800 placeholder-gray-400 border-none focus:ring-0 resize-none outline-none min-h-[120px]"
                autoFocus
              />

              {newPostPreview && (
                <div className="mt-4 animate-in fade-in zoom-in duration-300">
                  <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <button
                      type="button"
                      onClick={removeNewPostMedia}
                      className="absolute top-2 right-2 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition hover:scale-110 duration-200"
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
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all hover:scale-110 duration-200"
                    title="Add Image"
                  >
                    <ImageIcon size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-all hover:scale-110 duration-200"
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

              <div className="flex items-center justify-end gap-3 px-6 py-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition hover:scale-105 duration-200"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleCreatePost}
                  disabled={createPostLoading || (!newPostText.trim() && !newPostMedia)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                    createPostLoading || (!newPostText.trim() && !newPostMedia)
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 hover:scale-105 duration-200"
                  }`}
                >
                  {createPostLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center animate-in fade-in duration-500">
          <Linkedin className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-bounce" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-500">Follow people to see their posts here</p>
        </div>
      ) : (
        posts.map((post, index) => {
          const isOwner = String(post.author._id) === String(user.id);
          const hasLiked = post.likes.includes(user.id);

          return (
            <div 
              key={post._id} 
              className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                post.isNew ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50/30' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {post.isNew && (
                <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-t-lg">
                  New Post
                </div>
              )}
              {/* ... rest of the post JSX remains the same ... */}
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => navigate(`/profile/${post.author._id}`)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img
                      src={post.authorProfile?.avatarUrl || "/avatar-placeholder.png"}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-colors group-hover:scale-105 duration-200"
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
                      className={`text-xs px-3 py-1 rounded-full border transition-all hover:scale-105 duration-200 ${
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
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors hover:rotate-90 duration-200"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {menuOpen === post._id && (
                      <div 
                        ref={menuRef} 
                        className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      >
                        <button 
                          onClick={() => startEdit(post)} 
                          className="block w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors hover:pl-6 duration-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(post._id)} 
                          className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors hover:pl-6 duration-200"
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
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => setEditingPost(null)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-all hover:rotate-90 duration-200"
                      >
                        <X size={18}/>
                      </button>
                      <button 
                        onClick={() => saveEdit(post._id)}
                        className="p-1 hover:bg-gray-100 rounded-full text-green-600 transition-all hover:scale-110 duration-200"
                      >
                        <Check size={18}/>
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>
                )}
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
                      ref={el => videoRefs.current[post._id] = el}
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

              <div className="px-4 py-2 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center space-x-1">
                  <div className="flex -space-x-1">
                    {post.likes.slice(0, 3).map((like, i) => (
                      <div 
                        key={i} 
                        className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white animate-in fade-in duration-300"
                        style={{ animationDelay: `${i * 50}ms` }}
                      ></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
                </div>
                <span className="text-sm text-gray-500">{post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}</span>
              </div>

              <div className="px-4 py-2 flex justify-around">
                <button 
                  id={`like-btn-${post._id}`}
                  onClick={() => handleLike(post._id)} 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    hasLiked 
                      ? "text-red-500 hover:bg-red-50" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Heart className={`w-5 h-5 transition-all duration-200 ${hasLiked && "fill-current scale-110"}`} />
                  <span className="text-sm font-medium">Like</span>
                </button>

                <button 
                  id={`comment-btn-${post._id}`}
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5 transition-transform duration-200" />
                  <span className="text-sm font-medium">Comment</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-200 hover:scale-105">
                  <Send className="w-5 h-5 transition-transform duration-200" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              {openComments[post._id] && (
                <div className="bg-gray-50 p-4 border-t border-gray-200 animate-in slide-in-from-bottom-2 duration-300">
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
                        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:border-blue-300"
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
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110 duration-200"
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
                      {comments[post._id]?.map((c, idx) => (
                        <div 
                          key={c._id} 
                          className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <img 
                            src={c.authorProfile?.avatarUrl || "/avatar-placeholder.png"} 
                            className="w-8 h-8 rounded-full object-cover"
                            alt={c.author.firstName}
                          />
                          <div className="flex-1">
                            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
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

const PostActionButton = ({ icon: Icon, text, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center space-x-2 text-gray-500 hover:bg-gray-50 px-4 py-2 rounded-md transition-all group hover:scale-105 duration-200"
  >
    <Icon className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform duration-200`} />
    <span className="text-sm hidden md:block">{text}</span>
  </button>
);

export default FeedPage;