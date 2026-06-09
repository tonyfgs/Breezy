'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import Avatar from '../../components/ui/Avatar';

// TODO: remplacer par le contexte auth
const MOCK_USER = {
  sk_id: 'current_user',
  nm_username: 'moi',
  txt_bio: '',
  txt_email: 'moi@example.com',
};

export default function SettingsPage() {
  const router = useRouter();
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
        <h1 className="page-header__title">Paramètres</h1>
      </header>

      <div className="settings-body">
        <section className="settings-section">
          <h2 className="settings-section__title">Mon profil</h2>
          <div className="settings-avatar-row">
            <Avatar name={username} size="lg" />
            <button className="settings-avatar-change">Changer la photo</button>
          </div>
          <form className="settings-form" onSubmit={handleSaveProfile}>
            <div className="settings-field">
              <label className="settings-field__label">Pseudo</label>
              <input
                className="settings-field__input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ton pseudo"
              />
            </div>
            <div className="settings-field">
              <label className="settings-field__label">Bio</label>
              <textarea
                className="settings-field__input settings-field__input--textarea"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Parle un peu de toi..."
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn--primary btn--full">Enregistrer</button>
          </form>
        </section>

        <section className="settings-section">
          <h2 className="settings-section__title">Compte</h2>
          <div className="settings-item">
            <span className="settings-item__label">Email</span>
            <span className="settings-item__value">{MOCK_USER.txt_email}</span>
          </div>
          <button className="settings-item settings-item--btn">
            <span className="settings-item__label">Changer le mot de passe</span>
            <ChevronRight size={16} className="settings-item__chevron" />
          </button>
        </section>

        <section className="settings-section settings-section--danger">
          <button className="settings-danger-btn" onClick={handleLogout}>
            Se déconnecter
          </button>
          <button className="settings-danger-btn settings-danger-btn--delete">
            Supprimer mon compte
          </button>
        </section>
      </div>
    </AppLayout>
  );
}
