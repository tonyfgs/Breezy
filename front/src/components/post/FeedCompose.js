'use client';

import { useRef, useState } from 'react';
import Avatar from '../ui/Avatar';

const MAX_LENGTH = 280;
const CURRENT_USER = { nm_username: 'camille', displayName: 'Camille Roche' };

export default function FeedCompose() {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  const remaining = MAX_LENGTH - content.length;
  const isValid = content.trim().length > 0;

  function handleChange(e) {
    setContent(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isValid) return;
    // TODO: API - POST /api/posts { content }
    setContent('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  return (
    <div className="feed-compose">
      <Avatar name={CURRENT_USER.nm_username} size="md" />
      <form className="feed-compose__form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="feed-compose__input"
          placeholder="Lance une brise..."
          value={content}
          onChange={handleChange}
          maxLength={MAX_LENGTH}
          rows={1}
        />
        <div className="feed-compose__footer">
          <span className="feed-compose__count">
            {remaining <= 50 ? remaining : ''}
          </span>
          <button
            type="submit"
            className="feed-compose__submit"
            disabled={!isValid}
          >
            Publier
          </button>
        </div>
      </form>
    </div>
  );
}
