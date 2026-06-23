'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Avatar from '../../components/ui/Avatar';
import ThemeSwitch from '../../components/ui/ThemeSwitch';
import LanguageSwitch from '../../components/ui/LanguageSwitch';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getProfileByUsernameApi, updateProfileApi } from '../../lib/api/users.api';

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const [profileId, setProfileId] = useState(null);
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    getProfileByUsernameApi(user.username)
      .then(p => {
        if (p) {
          setProfileId(p.id);
          setBio(p.bio ?? '');
        }
      })
      .catch(console.error);
  }, [user]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!profileId || saving) return;
    setSaving(true);
    try {
      await updateProfileApi(profileId, { bio });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
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
            <Avatar name={user?.username ?? ''} size="lg" />
            <button className="settings-avatar-change">{t('settings.changePhoto')}</button>
          </div>
          <form className="settings-form" onSubmit={handleSaveProfile}>
            <div className="settings-field">
              <label className="settings-field__label">{t('settings.usernameLabel')}</label>
              <input
                className="settings-field__input"
                value={user?.username ?? ''}
                readOnly
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
            <button type="submit" className="btn btn--primary btn--full" disabled={saving}>
              {saved ? '✓' : t('settings.save')}
            </button>
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
            <span className="settings-item__value">—</span>
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
