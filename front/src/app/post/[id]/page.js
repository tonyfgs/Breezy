'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, MessageCircle, Flag } from 'lucide-react';
import AppLayout from '../../../components/layout/AppLayout';
import Avatar from '../../../components/ui/Avatar';
import CommentCard from '../../../components/post/CommentCard';
import CommentModal from '../../../components/modals/CommentModal';
import ReportModal from '../../../components/modals/ReportModal';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { getPostApi, getPostCommentsApi, likePostApi, unlikePostApi, getLikeStatusApi } from '../../../lib/api/posts.api';

export default function PostDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { t, dateLocale } = useLanguage();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [parentPost, setParentPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    Promise.all([
      getPostApi(id),
      getPostCommentsApi(id),
    ])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setLikeCount(postData.nb_likesCount);
        setComments(commentsData);
        if (postData.sk_parentPostId) {
          getPostApi(postData.sk_parentPostId).then(setParentPost).catch(console.error);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user || !id) return;
    getLikeStatusApi(id, String(user.id))
      .then(setLiked)
      .catch(console.error);
  }, [id, user]);

  async function handleLike() {
    if (!user || !post) return;
    const userId = String(user.id);
    if (liked) {
      setLiked(false);
      setLikeCount(c => c - 1);
      await unlikePostApi(post.sk_id, userId).catch(() => {
        setLiked(true);
        setLikeCount(c => c + 1);
      });
    } else {
      setLiked(true);
      setLikeCount(c => c + 1);
      await likePostApi(post.sk_id, userId).catch(() => {
        setLiked(false);
        setLikeCount(c => c - 1);
      });
    }
  }

  if (loading) {
    return <AppLayout><p className="feed-status">Chargement…</p></AppLayout>;
  }

  if (!post) {
    return <AppLayout><p className="search-empty">{t('post.notFound')}</p></AppLayout>;
  }

  const formattedDate = new Date(post.ts_createdAt).toLocaleTimeString(dateLocale, {
    hour: '2-digit', minute: '2-digit',
  }) + ' · ' + new Date(post.ts_createdAt).toLocaleDateString(dateLocale, {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <AppLayout>
        <header className="post-detail__header">
          <button className="post-detail__back-btn" onClick={() => router.back()} aria-label={t('common.back')}>
            <ChevronLeft size={22} />
          </button>
          <h1 className="post-detail__title">{t('post.headerTitle')}</h1>
        </header>

        {parentPost && (
          <button
            className="post-detail__parent"
            onClick={() => router.push(`/post/${parentPost.sk_id}`)}
          >
            <span className="post-detail__parent-label">↩ @{parentPost.author.nm_username}</span>
            <p className="post-detail__parent-excerpt">{parentPost.txt_content}</p>
          </button>
        )}

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
            <span><strong>{likeCount}</strong> {t('post.likesLabel')}</span>
            <span className="post-detail__stats-dot">·</span>
            <span><strong>{comments.length}</strong> {t('post.repliesLabel')}</span>
          </div>

          <div className="post-detail__divider" />

          <div className="post-detail__post-actions">
            <button
              className={`post-detail__action${liked ? ' post-detail__action--liked' : ''}`}
              onClick={handleLike}
              aria-label={t('common.like')}
            >
              <Heart size={18} />
              <span>{t('common.like')}</span>
            </button>
            <button
              className="post-detail__action"
              onClick={() => setShowCommentModal(true)}
              aria-label={t('common.reply')}
            >
              <MessageCircle size={18} />
              <span>{t('common.reply')}</span>
            </button>
            <button
              className="post-detail__flag-btn"
              onClick={() => setShowReportModal(true)}
              aria-label={t('common.report')}
            >
              <Flag size={18} />
            </button>
          </div>
        </div>

        <p className="post-detail__comments-header">
          {t(comments.length > 1 ? 'post.repliesCountPlural' : 'post.repliesCountSingular', { count: comments.length })}
        </p>

        <div>
          {comments.map(comment => (
            <CommentCard key={comment.sk_id} comment={comment} />
          ))}
        </div>
      </AppLayout>

      {showCommentModal && (
        <CommentModal
          post={post}
          onClose={() => setShowCommentModal(false)}
          onCommentCreated={() => getPostCommentsApi(id).then(setComments).catch(console.error)}
        />
      )}
      {showReportModal && (
        <ReportModal targetId={post.sk_id} targetType="post" onClose={() => setShowReportModal(false)} />
      )}
    </>
  );
}
