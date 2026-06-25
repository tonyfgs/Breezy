'use client';

import { useState } from 'react';
import { X, AtSign, Lock, ChevronDown, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useLanguage } from '../../context/LanguageContext';
import { createAdminUserApi } from '../../lib/api/auth.api';

const ROLES = [
  { value: 'user', key: 'modal.roleUser' },
  { value: 'moderator', key: 'modal.roleModerator' },
  { value: 'admin', key: 'modal.roleAdmin' },
];

export default function CreateUserModal({ onClose }) {
  const { t } = useLanguage();
  const [form, setForm] = useState({ nm_username: '', password: '', cd_role: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field) {
    return (e) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };
  }

  function validate() {
    const errs = {};
    if (!form.nm_username.trim()) {
      errs.nm_username = t('moderation.modal.usernameRequired');
    } else if (!/^[a-zA-Z0-9_.]+$/.test(form.nm_username)) {
      errs.nm_username = t('moderation.modal.usernameInvalidChars');
    }
    if (!form.password) {
      errs.password = t('moderation.modal.passwordRequired');
    } else if (form.password.length < 8) {
      errs.password = t('moderation.modal.passwordTooShort');
    }
    if (!form.cd_role) {
      errs.cd_role = t('moderation.modal.roleRequired');
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await createAdminUserApi(form.nm_username.trim(), form.password, form.cd_role);
      setSubmitted(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      if (err?.status === 409) {
        setErrors({ nm_username: t('auth.handleTaken') });
      } else {
        setErrors({ nm_username: t('auth.registerError') });
      }
      setSubmitting(false);
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  if (submitted) {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal modal--confirm">
          <div className="modal__confirm-icon modal__confirm-icon--success">
            <CheckCircle size={24} />
          </div>
          <h2 className="modal__confirm-title">{t('moderation.modal.successTitle')}</h2>
          <p className="modal__confirm-message">{t('moderation.modal.successMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">{t('moderation.modal.title')}</h2>
          <button className="modal__close-btn" onClick={onClose} aria-label={t('common.close')}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            label={t('moderation.modal.usernameLabel')}
            type="text"
            value={form.nm_username}
            onChange={handleChange('nm_username')}
            placeholder={t('moderation.modal.usernamePlaceholder')}
            iconLeft={<AtSign size={16} />}
            error={errors.nm_username}
          />

          <Input
            label={t('moderation.modal.passwordLabel')}
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder={t('moderation.modal.passwordPlaceholder')}
            iconLeft={<Lock size={16} />}
            error={errors.password}
          />

          <div className="form-group">
            <label className="form-label">{t('moderation.modal.roleLabel')}</label>
            <div className={`select-wrapper${errors.cd_role ? ' select-wrapper--error' : ''}`}>
              <select
                className="select-field"
                value={form.cd_role}
                onChange={handleChange('cd_role')}
              >
                <option value="">{t('moderation.modal.rolePlaceholder')}</option>
                {ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {t(`moderation.${role.key}`)}
                  </option>
                ))}
              </select>
              <span className="select-chevron">
                <ChevronDown size={16} />
              </span>
            </div>
            {errors.cd_role && <span className="input-hint input-hint--error">{errors.cd_role}</span>}
          </div>

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? '…' : t('moderation.modal.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
