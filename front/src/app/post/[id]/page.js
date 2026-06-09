'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, MessageCircle, Flag } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar from '../../../components/ui/Avatar';
import CommentCard from '../../../components/post/CommentCard';
import CommentModal from '../../../components/modals/CommentModal';
import ReportModal from '../../../components/modals/ReportModal';

const SHARED_COMMENTS = [
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

// TODO: API - GET /posts/:id
const MOCK_POSTS = {
  post_001: {
    sk_id: 'post_001', sk_authorId: 'user_001',
    txt_content: 'Premier café sur le balcon, le quartier est encore endormi. Ces dix minutes valent toutes les alarmes du monde.',
    sk_parentPostId: null, nb_likesCount: 128, nb_commentsCount: 14, fl_liked: true,
    ts_createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    author: { sk_id: 'user_001', nm_username: 'camille', url_avatar: null },
  },
  post_002: {
    sk_id: 'post_002', sk_authorId: 'user_002',
    txt_content: "Quelqu'un d'autre trouve que les playlists d'été commencent un peu tôt ? Il fait 14°C dehors et on me propose déjà du reggaeton.",
    sk_parentPostId: null, nb_likesCount: 64, nb_commentsCount: 31, fl_liked: false,
    ts_createdAt: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    author: { sk_id: 'user_002', nm_username: 'theom', url_avatar: null },
  },
  post_003: {
    sk_id: 'post_003', sk_authorId: 'user_003',
    txt_content: "Petite balade au marché ce matin. La lumière était parfaite, j'ai pas pu résister.",
    sk_parentPostId: null, nb_likesCount: 64, nb_commentsCount: 31, fl_liked: false,
    ts_createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    author: { sk_id: 'user_003', nm_username: 'ines.b', url_avatar: null },
  },
  post_004: {
    sk_id: 'post_004', sk_authorId: 'user_001',
    txt_content: 'Premier café sur le balcon, le quartier est encore endormi. Ces dix minutes valent toutes les alarmes du monde.',
    sk_parentPostId: null, nb_likesCount: 128, nb_commentsCount: 14, fl_liked: true,
    ts_createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    author: { sk_id: 'user_001', nm_username: 'camille', url_avatar: null },
  },
  post_005: {
    sk_id: 'post_005', sk_authorId: 'user_002',
    txt_content: "Quelqu'un d'autre trouve que les playlists d'été commencent un peu tôt ? Il fait 14°C dehors et on me propose déjà du reggaeton.",
    sk_parentPostId: null, nb_likesCount: 64, nb_commentsCount: 31, fl_liked: false,
    ts_createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    author: { sk_id: 'user_002', nm_username: 'theom', url_avatar: null },
  },
  post_006: {
    sk_id: 'post_006', sk_authorId: 'user_003',
    txt_content: "Petite balade au marché ce matin. La lumière était parfaite, j'ai pas pu résister.",
    sk_parentPostId: null, nb_likesCount: 64, nb_commentsCount: 31, fl_liked: false,
    ts_createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    ts_updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    author: { sk_id: 'user_003', nm_username: 'ines.b', url_avatar: null },
  },
};

// TODO: API - GET /posts/:id/comments?depth=3
const MOCK_COMMENTS = {
  post_001: SHARED_COMMENTS,
  post_002: [
    {
      sk_id: 'comment_010', sk_authorId: 'user_001',
      txt_content: 'Haha le reggaeton en mars, classique.',
      sk_parentPostId: 'post_002', nb_likesCount: 4, nb_commentsCount: 0, fl_liked: false,
      ts_createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      ts_updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      author: { sk_id: 'user_001', nm_username: 'camille', url_avatar: null },
      replies: [],
    },
  ],
};

export default function PostDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const post = MOCK_POSTS[id];
  const comments = MOCK_COMMENTS[id] ?? [];

  const [liked, setLiked] = useState(post?.fl_liked ?? false);
  const [likeCount, setLikeCount] = useState(post?.nb_likesCount ?? 0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  if (!post) {
    return (
      <AppLayout>
        <p className="search-empty">Post introuvable.</p>
      </AppLayout>
    );
  }

  function handleLike() {
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(prev => !prev);
  }

  const formattedDate = new Date(post.ts_createdAt).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
  }) + ' · ' + new Date(post.ts_createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <AppLayout>
        <header className="post-detail__header">
          <button className="post-detail__back-btn" onClick={() => router.back()} aria-label="Retour">
            <ChevronLeft size={22} />
          </button>
          <h1 className="post-detail__title">Breezy</h1>
        </header>

        <div className="post-detail__post">
          <div className="post-detail__author-row">
            <Avatar name={post.author.nm_username} size="md" />
            <div className="post-detail__post-meta">
              <span className="post-detail__post-name">@{post.author.nm_username}</span>
            </div>
          </div>

          <p className="post-detail__post-body">{post.txt_content}</p>

          <span className="post-detail__timestamp">{formattedDate}</span>

          <div className="post-detail__divider" />

          <div className="post-detail__post-stats">
            <span><strong>{likeCount}</strong> J'aime</span>
            <span className="post-detail__stats-dot">·</span>
            <span><strong>{post.nb_commentsCount}</strong> Réponses</span>
          </div>

          <div className="post-detail__divider" />

          <div className="post-detail__post-actions">
            <button
              className={`post-detail__action${liked ? ' post-detail__action--liked' : ''}`}
              onClick={handleLike}
              aria-label="J'aime"
            >
              <Heart size={18} />
              <span>J'aime</span>
            </button>
            <button
              className="post-detail__action"
              onClick={() => setShowCommentModal(true)}
              aria-label="Répondre"
            >
              <MessageCircle size={18} />
              <span>Répondre</span>
            </button>
            <button
              className="post-detail__flag-btn"
              onClick={() => setShowReportModal(true)}
              aria-label="Signaler"
            >
              <Flag size={18} />
            </button>
          </div>
        </div>

        <p className="post-detail__comments-header">
          {comments.length} réponse{comments.length > 1 ? 's' : ''}
        </p>

        <div>
          {comments.map(comment => (
            <CommentCard key={comment.sk_id} comment={comment} />
          ))}
        </div>
      </AppLayout>

      {showCommentModal && (
        <CommentModal post={post} onClose={() => setShowCommentModal(false)} />
      )}
      {showReportModal && (
        <ReportModal targetId={post.sk_id} targetType="post" onClose={() => setShowReportModal(false)} />
      )}
    </>
  );
}
