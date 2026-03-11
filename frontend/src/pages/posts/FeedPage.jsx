import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import HomePageLayout from "../../layouts/HomepageLayout";
import Loading from "../../components/Loading";
import CreatePostCard from "./FeedPageComponents/CreatePostCard";
import CreatePostModal from "./FeedPageComponents/CreatePostModal";
import PostCard from "./FeedPageComponents/PostCard";
import EmptyFeed from "./FeedPageComponents/EmptyFeed";
import { feed } from "../../services/post.service";
import useWebSocket from "./FeedPageComponents/hooks/useWebSocket";
import useComments from "./FeedPageComponents/hooks/useComments";
import usePostActions from "./FeedPageComponents/hooks/usePostActions";
import { Virtuoso } from "react-virtuoso";

const FeedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const { 
    openComments, 
    comments, 
    commentText, 
    loadingComments,
    toggleComments,
    handleAddComment,
    setCommentText,
    addCommentFromWebSocket
  } = useComments();

  const {
    editingPost,
    editText,
    menuOpen,
    setMenuOpen,
    setEditingPost,
    setEditText,
    handleLike,
    handleFollow,
    startEdit,
    saveEdit,
    handleDelete
  } = usePostActions({ posts, setPosts, followingMap, setFollowingMap, user });

  const { wsConnected } = useWebSocket(user, {
    onNewPost: handleNewPost,
    onPostUpdated: handlePostUpdated,
    onPostDeleted: handlePostDeleted,
    onPostLiked: handlePostLiked,
    onNewComment: handleNewComment
  });

  const loadFeed = async (pageNumber = 1) => {
    try {
      const res = await feed(pageNumber);
      console.log('Feed response:', res);
      
      const newPosts = res.data.data.posts;
      const pagination = res.data.data.pagination;

      if (pageNumber === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      setHasNextPage(pagination.hasNextPage);
      setPage(pageNumber);

      const map = {};
      newPosts.forEach(p => {
        map[p.author._id] = p.isFollowingAuthor || false;
      });

      setFollowingMap(prev => ({ ...prev, ...map }));

    } catch (error) {
      console.error("Error loading feed:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      loadFeed(1);
    }
  }, [user]);

  function handleNewPost(newPost) {
    setPosts(prevPosts => {
      const postExists = prevPosts.some(post => post._id === newPost._id);
      if (postExists) return prevPosts;
      
      const postWithAnimation = { ...newPost, isNew: true };
      setTimeout(() => {
        setPosts(current => 
          current.map(p => p._id === newPost._id ? { ...p, isNew: false } : p)
        );
      }, 3000);
      
      return [postWithAnimation, ...prevPosts];
    });
  }

  function handlePostUpdated(updatedPost) {
    if (editingPost === updatedPost._id) return;

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === updatedPost._id
          ? { ...post, ...updatedPost, isUpdated: true }
          : post
      )
    );

    setTimeout(() => {
      setPosts(prev =>
        prev.map(p =>
          p._id === updatedPost._id ? { ...p, isUpdated: false } : p
        )
      );
    }, 2000);
  }

  function handlePostDeleted(postId) {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  }

  function handlePostLiked(likeData) {
    const { postId, userId, liked, user: likeUser } = likeData;
    
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          let updatedLikes;
          if (liked) {
            const userExists = post.likes.some(u => u._id === userId);
            if (!userExists && likeUser) {
              updatedLikes = [...post.likes, {
                _id: userId,
                firstName: likeUser.firstName || 'User',
                lastName: likeUser.lastName || '',
                avatarUrl: likeUser.avatarUrl || null
              }];
            } else {
              updatedLikes = post.likes;
            }
          } else {
            updatedLikes = post.likes.filter(u => u._id !== userId);
          }
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );
  }

  function handleNewComment(commentData) {
    const { postId, comment, commentsCount } = commentData;
    
    addCommentFromWebSocket(postId, comment);

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === postId ? { ...post, commentsCount } : post
      )
    );

    if (openComments[postId]) {
      setTimeout(() => {
        const commentsSection = document.getElementById(`comments-${postId}`);
        if (commentsSection) {
          commentsSection.classList.add('ring-2', 'ring-green-400', 'ring-opacity-50');
          setTimeout(() => {
            commentsSection.classList.remove('ring-2', 'ring-green-400', 'ring-opacity-50');
          }, 500);
        }
      }, 100);
    } else if (comment.author._id !== user?.id) {
      if (Notification.permission === 'granted') {
        new Notification('New Comment', {
          body: `${comment.author.firstName} ${comment.author.lastName} commented on a post`,
          icon: comment.authorProfile?.avatarUrl || '/avatar-placeholder.png'
        });
      }
    }
  }

  const handleToggleComments = (postId) => {
    toggleComments(postId);
  };

  if (loading || !user) return <Loading />;

  return (
    <HomePageLayout>
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        user={user}
        onPostCreated={(newPost) => handleNewPost(newPost)}
      />

      {posts.length === 0 ? (
        <EmptyFeed />
      ) : (
        <div style={{ height: 'calc(100vh - 64px)' }}>
          <Virtuoso
            style={{ 
              height: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="[&::-webkit-scrollbar]:hidden"
            data={[{ type: 'create-post' }, ...posts]} 
            endReached={() => {
              if (hasNextPage && !loadingMore) {
                const nextPage = page + 1;
                setLoadingMore(true);
                loadFeed(nextPage);
              }
            }}
            overscan={200}
            components={{
              Footer: () => (
                <>
                  {loadingMore && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {!hasNextPage && posts.length > 0 && (
                    <div className="text-center py-4 text-gray-500">
                      You've reached the end of the feed!
                    </div>
                  )}
                </>
              )
            }}
            itemContent={(index, item) => {
              if (index === 0 && item.type === 'create-post') {
                return (
                  <div className="mb-4">
                    <CreatePostCard 
                      user={user}
                      wsConnected={wsConnected}
                      onOpenModal={() => setIsCreatePostModalOpen(true)}
                    />
                  </div>
                );
              }
              
              const post = index === 0 ? posts[index] : posts[index - 1];
              if (!post) return null;
              
              return (
                <PostCard
                  post={post}
                  index={index - 1}
                  user={user}
                  isOwner={String(post.author._id) === String(user.id)}
                  hasLiked={post.likes?.some(u => u._id === user.id) || false}
                  followingMap={followingMap}
                  menuOpen={menuOpen}
                  editingPost={editingPost}
                  editText={editText}
                  openComments={openComments}
                  comments={comments}
                  commentText={commentText}
                  loadingComments={loadingComments}
                  onMenuToggle={setMenuOpen}
                  onLike={handleLike}
                  onFollow={handleFollow}
                  onEditStart={startEdit}
                  onEditSave={saveEdit}
                  onEditCancel={() => setEditingPost(null)}
                  onEditChange={setEditText}
                  onDelete={handleDelete}
                  onToggleComments={handleToggleComments}
                  onAddComment={handleAddComment}
                  onCommentChange={setCommentText}
                />
              );
            }}
          />
        </div>
      )}
    </HomePageLayout>
  );
};

export default FeedPage;