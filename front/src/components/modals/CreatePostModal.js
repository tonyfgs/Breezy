'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';

const MAX_CHARS = 280;

// TODO: Remplacer par l'utilisateur authentifié depuis le contexte auth
const MOCK_CURRENT_USER = {
  sk_id: 'current_user',
  nm_username: 'moi',
};

export default function CreatePostModal({ onClose }) {
  const { t } = useLanguage();
  const [content, setContent] = useState('');

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;
  const canSubmit = content.trim().length > 0 && !isOverLimit;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    // TODO: API - POST /api/posts { txt_content: content, sk_parentPostId: null }
    onClose();
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
            type="submit"
            form="create-post-form"
            disabled={!canSubmit}
          >
            {t('common.publish')}
          </Button>
        </div>

        <form id="create-post-form" onSubmit={handleSubmit}>
          <div className="modal__compose">
            <Avatar name={MOCK_CURRENT_USER.nm_username} size="md" />
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
