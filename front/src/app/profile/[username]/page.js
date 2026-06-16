'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Settings } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar, { getColor } from '../../../components/ui/Avatar';
import PostCard from '../../../components/post/PostCard';
import { useLanguage } from '../../../context/LanguageContext';

// TODO: API - GET /users/:username
const MOCK_PROFILES = {
  camille: {
    sk_id: 'user_001',
    nm_username: 'camille',
    nm_displayName: 'Camille Roche',
    txt_bio: 'Café avant les e-mails. Je collectionne les petites lumières du matin et les bonnes adresses de quartier.',
    url_avatar: null,
    fl_active: true,
    nb_postsCount: 42,
    nb_followersCount: 1208,
    nb_followingCount: 342,
  },
  theom: {
    sk_id: 'user_002',
    nm_username: 'theom',
    nm_displayName: 'Théo Mercier',
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
    nm_displayName: 'Inès Baptiste',
    txt_bio: 'Photographe amateur · nature.',
    url_avatar: null,
    fl_active: true,
    nb_postsCount: 7,
    nb_followersCount: 21,
    nb_followingCount: 15,
  },
  maxg: {
    sk_id: 'user_004',
    nm_username: 'maxg',
    nm_displayName: 'Max G.',
    txt_bio: '',
    url_avatar: null,
    fl_active: true,
    nb_postsCount: 3,
    nb_followersCount: 8,
    nb_followingCount: 12,
  },
  'atelier.lum': {
    sk_id: 'user_005',
    nm_username: 'atelier.lum',
    nm_displayName: 'Atelier Lumière',
    txt_bio: 'Lumière · Photo · Atelier créatif.',
    url_avatar: null,
    fl_active: true,
    nb_postsCount: 27,
    nb_followersCount: 312,
    nb_followingCount: 45,
  },
  noev: {
    sk_id: 'user_006',
    nm_username: 'noev',
    nm_displayName: 'Noé Vidal',
    txt_bio: 'Curiosité et cafés.',
    url_avatar: null,
    fl_active: true,
    nb_postsCount: 11,
    nb_followersCount: 89,
    nb_followingCount: 67,
  },
  salome: {
    sk_id: 'user_007',
    nm_username: 'salome',
    nm_displayName: 'Salomé',
    txt_bio: '',
    url_avatar: null,
    fl_active: true,
    nb_postsCount: 5,
    nb_followersCount: 43,
    nb_followingCount: 22,
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
  const { t, dateLocale } = useLanguage();

  // TODO: avec l'API, "me" sera résolu par GET /users/me (alias JWT côté backend)
  const username = rawUsername === 'me' ? CURRENT_USER_USERNAME : rawUsername;

  const profile = MOCK_PROFILES[username];
  const posts = MOCK_POSTS[username] ?? [];
  const isOwnProfile = username === CURRENT_USER_USERNAME;

  const [following, setFollowing] = useState(false);

  if (!profile) {
    return (
      <AppLayout>
        <p className="search-empty">{t('profile.notFound')}</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <header className="profile-page-header">
        <button className="profile-page-header__back" onClick={() => router.back()} aria-label={t('common.back')}>
          <ChevronLeft size={22} />
        </button>
        <span className="profile-page-header__username">@{profile.nm_username}</span>
        {isOwnProfile && (
          <button className="profile-page-header__settings" onClick={() => router.push('/settings')} aria-label={t('profile.settingsLabel')}>
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
          {isOwnProfile ? (
            <button className="profile-hero__btn profile-hero__btn--edit" onClick={() => router.push('/settings')}>{t('profile.editProfile')}</button>
          ) : (
            <button
              className={`profile-hero__btn${following ? ' profile-hero__btn--following' : ''}`}
              onClick={() => setFollowing(prev => !prev)}
            >
              {following ? t('profile.following') : t('profile.follow')}
            </button>
          )}
        </div>

        <div className="profile-hero__identity">
          <span className="profile-hero__name">{profile.nm_displayName ?? profile.nm_username}</span>
          <span className="profile-hero__handle">@{profile.nm_username}</span>
        </div>

        {profile.txt_bio && (
          <p className="profile-hero__bio">{profile.txt_bio}</p>
        )}

        <div className="profile-hero__stats">
          <span className="profile-hero__stat">
            <strong>{profile.nb_followingCount.toLocaleString(dateLocale)}</strong> {t('profile.followingCount')}
          </span>
          <span className="profile-hero__stat">
            <strong>{profile.nb_followersCount.toLocaleString(dateLocale)}</strong> {t('profile.followersCount')}
          </span>
        </div>
      </div>

      <div className="feed-list">
        {posts.map(post => (
          <PostCard key={post.sk_id} post={post} />
        ))}
      </div>
    </AppLayout>
  );
}
