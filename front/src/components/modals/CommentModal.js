'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

export default function CommentModal({ post, onClose }) {
  const [content, setContent] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;

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
          <h2 className="modal__title">Répondre</h2>
          <button className="modal__close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="modal__post-preview">
          <strong>@{post.author.nm_username}</strong> · {post.txt_content}
        </div>

        <form className="modal__reply-form" onSubmit={handleSubmit}>
          <textarea
            className="modal__textarea"
            placeholder="Ta réponse..."
            value={content}
            onChange={e => setContent(e.target.value)}
            autoFocus
          />
          <div className="modal__actions">
            <Button type="submit" disabled={!content.trim()}>
              Répondre
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
