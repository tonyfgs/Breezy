'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

const MAX_CHARS = 280;

export default function CommentModal({ post, onClose }) {
  const { t } = useLanguage();
  const [content, setContent] = useState('');

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() || isOverLimit) return;

    // TODO: API - POST /api/posts { txt_content: content, sk_parentPostId: post.sk_id }
    onClose();
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">{t('modals.replyTitle')}</h2>
          <button className="modal__close-btn" onClick={onClose} aria-label={t('common.close')}>
            <X size={20} />
          </button>
        </div>

        <div className="modal__post-preview">
          <strong>@{post.author.nm_username}</strong> · {post.txt_content}
        </div>

        <form className="modal__reply-form" onSubmit={handleSubmit}>
          <textarea
            className="modal__textarea"
            placeholder={t('modals.replyPlaceholder')}
            value={content}
            onChange={e => setContent(e.target.value)}
            autoFocus
          />
          <div className="modal__actions">
            {content && (
              <span className={`modal__char-count${isOverLimit ? ' modal__char-count--over' : ''}`}>
                {remaining}
              </span>
            )}
            <Button type="submit" disabled={!content.trim() || isOverLimit}>
              {t('common.reply')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
