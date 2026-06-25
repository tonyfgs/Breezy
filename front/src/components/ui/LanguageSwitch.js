'use client';

import { useLanguage } from '../../context/LanguageContext';

const OPTIONS = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
];

export default function LanguageSwitch() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="language-switch" role="radiogroup" aria-label={t('settings.languageAria')}>
      {OPTIONS.map(option => (
        <button
          key={option.code}
          type="button"
          className={`language-switch__option${locale === option.code ? ' language-switch__option--active' : ''}`}
          onClick={() => setLocale(option.code)}
          role="radio"
          aria-checked={locale === option.code}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
