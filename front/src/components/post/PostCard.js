'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import Avatar from '../ui/Avatar';
import CommentModal from '../modals/CommentModal';
import ReportModal from '../modals/ReportModal';
import { useLanguage } from '../../context/LanguageContext';

function formatRelativeTime(isoString) {
  const diffSeconds = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} h`;
  return `${Math.floor(diffSeconds / 86400)} j`;
}

export default function PostCard({ post }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [liked, setLiked] = useState(post.fl_liked ?? false);
  const [likeCount, setLikeCount] = useState(post.nb_likesCount ?? 0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  function handleLike(e) {
    e.stopPropagation();
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(prev => !prev);
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
            <span>{post.nb_commentsCount}</span>
          </button>
        </div>
      </article>

      {showCommentModal && (
        <CommentModal post={post} onClose={() => setShowCommentModal(false)} />
      )}
      {showReportModal && (
        <ReportModal targetId={post.sk_id} targetType="post" onClose={() => setShowReportModal(false)} />
      )}
    </>
  );
}
