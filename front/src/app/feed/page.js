'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import PostCard from '../../components/post/PostCard';
import FeedCompose from '../../components/post/FeedCompose';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useAppEvents } from '../../context/AppEventsContext';
import { getFeedApi } from '../../lib/api/feed.api';

export default function FeedPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { feedVersion } = useAppEvents();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  const loadFeed = useCallback(() => {
    if (!user) return;
    setFeedLoading(true);
    setNextCursor(null);
    setHasMore(false);
    getFeedApi(user.profileId)
      .then(({ posts, nextCursor }) => {
        setPosts(posts);
        setNextCursor(nextCursor ?? null);
        setHasMore(!!nextCursor);
      })
      .catch(err => setError(err.message))
      .finally(() => setFeedLoading(false));
  }, [user]);

  const loadMore = useCallback(() => {
    if (!user || !nextCursor || loadingMore) return;
    setLoadingMore(true);
    getFeedApi(user.profileId, { cursor: nextCursor })
      .then(({ posts: newPosts, nextCursor: newCursor }) => {
        setPosts(prev => [...prev, ...newPosts]);
        setNextCursor(newCursor ?? null);
        setHasMore(!!newCursor);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoadingMore(false));
  }, [user, nextCursor, loadingMore]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed, feedVersion]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return (
    <AppLayout>
      <header className="feed-header">
        <h1 className="feed-header__title">{t('feed.title')}</h1>
      </header>
      <div className="feed-compose-wrapper">
        <FeedCompose onPostCreated={loadFeed} />
      </div>
      <div className="feed-list">
        {feedLoading && <p className="feed-status">Chargement…</p>}
        {error && <p className="feed-status feed-status--error">{error}</p>}
        {posts.map(post => (
          <PostCard key={post.sk_id} post={post} />
        ))}
        {loadingMore && <p className="feed-status">Chargement…</p>}
        {!feedLoading && !hasMore && posts.length > 0 && (
          <p className="feed-end">Vous êtes à jour ✓</p>
        )}
        <div ref={sentinelRef} />
      </div>
    </AppLayout>
  );
}
