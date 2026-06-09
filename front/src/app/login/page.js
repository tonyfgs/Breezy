'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AtSign, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const [form, setForm] = useState({ handle: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(field) {
    return (e) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (error) setError('');
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.handle.trim() || !form.password) {
      setError('Identifiant et mot de passe requis.');
      return;
    }

    // TODO: API - POST /api/auth/login { handle, password }
  }

  return (
    <div className="auth-desktop-wrapper">
      <div className="auth-brand-panel">
        <div className="auth-brand-panel__logo">
          <Image
            src="/breezy_logo-white_bg.png"
            alt="Breezy"
            width={36}
            height={36}
            className="auth-brand-panel__logo-icon"
          />
          Breezy
        </div>
        <p className="auth-brand-panel__tagline">Les vraies conversations n'ont pas de buzz</p>
        <div className="auth-brand-panel__bubbles">
          <div className="auth-bubble auth-bubble--incoming">j'ai amené les croissants ce matin !</div>
          <div className="auth-bubble auth-bubble--outgoing">je suis déjà en route</div>
        </div>
      </div>

      <div className="auth-page-wrapper">
        <div className="auth-page">
          <div className="auth-mobile-header">
            <Image
              src="/breezy_logo-white_bg.png"
              alt="Breezy"
              width={36}
              height={36}
              className="auth-mobile-header__logo"
            />
            Breezy
          </div>

          <div className="auth-content">
            <h1 className="auth-title">Content de te revoir.</h1>
            <p className="auth-subtitle">Reprends la conversation là où tu l'avais laissée.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <Input
                label="Identifiant"
                type="text"
                name="handle"
                placeholder="ton_identifiant"
                value={form.handle}
                onChange={handleChange('handle')}
                iconLeft={<AtSign size={16} />}
              />

              <div className="auth-field-group">
                <Input
                  label="Mot de passe"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                  iconLeft={<Lock size={16} />}
                  error={error}
                />
                <Link href="/forgot-password" className="auth-forgot-link">Mot de passe oublié ?</Link>
              </div>

              <Button type="submit" fullWidth>Se connecter</Button>
            </form>

            <p className="auth-switch">
              Pas encore de compte ?{' '}
              <Link href="/register">Rejoins Breezy.</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
