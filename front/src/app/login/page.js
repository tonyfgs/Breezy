'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AtSign, Lock } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function LoginPage() {
  const { t } = useLanguage();
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
      setError(t('auth.loginError'));
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
        <p className="auth-brand-panel__tagline">{t('auth.tagline')}</p>
        <div className="auth-brand-panel__bubbles">
          <div className="auth-bubble auth-bubble--incoming">{t('auth.bubbleIncoming')}</div>
          <div className="auth-bubble auth-bubble--outgoing">{t('auth.bubbleOutgoing')}</div>
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
            <h1 className="auth-title">{t('auth.loginTitle')}</h1>
            <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <Input
                label={t('auth.handleLabel')}
                type="text"
                name="handle"
                placeholder={t('auth.handlePlaceholder')}
                value={form.handle}
                onChange={handleChange('handle')}
                iconLeft={<AtSign size={16} />}
              />

              <div className="auth-field-group">
                <Input
                  label={t('auth.passwordLabel')}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange('password')}
                  iconLeft={<Lock size={16} />}
                  error={error}
                />
                <Link href="/forgot-password" className="auth-forgot-link">{t('auth.forgotPassword')}</Link>
              </div>

              <Button type="submit" fullWidth>{t('auth.loginSubmit')}</Button>
            </form>

            <p className="auth-switch">
              {t('auth.noAccount')}{' '}
              <Link href="/register">{t('auth.joinBreezy')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
