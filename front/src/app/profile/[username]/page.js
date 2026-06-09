'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar, { getColor } from '../../../components/ui/Avatar';
import PostCard from '../../../components/post/PostCard';

// TODO: API - GET /users/:username
const MOCK_PROFILE = {
  sk_id: 'user_001',
  nm_username: 'camille',
  txt_bio: 'Développeuse front-end · café · photos de balcon.',
  url_avatar: null,
  fl_active: true,
  ts_createdAt: '2025-01-15T10:00:00.000Z',
  nb_postsCount: 42,
  nb_followersCount: 128,
  nb_followingCount: 64,
};

// TODO: API - GET /users/:id/posts
const MOCK_POSTS = [
  {
    sk_id: 'post_001',
    sk_authorId: 'user_001',
    txt_content: 'Premier café sur le balcon, le quartier est encore endormi. Ces dix minutes valent toutes les alarmes du monde.',
    sk_parentPostId: null,
    nb_likesCount: 128,
    nb_commentsCount: 14,
    fl_liked: true,
    ts_createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    author: { sk_id: 'user_001', nm_username: 'camille', url_avatar: null },
  },
  {
    sk_id: 'post_003',
    sk_authorId: 'user_001',
    txt_content: 'Journée de refactoring. Supprimer du code, c\'est la vraie satisfaction.',
    sk_parentPostId: null,
    nb_likesCount: 47,
    nb_commentsCount: 3,
    fl_liked: false,
    ts_createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    author: { sk_id: 'user_001', nm_username: 'camille', url_avatar: null },
  },
];

// TODO: remplacer par le contexte auth
const CURRENT_USER_USERNAME = 'moi';

export default function ProfilePage({ params }) {
  // TODO: const { username } = use(params);
  const router = useRouter();
  const isOwnProfile = MOCK_PROFILE.nm_username === CURRENT_USER_USERNAME;
  const [following, setFollowing] = useState(false);

  return (
    <AppLayout>
      <header className="profile-page-header">
        <button className="profile-page-header__back" onClick={() => router.back()} aria-label="Retour">
          <ChevronLeft size={22} />
        </button>
        <span className="profile-page-header__username">@{MOCK_PROFILE.nm_username}</span>
      </header>

      <div
        className="profile-banner"
        style={{ '--banner-color': getColor(MOCK_PROFILE.nm_username) }}
      />

      <div className="profile-hero">
        <div className="profile-hero__top">
          <Avatar name={MOCK_PROFILE.nm_username} size="lg" />
          <div className="profile-hero__stats">
            <div className="profile-hero__stat">
              <span className="profile-hero__stat-value">{MOCK_PROFILE.nb_postsCount}</span>
              <span className="profile-hero__stat-label">Posts</span>
            </div>
            <div className="profile-hero__stat">
              <span className="profile-hero__stat-value">{MOCK_PROFILE.nb_followersCount}</span>
              <span className="profile-hero__stat-label">Abonnés</span>
            </div>
            <div className="profile-hero__stat">
              <span className="profile-hero__stat-value">{MOCK_PROFILE.nb_followingCount}</span>
              <span className="profile-hero__stat-label">Abonnements</span>
            </div>
          </div>
        </div>

        {MOCK_PROFILE.txt_bio && (
          <p className="profile-hero__bio">{MOCK_PROFILE.txt_bio}</p>
        )}

        {isOwnProfile ? (
          <button className="profile-hero__btn profile-hero__btn--edit">Modifier le profil</button>
        ) : (
          <button
            className={`profile-hero__btn${following ? ' profile-hero__btn--following' : ''}`}
            onClick={() => setFollowing(prev => !prev)}
          >
            {following ? 'Abonné' : "S'abonner"}
          </button>
        )}
      </div>

      <div className="feed-list">
        {MOCK_POSTS.map(post => (
          <PostCard key={post.sk_id} post={post} />
        ))}
      </div>
    </AppLayout>
  );
}
