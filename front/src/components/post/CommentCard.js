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

export default function CommentCard({ comment }) {
  const router = useRouter();
  const { t } = useLanguage();
  const [liked, setLiked] = useState(comment.fl_liked ?? false);
  const [likeCount, setLikeCount] = useState(comment.nb_likesCount ?? 0);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  function handleLike() {
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(prev => !prev);
  }


  return (
    <>
      <div className="comment-card" onClick={() => router.push(`/post/${comment.sk_id}`)} style={{ cursor: 'pointer' }}>
        <div className="comment-card__header">
          <button
            onClick={e => { e.stopPropagation(); router.push(`/profile/${comment.author.nm_username}`); }}
            aria-label={t('common.viewProfileOf', { username: comment.author.nm_username })}
            style={{ display: 'contents' }}
          >
            <Avatar name={comment.author.nm_username} size="sm" />
            <div className="comment-card__meta">
              <span className="comment-card__name">@{comment.author.nm_username}</span>
              <span className="comment-card__subline">{formatRelativeTime(comment.ts_createdAt)}</span>
            </div>
          </button>
          <button
            className="comment-card__flag-btn"
            onClick={e => { e.stopPropagation(); setShowReportModal(true); }}
            aria-label={t('common.report')}
          >
            <Flag size={13} />
          </button>
        </div>

        <p className="comment-card__body">{comment.txt_content}</p>

        <div className="comment-card__actions">
          <button
            className={`comment-card__action${liked ? ' comment-card__action--liked' : ''}`}
            onClick={e => { e.stopPropagation(); handleLike(); }}
            aria-label={t('common.like')}
          >
            <Heart size={14} />
            <span>{likeCount}</span>
          </button>

          <button
            className="comment-card__action"
            onClick={e => { e.stopPropagation(); setShowReplyModal(true); }}
            aria-label={t('common.reply')}
          >
            <MessageCircle size={14} />
            <span>{t('common.reply')}</span>
          </button>
        </div>

        {comment.replies?.length > 0 && (
          <div className="comment-replies">
            {comment.replies.map(reply => (
              <CommentCard key={reply.sk_id} comment={reply} />
            ))}
          </div>
        )}
      </div>

      {showReplyModal && (
        <CommentModal post={comment} onClose={() => setShowReplyModal(false)} />
      )}
      {showReportModal && (
        <ReportModal targetId={comment.sk_id} targetType="comment" onClose={() => setShowReportModal(false)} />
      )}
    </>
  );
}
