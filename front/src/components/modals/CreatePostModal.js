'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { createPostApi } from '../../lib/api/posts.api';

const MAX_CHARS = 280;

export default function CreatePostModal({ onClose }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !loading;

  async function doSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await createPostApi(user?.profileId, content.trim());
      onClose();
    } catch {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    doSubmit();
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal--compose">
        <div className="modal__header">
          <button className="modal__close-btn" onClick={onClose} aria-label={t('common.close')}>
            <X size={20} />
          </button>
          <Button
            onClick={doSubmit}
            disabled={!canSubmit}
          >
            {loading ? '…' : t('common.publish')}
          </Button>
        </div>

        <form id="create-post-form" onSubmit={handleSubmit}>
          <div className="modal__compose">
            <Avatar name={user?.username ?? ''} size="md" />
            <textarea
              className="modal__textarea"
              placeholder={t('modals.composePlaceholder')}
              value={content}
              onChange={e => setContent(e.target.value)}
              autoFocus
            />
          </div>
          <div className="modal__compose-footer">
            <span className={`modal__char-count${isOverLimit ? ' modal__char-count--over' : ''}`}>
              {remaining}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
