'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, AtSign, Mail, Lock, Check } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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
          setErrors(prev => ({ ...prev, handle: 'Caractères autorisés : lettres, chiffres, _ et .' }));
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
          email: value && !validateEmail(value) ? "Format d'e-mail invalide — il manque le « @ »." : '',
        }));
      }
    };
  }

  function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Le nom est requis.';
    if (!form.handle.trim()) newErrors.handle = "L'identifiant est requis.";
    if (!validateEmail(form.email)) newErrors.email = "Format d'e-mail invalide — il manque le « @ ».";
    if (!isPasswordValid) newErrors.password = 'Le mot de passe ne respecte pas les règles.';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    // TODO: API - POST /api/auth/register { name, handle, email, password }
  }

  return (
    <div className="auth-page">
      <Link href="/login" className="auth-back-btn" aria-label="Retour">
        <ChevronLeft size={22} />
      </Link>

      <div className="auth-content">
        <h1 className="auth-title">Rejoins Breezy.</h1>
        <p className="auth-subtitle">Une place douce pour partager tes pensées du jour.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Nom"
            type="text"
            name="name"
            placeholder="Ton nom complet"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
          />

          <Input
            label="Identifiant"
            type="text"
            name="handle"
            placeholder="ton_identifiant"
            value={form.handle}
            onChange={handleChange('handle')}
            iconLeft={<AtSign size={16} />}
            iconRight={handleAvailable ? <Check size={16} /> : null}
            success={handleAvailable ? 'Identifiant disponible' : ''}
            error={errors.handle}
          />

          <Input
            label="Adresse e-mail"
            type="email"
            name="email"
            placeholder="adresse@email.com"
            value={form.email}
            onChange={handleChange('email')}
            iconLeft={<Mail size={16} />}
            error={errors.email}
          />

          <Input
            label="Mot de passe"
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
                <span className={`password-rule${passwordRules.hasLength ? ' password-rule--met' : ''}`}>8 caractères</span>
                <span className={`password-rule${passwordRules.hasDigit ? ' password-rule--met' : ''}`}>1 chiffre</span>
                <span className={`password-rule${passwordRules.hasUpper ? ' password-rule--met' : ''}`}>1 majuscule</span>
              </div>
            )}
          </Input>

          <Button type="submit" fullWidth>Créer mon compte</Button>
        </form>

        <p className="auth-legal">
          En continuant, tu acceptes les{' '}
          <Link href="/legal/terms"><strong>Conditions</strong></Link>{' '}
          et la{' '}
          <Link href="/legal/privacy"><strong>Politique de confidentialité</strong></Link>{' '}
          de Breezy.
        </p>
      </div>
    </div>
  );
}
