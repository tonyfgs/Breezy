'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '../../components/layout/AppLayout';
import SearchBar from '../../components/ui/SearchBar';
import UserRow from '../../components/user/UserRow';
import { useLanguage } from '../../context/LanguageContext';
import { getAllProfilesApi } from '../../lib/api/users.api';

function SearchContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getAllProfilesApi()
      .then(profiles => setAllUsers(
        profiles.map(p => ({
          sk_id: p.id,
          nm_username: p.username,
          txt_bio: p.bio ?? '',
          fl_active: p.fl_banned === 0,
        }))
      ))
      .catch(console.error);
  }, []);

  const trimmed = query.trim();
  const results = trimmed
    ? allUsers.filter(u => u.nm_username.toLowerCase().includes(trimmed.toLowerCase()))
    : allUsers;

  return (
    <AppLayout>
      <div className="search-header">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t('search.placeholder')}
          autoFocus
        />
      </div>

      <p className="search-section-label">
        {trimmed ? t('search.results') : t('search.suggestions')}
      </p>

      {trimmed && results.length === 0 ? (
        <p className="search-empty">{t('search.noResults', { query })}</p>
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

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
