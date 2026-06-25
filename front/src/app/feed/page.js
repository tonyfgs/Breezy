'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import PostCard from '../../components/post/PostCard';
import FeedCompose from '../../components/post/FeedCompose';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getFeedApi } from '../../lib/api/feed.api';

export default function FeedPage() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [user, authLoading, router]);

  const loadFeed = useCallback(() => {
    if (!user) return;
    setFeedLoading(true);
    getFeedApi(user.profileId)
      .then(({ posts }) => setPosts(posts))
      .catch(err => setError(err.message))
      .finally(() => setFeedLoading(false));
  }, [user]);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

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
      </div>
    </AppLayout>
  );
}
