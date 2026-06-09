'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

const REPORT_REASONS = [
  { cd: 'inappropriate', label: 'Contenu inapproprié' },
  { cd: 'spam', label: 'Spam' },
  { cd: 'harassment', label: 'Harcèlement' },
  { cd: 'misinformation', label: 'Fausse information' },
  { cd: 'hate_speech', label: 'Discours haineux' },
  { cd: 'other', label: 'Autre' },
];

export default function ReportModal({ targetId, targetType = 'post', onClose }) {
  const [selectedReason, setSelectedReason] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedReason) return;

    // TODO: API - POST /api/reports {
    //   sk_targetId: targetId,
    //   cd_targetType: targetType,
    //   txt_reason: selectedReason,
    // }
    onClose();
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">{targetType === 'comment' ? 'Signaler ce commentaire' : 'Signaler ce post'}</h2>
          <button className="modal__close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <p className="report-subtitle">Pourquoi tu veux signaler ce post ?</p>

        <form onSubmit={handleSubmit}>
          <div className="report-list">
            {REPORT_REASONS.map(reason => (
              <button
                key={reason.cd}
                type="button"
                className={`report-option${selectedReason === reason.cd ? ' report-option--selected' : ''}`}
                onClick={() => setSelectedReason(reason.cd)}
              >
                {reason.label}
                <span className="report-option__dot" />
              </button>
            ))}
          </div>

          <Button type="submit" fullWidth disabled={!selectedReason}>
            Signaler
          </Button>
        </form>
      </div>
    </div>
  );
}
