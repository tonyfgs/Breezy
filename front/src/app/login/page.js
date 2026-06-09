'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlignJustify, AtSign, Lock } from 'lucide-react';
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
          <div className="auth-brand-panel__logo-icon">
            <AlignJustify size={16} />
          </div>
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
