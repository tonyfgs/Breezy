'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../i18n/translations';

const STORAGE_KEY = 'breezy-lang';
const LanguageContext = createContext(null);

export const DATE_LOCALES = { fr: 'fr-FR', en: 'en-US' };

function getInitialLocale() {
  if (typeof window === 'undefined') return 'fr';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'fr' || stored === 'en') return stored;
  return window.navigator.language?.startsWith('en') ? 'en' : 'fr';
}

function getValue(dict, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], dict);
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? vars[key] : match));
}

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(getInitialLocale);

  useEffect(() => {
    document.documentElement.setAttribute('lang', locale);
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  function t(key, vars) {
    const value = getValue(translations[locale], key) ?? getValue(translations.fr, key) ?? key;
    return interpolate(value, vars);
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dateLocale: DATE_LOCALES[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage doit être utilisé dans un LanguageProvider');
  return ctx;
}
