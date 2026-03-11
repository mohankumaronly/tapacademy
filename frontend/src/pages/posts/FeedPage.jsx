import { useEffect, useState } from "react";
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

const FeedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

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

    if (user) loadFeed();
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

  if (loading || !user) return <Loading />;

  return (
    <HomePageLayout>
      <CreatePostCard 
        user={user}
        wsConnected={wsConnected}
        onOpenModal={() => setIsCreatePostModalOpen(true)}
      />

      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        user={user}
      />

      {posts.length === 0 ? (
        <EmptyFeed />
      ) : (
        posts.map((post, index) => (
          <PostCard
            key={post._id}
            post={post}
            index={index}
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
            onToggleComments={toggleComments}
            onAddComment={handleAddComment}
            onCommentChange={setCommentText}
          />
        ))
      )}
    </HomePageLayout>
  );
};

export default FeedPage;