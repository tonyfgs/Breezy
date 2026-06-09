'use client';

import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Rechercher...', autoFocus = false }) {
  return (
    <div className="search-bar">
      <Search size={16} className="search-bar__icon" />
      <input
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
      />
      {value && (
        <button className="search-bar__clear" onClick={() => onChange('')} aria-label="Effacer">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
