'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, MessageCircle } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar from '../../../components/ui/Avatar';
import CommentCard from '../../../components/post/CommentCard';

// TODO: API - GET /api/posts/:id
const MOCK_POST = {
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
};

// TODO: API - GET /api/posts/:id/comments (avec réponses imbriquées)
const MOCK_COMMENTS = [
  {
    sk_id: 'comment_001',
    sk_authorId: 'user_002',
    txt_content: 'Tellement vrai ! Ces moments de calme le matin sont précieux.',
    sk_parentPostId: 'post_001',
    nb_likesCount: 8,
    nb_commentsCount: 1,
    fl_liked: false,
    ts_createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    author: { sk_id: 'user_002', nm_username: 'theom', url_avatar: null },
    replies: [
      {
        sk_id: 'reply_001',
        sk_authorId: 'user_003',
        txt_content: 'Pareil, ça change tout à la journée.',
        sk_parentPostId: 'comment_001',
        nb_likesCount: 2,
        nb_commentsCount: 0,
        fl_liked: true,
        ts_createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        ts_updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        author: { sk_id: 'user_003', nm_username: 'ines.b', url_avatar: null },
        replies: [],
      },
    ],
  },
  {
    sk_id: 'comment_002',
    sk_authorId: 'user_003',
    txt_content: "Le quartier endormi... c'est exactement ça.",
    sk_parentPostId: 'post_001',
    nb_likesCount: 3,
    nb_commentsCount: 0,
    fl_liked: false,
    ts_createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    author: { sk_id: 'user_003', nm_username: 'ines.b', url_avatar: null },
    replies: [],
  },
  {
    sk_id: 'comment_003',
    sk_authorId: 'user_002',
    txt_content: 'Je me reconnais trop dans ce post.',
    sk_parentPostId: 'post_001',
    nb_likesCount: 5,
    nb_commentsCount: 0,
    fl_liked: false,
    ts_createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    author: { sk_id: 'user_002', nm_username: 'theom', url_avatar: null },
    replies: [],
  },
];

export default function PostDetailPage({ params }) {
  // TODO: utiliser l'id pour récupérer le post réel
  // const { id } = use(params);

  const router = useRouter();
  const [liked, setLiked] = useState(MOCK_POST.fl_liked);
  const [likeCount, setLikeCount] = useState(MOCK_POST.nb_likesCount);

  function handleLike() {
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(prev => !prev);
  }

  return (
    <AppLayout>
      <header className="post-detail__header">
        <button className="post-detail__back-btn" onClick={() => router.back()} aria-label="Retour">
          <ChevronLeft size={22} />
        </button>
        <h1 className="post-detail__title">Post</h1>
      </header>

      <div className="post-detail__post">
        <div className="post-detail__post-header">
          <Avatar name={MOCK_POST.author.nm_username} size="md" />
          <div className="post-detail__post-meta">
            <span className="post-detail__post-name">@{MOCK_POST.author.nm_username}</span>
            <span className="post-detail__post-subline">
              {new Date(MOCK_POST.ts_createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              {' · '}
              {new Date(MOCK_POST.ts_createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <p className="post-detail__post-body">{MOCK_POST.txt_content}</p>

        <div className="post-detail__post-stats">
          <span><strong>{likeCount}</strong> J'aime</span>
          <span><strong>{MOCK_POST.nb_commentsCount}</strong> Commentaires</span>
        </div>

        <div className="post-detail__post-actions">
          <button
            className={`post-card__action${liked ? ' post-card__action--liked' : ''}`}
            onClick={handleLike}
            aria-label="J'aime"
          >
            <Heart size={18} />
            <span>J'aime</span>
          </button>
          <button className="post-card__action" aria-label="Commenter">
            <MessageCircle size={18} />
            <span>Commenter</span>
          </button>
        </div>
      </div>

      <p className="post-detail__comments-header">
        {MOCK_COMMENTS.length} commentaire{MOCK_COMMENTS.length > 1 ? 's' : ''}
      </p>

      <div>
        {MOCK_COMMENTS.map(comment => (
          <CommentCard key={comment.sk_id} comment={comment} />
        ))}
      </div>
    </AppLayout>
  );
}
