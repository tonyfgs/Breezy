'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { updatePostApi } from '../../lib/api/posts.api';

const MAX_CHARS = 280;

export default function EditPostModal({ post, onClose, onUpdated }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState(post.txt_content);
  const [loading, setLoading] = useState(false);

  const remaining = MAX_CHARS - content.length;
  const isOverLimit = remaining < 0;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !loading && content.trim() !== post.txt_content;

  async function doSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await updatePostApi(post.sk_id, { content: content.trim() });
      onUpdated(content.trim());
      onClose();
    } catch {
      setLoading(false);
    }
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
          <Button onClick={doSubmit} disabled={!canSubmit}>
            {loading ? '…' : t('common.save')}
          </Button>
        </div>

        <div className="modal__compose">
          <Avatar name={user?.username ?? ''} size="md" />
          <textarea
            className="modal__textarea"
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
      </div>
    </div>
  );
}
