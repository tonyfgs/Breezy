'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Settings } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar, { getColor } from '../../../components/ui/Avatar';
import PostCard from '../../../components/post/PostCard';

// TODO: API - GET /users/:username
const MOCK_PROFILES = {
  camille: {
    sk_id: 'user_001',
    nm_username: 'camille',
    txt_bio: 'Développeuse front-end · café · photos de balcon.',
    url_avatar: null,
    fl_active: true,
    nb_postsCount: 42,
    nb_followersCount: 128,
    nb_followingCount: 64,
  },
  theom: {
    sk_id: 'user_002',
    nm_username: 'theom',
    txt_bio: 'Designer UI/UX basé à Lyon.',
    url_avatar: null,
    fl_active: true,
    nb_postsCount: 18,
    nb_followersCount: 54,
    nb_followingCount: 32,
  },
  'ines.b': {
    sk_id: 'user_003',
    nm_username: 'ines.b',
    txt_bio: 'Photographe amateur · nature.',
    url_avatar: null,
    fl_active: true,
    nb_postsCount: 7,
    nb_followersCount: 21,
    nb_followingCount: 15,
  },
};

// TODO: API - GET /users/:id/posts
const MOCK_POSTS = {
  camille: [
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
      txt_content: "Journée de refactoring. Supprimer du code, c'est la vraie satisfaction.",
      sk_parentPostId: null,
      nb_likesCount: 47,
      nb_commentsCount: 3,
      fl_liked: false,
      ts_createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      ts_updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      author: { sk_id: 'user_001', nm_username: 'camille', url_avatar: null },
    },
  ],
  theom: [
    {
      sk_id: 'post_004',
      sk_authorId: 'user_002',
      txt_content: 'Nouvelle itération sur la charte graphique. Le vert, ça change tout.',
      sk_parentPostId: null,
      nb_likesCount: 33,
      nb_commentsCount: 5,
      fl_liked: false,
      ts_createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      ts_updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      author: { sk_id: 'user_002', nm_username: 'theom', url_avatar: null },
    },
  ],
  'ines.b': [
    {
      sk_id: 'post_005',
      sk_authorId: 'user_003',
      txt_content: 'La lumière du matin en forêt, rien de comparable.',
      sk_parentPostId: null,
      nb_likesCount: 12,
      nb_commentsCount: 1,
      fl_liked: true,
      ts_createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      ts_updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      author: { sk_id: 'user_003', nm_username: 'ines.b', url_avatar: null },
    },
  ],
};

// TODO: remplacer par le contexte auth
const CURRENT_USER_USERNAME = 'camille';

export default function ProfilePage({ params }) {
  const { username: rawUsername } = use(params);
  const router = useRouter();

  // TODO: avec l'API, "me" sera résolu par GET /users/me (alias JWT côté backend)
  const username = rawUsername === 'me' ? CURRENT_USER_USERNAME : rawUsername;

  const profile = MOCK_PROFILES[username];
  const posts = MOCK_POSTS[username] ?? [];
  const isOwnProfile = username === CURRENT_USER_USERNAME;

  const [following, setFollowing] = useState(false);

  if (!profile) {
    return (
      <AppLayout>
        <p className="search-empty">Utilisateur introuvable.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <header className="profile-page-header">
        <button className="profile-page-header__back" onClick={() => router.back()} aria-label="Retour">
          <ChevronLeft size={22} />
        </button>
        <span className="profile-page-header__username">@{profile.nm_username}</span>
        {isOwnProfile && (
          <button className="profile-page-header__settings" onClick={() => router.push('/settings')} aria-label="Paramètres">
            <Settings size={20} />
          </button>
        )}
      </header>

      <div
        className="profile-banner"
        style={{ '--banner-color': getColor(profile.nm_username) }}
      />

      <div className="profile-hero">
        <div className="profile-hero__top">
          <Avatar name={profile.nm_username} size="lg" />
          <div className="profile-hero__stats">
            <div className="profile-hero__stat">
              <span className="profile-hero__stat-value">{profile.nb_postsCount}</span>
              <span className="profile-hero__stat-label">Posts</span>
            </div>
            <div className="profile-hero__stat">
              <span className="profile-hero__stat-value">{profile.nb_followersCount}</span>
              <span className="profile-hero__stat-label">Abonnés</span>
            </div>
            <div className="profile-hero__stat">
              <span className="profile-hero__stat-value">{profile.nb_followingCount}</span>
              <span className="profile-hero__stat-label">Abonnements</span>
            </div>
          </div>
        </div>

        {profile.txt_bio && (
          <p className="profile-hero__bio">{profile.txt_bio}</p>
        )}

        {isOwnProfile ? (
          <button className="profile-hero__btn profile-hero__btn--edit" onClick={() => router.push('/settings')}>Modifier le profil</button>
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
        {posts.map(post => (
          <PostCard key={post.sk_id} post={post} />
        ))}
      </div>
    </AppLayout>
  );
}
