'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import Avatar from '../ui/Avatar';
import CommentModal from '../modals/CommentModal';
import ReportModal from '../modals/ReportModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { likePostApi, unlikePostApi } from '../../lib/api/posts.api';

function formatRelativeTime(isoString) {
  const diffSeconds = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} h`;
  return `${Math.floor(diffSeconds / 86400)} j`;
}

export default function PostCard({ post }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.fl_liked ?? false);
  const [likeCount, setLikeCount] = useState(post.nb_likesCount ?? 0);
  const [commentCount, setCommentCount] = useState(post.nb_commentsCount ?? 0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  async function handleLike(e) {
    e.stopPropagation();
    if (!user) return;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    try {
      if (newLiked) await likePostApi(post.sk_id, user.profileId);
      else await unlikePostApi(post.sk_id, user.profileId);
    } catch (err) {
      if (err?.status === 409) {
        // Déjà liké en base — on corrige l'état local
        setLiked(true);
        setLikeCount(prev => prev - 1);
      } else {
        setLiked(!newLiked);
        setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
      }
    }
  }

  function handleComment(e) {
    e.stopPropagation();
    setShowCommentModal(true);
  }

  return (
    <>
      <article className="post-card" onClick={() => router.push(`/post/${post.sk_id}`)}>
        <div className="post-card__header">
          <button
            className="post-card__author"
            onClick={e => { e.stopPropagation(); router.push(`/profile/${post.author.nm_username}`); }}
            aria-label={t('common.viewProfileOf', { username: post.author.nm_username })}
          >
            <Avatar name={post.author.nm_username} size="md" />
            <div className="post-card__meta">
              <span className="post-card__name">@{post.author.nm_username}</span>
              <span className="post-card__subline">{formatRelativeTime(post.ts_createdAt)}</span>
            </div>
          </button>
          <button className="post-card__flag-btn" aria-label={t('common.report')} onClick={e => { e.stopPropagation(); setShowReportModal(true); }}>
            <Flag size={14} />
          </button>
        </div>

        <p className="post-card__body">{post.txt_content}</p>

        <div className="post-card__actions">
          <button
            className={`post-card__action${liked ? ' post-card__action--liked' : ''}`}
            onClick={handleLike}
            aria-label={t('common.like')}
          >
            <Heart size={16} />
            <span>{likeCount}</span>
          </button>

          <button className="post-card__action" aria-label={t('common.comment')} onClick={handleComment}>
            <MessageCircle size={16} />
            <span>{commentCount}</span>
          </button>
        </div>
      </article>

      {showCommentModal && (
        <CommentModal
          post={post}
          onClose={() => setShowCommentModal(false)}
          onCommentCreated={() => setCommentCount(c => c + 1)}
        />
      )}
      {showReportModal && (
        <ReportModal targetId={post.sk_id} targetType="post" onClose={() => setShowReportModal(false)} />
      )}
    </>
  );
}
