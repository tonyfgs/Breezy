'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import SearchBar from '../../components/ui/SearchBar';
import UserRow from '../../components/user/UserRow';

// TODO: API - GET /users/search?q=query (endpoint à définir côté backend)
const MOCK_USERS = [
  { sk_id: 'user_001', nm_username: 'camille', txt_bio: 'Développeuse front-end · café · balcon', fl_active: true },
  { sk_id: 'user_002', nm_username: 'theom', txt_bio: 'Designer UI/UX basé à Lyon', fl_active: true },
  { sk_id: 'user_003', nm_username: 'ines.b', txt_bio: 'Photographe amateur · nature', fl_active: true },
  { sk_id: 'user_004', nm_username: 'maxg', txt_bio: '', fl_active: true },
  { sk_id: 'user_005', nm_username: 'sasha_dev', txt_bio: 'Fullstack JS · open source', fl_active: true },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const trimmed = query.trim();
  const results = trimmed
    ? MOCK_USERS.filter(u => u.nm_username.toLowerCase().includes(trimmed.toLowerCase()))
    : MOCK_USERS;

  return (
    <AppLayout>
      <div className="search-header">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Rechercher un utilisateur..."
          autoFocus
        />
      </div>

      <p className="search-section-label">
        {trimmed ? 'Résultats' : 'Suggestions'}
      </p>

      {trimmed && results.length === 0 ? (
        <p className="search-empty">Aucun résultat pour « {query} »</p>
      ) : (
        <div className="user-list">
          {results.map(user => (
            <UserRow key={user.sk_id} user={user} />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
