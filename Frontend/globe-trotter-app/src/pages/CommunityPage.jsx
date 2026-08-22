import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import { fetchCommunityPosts, togglePostLike, addPostComment } from '../services/api';

const CATEGORIES = ['All', 'Heritage', 'Adventure', 'Culture', 'Food'];

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const params = activeCategory !== 'All' ? { category: activeCategory } : {};
        const data = await fetchCommunityPosts(params);
        if (isMounted && data?.posts) {
          setPosts(data.posts);
        }
      } catch (err) {
        console.warn('Error loading community posts:', err.message);
        if (isMounted) setError('Unable to load community posts.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPosts();
    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const handleLikePost = async (postId) => {
    try {
      const result = await togglePostLike(postId);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const isLikedNow = result.isLiked;
            return {
              ...p,
              isLikedByCurrentUser: isLikedNow,
              likesCount: isLikedNow ? (p.likesCount || 0) + 1 : Math.max(0, (p.likesCount || 0) - 1),
            };
          }
          return p;
        })
      );
    } catch (err) {
      console.warn('Failed to toggle like:', err.message);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      setIsSubmittingComment(true);
      await addPostComment(postId, commentText);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p))
      );
      setCommentText('');
      setActiveCommentPostId(null);
    } catch (err) {
      console.warn('Failed to add comment:', err.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface relative pb-24">
      <Header />

      <main className="pt-20 px-margin-mobile max-w-max-width mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-1 mt-2">
          <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface">
            Traveler Community 🌍
          </h2>
          <p className="font-body-md text-on-surface-variant">
            Real stories, reviews, and travel tips from database
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-label-md transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-error bg-error/10 rounded-xl text-sm">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center bg-surface-container rounded-2xl">
            <p className="font-body-md text-on-surface-variant">No community posts found for "{activeCategory}".</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-surface-container rounded-2xl p-5 shadow-sm border border-outline-variant/20 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden border border-primary/20 shrink-0">
                    {post.user?.photoUrl ? (
                      <img src={post.user.photoUrl} alt={post.user.firstName} className="w-full h-full object-cover" />
                    ) : (
                      post.user?.firstName?.[0] || 'T'
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-label-md text-on-surface font-bold">
                      {post.user?.firstName} {post.user?.lastName}
                    </h4>
                    <span className="text-xs text-on-surface-variant">
                      {new Date(post.createdAt).toLocaleDateString()} {post.city?.name ? `• ${post.city.name}` : ''}
                    </span>
                  </div>
                  {post.category && (
                    <span className="ml-auto text-xs font-label-sm text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  )}
                </div>

                <h3 className="font-headline-md text-headline-md text-on-surface">{post.title}</h3>
                <p className="font-body-sm text-on-surface-variant">{post.content}</p>

                {post.images && post.images.length > 0 && (
                  <div className="w-full h-52 rounded-xl overflow-hidden mt-1">
                    <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {post.trip && (
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-center justify-between text-xs mt-1">
                    <span className="font-label-sm text-on-surface">🗺️ Linked Trip: {post.trip.name}</span>
                    <span className="text-primary font-bold">{post.trip.status}</span>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-on-surface-variant pt-2 border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-1 cursor-pointer transition-colors ${
                      post.isLikedByCurrentUser ? 'text-error font-bold' : 'hover:text-error'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {post.isLikedByCurrentUser ? 'favorite' : 'favorite_border'}
                    </span>
                    {post.likesCount || 0} Likes
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1 hover:text-primary cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat</span>
                    {post.commentsCount || 0} Comments
                  </button>
                </div>

                {activeCommentPostId === post.id && (
                  <div className="flex gap-2 pt-2 border-t border-outline-variant/10">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-1 bg-surface-container-low text-xs p-2.5 rounded-xl border border-outline-variant/20 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(post.id)}
                      disabled={isSubmittingComment || !commentText.trim()}
                      className="px-3 py-2 bg-electric-sky text-on-primary text-xs font-label-md rounded-xl shadow hover:bg-primary transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmittingComment ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
