'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Avatar from '../ui/Avatar';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getAllProfilesApi } from '../../lib/api/users.api';
import { getFollowingApi, followApi, unfollowApi } from '../../lib/api/follows.api';

export default function RightSidebar() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!user) return;
    const myId = user.profileId;
    Promise.all([
      getAllProfilesApi().catch(() => []),
      getFollowingApi(myId).catch(() => []),
    ]).then(([allUsers, following]) => {
      const followingSet = new Set(following);
      const filtered = allUsers
        .filter(u => u.username !== user.username && !followingSet.has(u.id) && u.fl_banned !== 1)
        .slice(0, 3)
        .map(u => ({ sk_id: u.id, nm_username: u.username, fl_followed: false }));
      setSuggestions(filtered);
    });
  }, [user]);

  async function toggleFollow(userId) {
    if (!user) return;
    const myId = user.profileId;
    const isFollowed = suggestions.find(s => s.sk_id === userId)?.fl_followed;

    setSuggestions(prev =>
      prev.map(s => s.sk_id === userId ? { ...s, fl_followed: !isFollowed } : s)
    );

    const apiCall = isFollowed ? unfollowApi(myId, userId) : followApi(myId, userId);
    await apiCall.catch(() => {
      setSuggestions(prev =>
        prev.map(s => s.sk_id === userId ? { ...s, fl_followed: isFollowed } : s)
      );
    });
  }

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar__suggestions">
        <h2 className="right-sidebar__title">{t('sidebar.toFollow')}</h2>
        <ul className="right-sidebar__list">
          {suggestions.map(suggestion => (
            <li key={suggestion.sk_id} className="suggestion-row">
              <Link href={`/profile/${suggestion.nm_username}`} className="suggestion-row__user">
                <Avatar name={suggestion.nm_username} size="sm" />
                <div className="suggestion-row__info">
                  <span className="suggestion-row__name">{suggestion.nm_username}</span>
                  <span className="suggestion-row__handle">@{suggestion.nm_username}</span>
                </div>
              </Link>
              <button
                className={`suggestion-row__follow-btn${suggestion.fl_followed ? ' suggestion-row__follow-btn--following' : ''}`}
                onClick={() => toggleFollow(suggestion.sk_id)}
              >
                {suggestion.fl_followed ? t('sidebar.following') : t('sidebar.follow')}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
