'use client';

import { useState } from 'react';
import Link from 'next/link';
import Avatar from '../ui/Avatar';

// TODO: API - GET /api/users/suggestions
const MOCK_SUGGESTIONS = [
  { sk_id: 'user_004', nm_username: 'atelier.lum', displayName: 'Atelier Lumière', fl_followed: false },
  { sk_id: 'user_005', nm_username: 'noev', displayName: 'Noé Vidal', fl_followed: true },
  { sk_id: 'user_006', nm_username: 'salome', displayName: 'Salomé', fl_followed: false },
];

export default function RightSidebar() {
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);

  function toggleFollow(userId) {
    // TODO: API - POST/DELETE /api/follow/:userId
    setSuggestions(prev =>
      prev.map(u => u.sk_id === userId ? { ...u, fl_followed: !u.fl_followed } : u)
    );
  }

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar__suggestions">
        <h2 className="right-sidebar__title">À suivre</h2>
        <ul className="right-sidebar__list">
          {suggestions.map(user => (
            <li key={user.sk_id} className="suggestion-row">
              <Link href={`/profile/${user.nm_username}`} className="suggestion-row__user">
                <Avatar name={user.displayName} size="sm" />
                <div className="suggestion-row__info">
                  <span className="suggestion-row__name">{user.displayName}</span>
                  <span className="suggestion-row__handle">@{user.nm_username}</span>
                </div>
              </Link>
              <button
                className={`suggestion-row__follow-btn${user.fl_followed ? ' suggestion-row__follow-btn--following' : ''}`}
                onClick={() => toggleFollow(user.sk_id)}
              >
                {user.fl_followed ? 'Suivi' : 'Suivre'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
