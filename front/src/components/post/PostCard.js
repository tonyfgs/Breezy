'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import Avatar from '../ui/Avatar';
import CommentModal from '../modals/CommentModal';
import ReportModal from '../modals/ReportModal';

function formatRelativeTime(isoString) {
  const diffSeconds = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} h`;
  return `${Math.floor(diffSeconds / 86400)} j`;
}

export default function PostCard({ post }) {
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
      <article className="post-card">
        <div className="post-card__header">
          {/* url_avatar sera utilisé ici quand disponible */}
          <Avatar name={post.author.nm_username} size="md" />
          <div className="post-card__meta">
            <span className="post-card__name">@{post.author.nm_username}</span>
            <span className="post-card__subline">{formatRelativeTime(post.ts_createdAt)}</span>
          </div>
          <button className="post-card__flag-btn" aria-label="Signaler" onClick={e => { e.stopPropagation(); setShowReportModal(true); }}>
            <Flag size={14} />
          </button>
        </div>

        <p className="post-card__body">{post.txt_content}</p>

        <div className="post-card__actions">
          <button
            className={`post-card__action${liked ? ' post-card__action--liked' : ''}`}
            onClick={handleLike}
            aria-label="J'aime"
          >
            <Heart size={16} />
            <span>{likeCount}</span>
          </button>

          <button className="post-card__action" aria-label="Commenter" onClick={handleComment}>
            <MessageCircle size={16} />
            <span>{post.nb_commentsCount}</span>
          </button>
        </div>
      </article>

      {showCommentModal && (
        <CommentModal post={post} onClose={() => setShowCommentModal(false)} />
      )}
      {showReportModal && (
        <ReportModal postId={post.sk_id} onClose={() => setShowReportModal(false)} />
      )}
    </>
  );
}
