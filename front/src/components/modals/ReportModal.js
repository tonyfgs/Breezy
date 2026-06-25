'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { createReportApi } from '../../lib/api/moderation.api';

const REPORT_REASONS = [
  { cd: 'inappropriate', key: 'reasonInappropriate' },
  { cd: 'spam', key: 'reasonSpam' },
  { cd: 'harassment', key: 'reasonHarassment' },
  { cd: 'misinformation', key: 'reasonMisinformation' },
  { cd: 'hate_speech', key: 'reasonHateSpeech' },
  { cd: 'other', key: 'reasonOther' },
];

export default function ReportModal({ targetId, targetType = 'post', onClose }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedReason || !user || submitting) return;
    setSubmitting(true);
    try {
      const resolvedType = targetType === 'comment' ? 'post' : targetType;
      await createReportApi(user.profileId, targetId, resolvedType, selectedReason);
      setSubmitted(true);
      setTimeout(onClose, 1800);
    } catch (err) {
      console.error(err);
      onClose();
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
          <h2 className="modal__confirm-title">{t('modals.reportSentTitle')}</h2>
          <p className="modal__confirm-message">{t('modals.reportSentMessage')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">{targetType === 'comment' ? t('modals.reportCommentTitle') : t('modals.reportPostTitle')}</h2>
          <button className="modal__close-btn" onClick={onClose} aria-label={t('common.close')}>
            <X size={20} />
          </button>
        </div>

        <p className="report-subtitle">{t('modals.reportSubtitle')}</p>

        <form onSubmit={handleSubmit}>
          <div className="report-list">
            {REPORT_REASONS.map(reason => (
              <button
                key={reason.cd}
                type="button"
                className={`report-option${selectedReason === reason.cd ? ' report-option--selected' : ''}`}
                onClick={() => setSelectedReason(reason.cd)}
              >
                {t(`modals.${reason.key}`)}
                <span className="report-option__dot" />
              </button>
            ))}
          </div>

          <Button type="submit" fullWidth disabled={!selectedReason || submitting}>
            {submitting ? '…' : t('modals.reportSubmit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
