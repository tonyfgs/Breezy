'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Avatar from '../../components/ui/Avatar';
import ThemeSwitch from '../../components/ui/ThemeSwitch';
import LanguageSwitch from '../../components/ui/LanguageSwitch';
import { useLanguage } from '../../context/LanguageContext';

// TODO: remplacer par le contexte auth
const MOCK_USER = {
  sk_id: 'current_user',
  nm_username: 'moi',
  txt_bio: '',
  txt_email: 'moi@example.com',
};

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [username, setUsername] = useState(MOCK_USER.nm_username);
  const [bio, setBio] = useState(MOCK_USER.txt_bio);

  function handleSaveProfile(e) {
    e.preventDefault();
    // TODO: API - PATCH /users/:id { nm_username: username, txt_bio: bio }
  }

  function handleLogout() {
    // TODO: API - POST /auth/logout
    router.push('/login');
  }

  return (
    <AppLayout>
      <header className="page-header">
        <button className="post-detail__back-btn" onClick={() => router.back()} aria-label={t('common.back')}>
          <ChevronLeft size={22} />
        </button>
        <h1 className="page-header__title">{t('settings.title')}</h1>
      </header>

      <div className="settings-body">
        <section className="settings-section">
          <h2 className="settings-section__title">{t('settings.profileSection')}</h2>
          <div className="settings-avatar-row">
            <Avatar name={username} size="lg" />
            <button className="settings-avatar-change">{t('settings.changePhoto')}</button>
          </div>
          <form className="settings-form" onSubmit={handleSaveProfile}>
            <div className="settings-field">
              <label className="settings-field__label">{t('settings.usernameLabel')}</label>
              <input
                className="settings-field__input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={t('settings.usernamePlaceholder')}
              />
            </div>
            <div className="settings-field">
              <label className="settings-field__label">{t('settings.bioLabel')}</label>
              <textarea
                className="settings-field__input settings-field__input--textarea"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder={t('settings.bioPlaceholder')}
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn--primary btn--full">{t('settings.save')}</button>
          </form>
        </section>

        <section className="settings-section">
          <h2 className="settings-section__title">{t('settings.appearanceSection')}</h2>
          <div className="settings-item">
            <span className="settings-item__label">{t('settings.darkTheme')}</span>
            <ThemeSwitch />
          </div>
          <div className="settings-item">
            <span className="settings-item__label">{t('settings.language')}</span>
            <LanguageSwitch />
          </div>
        </section>

        <section className="settings-section">
          <h2 className="settings-section__title">{t('settings.accountSection')}</h2>
          <div className="settings-item">
            <span className="settings-item__label">{t('settings.email')}</span>
            <span className="settings-item__value">{MOCK_USER.txt_email}</span>
          </div>
          <button className="settings-item settings-item--btn">
            <span className="settings-item__label">{t('settings.changePassword')}</span>
            <ChevronRight size={16} className="settings-item__chevron" />
          </button>
        </section>

        <section className="settings-section settings-section--danger">
          <button className="settings-danger-btn" onClick={handleLogout}>
            {t('settings.logout')}
          </button>
          <button className="settings-danger-btn settings-danger-btn--delete">
            {t('settings.deleteAccount')}
          </button>
        </section>
      </div>
    </AppLayout>
  );
}
