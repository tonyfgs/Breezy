'use client';

import { useRef, useState } from 'react';
import Avatar from '../ui/Avatar';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { createPostApi } from '../../lib/api/posts.api';

const MAX_LENGTH = 280;

export default function FeedCompose({ onPostCreated }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || !user || submitting) return;
    setSubmitting(true);
    try {
      const post = await createPostApi(String(user.id), content);
      setContent('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      onPostCreated?.(post);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="feed-compose">
      <Avatar name={user?.username ?? ''} size="md" />
      <form className="feed-compose__form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="feed-compose__input"
          placeholder={t('feed.composePlaceholder')}
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
            disabled={!isValid || submitting}
          >
            {t('common.publish')}
          </button>
        </div>
      </form>
    </div>
  );
}
