'use client';

import { Search, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function SearchBar({ value, onChange, placeholder, autoFocus = false }) {
  const { t } = useLanguage();

  return (
    <div className="search-bar">
      <Search size={16} className="search-bar__icon" />
      <input
        className="search-bar__input"
        placeholder={placeholder ?? t('search.placeholder')}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
      />
      {value && (
        <button className="search-bar__clear" onClick={() => onChange('')} aria-label={t('common.clear')}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}
