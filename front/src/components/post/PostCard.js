'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Flag, MoreHorizontal, Pencil, Trash2, CornerUpLeft } from 'lucide-react';
import Avatar from '../ui/Avatar';
import CommentModal from '../modals/CommentModal';
import ReportModal from '../modals/ReportModal';
import EditPostModal from '../modals/EditPostModal';
import ConfirmModal from '../modals/ConfirmModal';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { likePostApi, unlikePostApi, deletePostApi, getParentPostAuthorApi } from '../../lib/api/posts.api';

function formatRelativeTime(isoString) {
  const diffSeconds = (Date.now() - new Date(isoString).getTime()) / 1000;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} min`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} h`;
  return `${Math.floor(diffSeconds / 86400)} j`;
}

export default function PostCard({ post, onDeleted }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useAuth();
  const menuRef = useRef(null);

  const [liked, setLiked] = useState(post.fl_liked ?? false);
  const [likeCount, setLikeCount] = useState(post.nb_likesCount ?? 0);
  const [commentCount, setCommentCount] = useState(post.nb_commentsCount ?? 0);
  const [content, setContent] = useState(post.txt_content);
  const [deleted, setDeleted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [parentAuthor, setParentAuthor] = useState(null);

  const isOwner = user?.profileId === post.sk_authorId;

  useEffect(() => {
    if (!post.sk_parentPostId) return;
    getParentPostAuthorApi(post.sk_parentPostId)
      .then(({ username }) => setParentAuthor(username))
      .catch(() => {});
  }, [post.sk_parentPostId]);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

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
        setLiked(true);
        setLikeCount(prev => prev - 1);
      } else {
        setLiked(!newLiked);
        setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
      }
    }
  }

  function handleDelete(e) {
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await deletePostApi(post.sk_id);
      setDeleted(true);
      onDeleted?.();
    } catch {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }

  function handleEdit(e) {
    e.stopPropagation();
    setShowMenu(false);
    setShowEditModal(true);
  }

  function handleComment(e) {
    e.stopPropagation();
    setShowCommentModal(true);
  }

  if (deleted) return null;

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

          {isOwner ? (
            <div className="post-card__menu-wrapper" ref={menuRef}>
              <button
                className="post-card__menu-btn"
                aria-label={t('common.moreOptions')}
                onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}
              >
                <MoreHorizontal size={16} />
              </button>
              {showMenu && (
                <div className="post-card__dropdown" onClick={e => e.stopPropagation()}>
                  <button className="post-card__dropdown-item" onClick={handleEdit}>
                    <Pencil size={14} />
                    {t('common.edit')}
                  </button>
                  <button className="post-card__dropdown-item post-card__dropdown-item--danger" onClick={handleDelete}>
                    <Trash2 size={14} />
                    {t('common.delete')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="post-card__flag-btn" aria-label={t('common.report')} onClick={e => { e.stopPropagation(); setShowReportModal(true); }}>
              <Flag size={14} />
            </button>
          )}
        </div>

        {post.sk_parentPostId && (
          <button
            className="post-card__reply"
            onClick={e => { e.stopPropagation(); router.push(`/post/${post.sk_parentPostId}`); }}
          >
            <CornerUpLeft size={12} />
            <span>
              {t('post.replyTo')}{' '}
              <span className="post-card__reply-handle">
                {parentAuthor ? `@${parentAuthor}` : '…'}
              </span>
            </span>
          </button>
        )}

        <p className="post-card__body">{content}</p>

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
      {showEditModal && (
        <EditPostModal
          post={{ ...post, txt_content: content }}
          onClose={() => setShowEditModal(false)}
          onUpdated={newContent => setContent(newContent)}
        />
      )}
      {showDeleteModal && (
        <ConfirmModal
          title={t('modals.deletePostTitle')}
          message={t('modals.deletePostMessage')}
          confirmLabel={t('common.delete')}
          onConfirm={confirmDelete}
          onClose={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}
    </>
  );
}
