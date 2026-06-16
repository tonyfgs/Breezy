'use client';

import AppLayout from '../../components/layout/AppLayout';
import PostCard from '../../components/post/PostCard';
import FeedCompose from '../../components/post/FeedCompose';
import { useLanguage } from '../../context/LanguageContext';

// TODO: API - GET /api/posts/feed
// Structure basée sur les modèles Post + User (profiles) + likes
// Note: le modèle User n'a pas de champ nom affiché distinct de nm_username —
//       à clarifier si on ajoute un nm_displayName dans le profil
const MOCK_FEED = [
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
    author: {
      sk_id: 'user_001',
      nm_username: 'camille',
      url_avatar: null,
    },
  },
  {
    sk_id: 'post_002',
    sk_authorId: 'user_002',
    txt_content: "Quelqu'un d'autre trouve que les playlists d'été commencent un peu tôt ? Il fait 14°C dehors et on me propose déjà du reggaeton.",
    sk_parentPostId: null,
    nb_likesCount: 64,
    nb_commentsCount: 31,
    fl_liked: false,
    ts_createdAt: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    author: {
      sk_id: 'user_002',
      nm_username: 'theom',
      url_avatar: null,
    },
  },
  {
    sk_id: 'post_003',
    sk_authorId: 'user_003',
    txt_content: "Petite balade au marché ce matin. La lumière était parfaite, j'ai pas pu résister. Je trouve que le projet est pas si mal ! Ca a l'air cool...",
    sk_parentPostId: null,
    nb_likesCount: 64,
    nb_commentsCount: 31,
    fl_liked: false,
    ts_createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    author: {
      sk_id: 'user_003',
      nm_username: 'ines.b',
      url_avatar: null,
    },
  },
  {
    sk_id: 'post_004',
    sk_authorId: 'user_001',
    txt_content: 'Premier café sur le balcon, le quartier est encore endormi. Ces dix minutes valent toutes les alarmes du monde.',
    sk_parentPostId: null,
    nb_likesCount: 128,
    nb_commentsCount: 14,
    fl_liked: true,
    ts_createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: {
      sk_id: 'user_001',
      nm_username: 'camille',
      url_avatar: null,
    },
  },
  {
    sk_id: 'post_005',
    sk_authorId: 'user_002',
    txt_content: "Quelqu'un d'autre trouve que les playlists d'été commencent un peu tôt ? Il fait 14°C dehors et on me propose déjà du reggaeton.",
    sk_parentPostId: null,
    nb_likesCount: 64,
    nb_commentsCount: 31,
    fl_liked: false,
    ts_createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    author: {
      sk_id: 'user_002',
      nm_username: 'theom',
      url_avatar: null,
    },
  },
  {
    sk_id: 'post_006',
    sk_authorId: 'user_003',
    txt_content: "Petite balade au marché ce matin. La lumière était parfaite, j'ai pas pu résister. Je trouve que le projet est pas si mal ! Ca a l'air cool...",
    sk_parentPostId: null,
    nb_likesCount: 64,
    nb_commentsCount: 31,
    fl_liked: false,
    ts_createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    author: {
      sk_id: 'user_003',
      nm_username: 'ines.b',
      url_avatar: null,
    },
  },
];

export default function FeedPage() {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <header className="feed-header">
        <h1 className="feed-header__title">{t('feed.title')}</h1>
      </header>
      <div className="feed-compose-wrapper">
        <FeedCompose />
      </div>
      <div className="feed-list">
        {MOCK_FEED.map(post => (
          <PostCard key={post.sk_id} post={post} />
        ))}
      </div>
    </AppLayout>
  );
}
