'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, AtSign, Mail, Lock, Check } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../context/LanguageContext';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPasswordRules(password) {
  return {
    hasLength: password.length >= 8,
    hasDigit: /\d/.test(password),
    hasUpper: /[A-Z]/.test(password),
  };
}

export default function RegisterPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', handle: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [handleAvailable, setHandleAvailable] = useState(null);

  const passwordRules = getPasswordRules(form.password);
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  function handleChange(field) {
    return (e) => {
      const value = e.target.value;
      setForm(prev => ({ ...prev, [field]: value }));

      if (field === 'handle') {
        const clean = value.replace(/\s/g, '_');
        setForm(prev => ({ ...prev, handle: clean }));

        if (clean && !/^[a-zA-Z0-9_.]+$/.test(clean)) {
          setErrors(prev => ({ ...prev, handle: t('auth.handleInvalidChars') }));
          setHandleAvailable(null);
          return;
        }

        setErrors(prev => ({ ...prev, handle: '' }));
        // TODO: API - GET /api/users/check-handle?handle={clean} (avec debounce)
        setHandleAvailable(clean.length >= 3 ? true : null);
        return;
      }

      if (field === 'email') {
        setErrors(prev => ({
          ...prev,
          email: value && !validateEmail(value) ? t('auth.emailInvalid') : '',
        }));
      }
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = t('auth.nameRequired');
    if (!form.handle.trim()) newErrors.handle = t('auth.handleRequired');
    if (!validateEmail(form.email)) newErrors.email = t('auth.emailInvalid');
    if (!isPasswordValid) newErrors.password = t('auth.passwordInvalid');

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    // TODO: API - POST /api/auth/register { name, handle, email, password }
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

          <Link href="/login" className="auth-back-btn" aria-label={t('common.back')}>
            <ChevronLeft size={22} />
          </Link>

          <div className="auth-content">
            <h1 className="auth-title">{t('auth.registerTitle')}</h1>
            <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <Input
                label={t('auth.nameLabel')}
                type="text"
                name="name"
                placeholder={t('auth.namePlaceholder')}
                value={form.name}
                onChange={handleChange('name')}
                error={errors.name}
              />

              <Input
                label={t('auth.handleLabel')}
                type="text"
                name="handle"
                placeholder={t('auth.handlePlaceholder')}
                value={form.handle}
                onChange={handleChange('handle')}
                iconLeft={<AtSign size={16} />}
                iconRight={handleAvailable ? <Check size={16} /> : null}
                success={handleAvailable ? t('auth.handleAvailable') : ''}
                error={errors.handle}
              />

              <Input
                label={t('auth.emailLabel')}
                type="email"
                name="email"
                placeholder={t('auth.emailPlaceholder')}
                value={form.email}
                onChange={handleChange('email')}
                iconLeft={<Mail size={16} />}
                error={errors.email}
              />

              <Input
                label={t('auth.passwordLabel')}
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange('password')}
                iconLeft={<Lock size={16} />}
                error={errors.password}
              >
                {form.password && (
                  <div className="password-rules">
                    <span className={`password-rule${passwordRules.hasLength ? ' password-rule--met' : ''}`}>{t('auth.passwordRuleLength')}</span>
                    <span className={`password-rule${passwordRules.hasDigit ? ' password-rule--met' : ''}`}>{t('auth.passwordRuleDigit')}</span>
                    <span className={`password-rule${passwordRules.hasUpper ? ' password-rule--met' : ''}`}>{t('auth.passwordRuleUpper')}</span>
                  </div>
                )}
              </Input>

              <Button type="submit" fullWidth>{t('auth.registerSubmit')}</Button>

              <p className="auth-legal">
                {t('auth.legalPrefix')}{' '}
                <Link href="/legal/terms"><strong>{t('auth.legalTerms')}</strong></Link>{' '}
                {t('auth.legalAnd')}{' '}
                <Link href="/legal/privacy"><strong>{t('auth.legalPrivacy')}</strong></Link>{' '}
                {t('auth.legalSuffix')}
              </p>
            </form>

            <p className="auth-switch">
              {t('auth.hasAccount')}{' '}
              <Link href="/login">{t('auth.loginLink')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
