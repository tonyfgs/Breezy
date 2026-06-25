'use client';

import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';

export default function ConfirmModal({ title, message, confirmLabel, onConfirm, onClose, loading = false }) {
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal--confirm">
        <div className="modal__confirm-icon">
          <Trash2 size={24} />
        </div>
        <h2 className="modal__confirm-title">{title}</h2>
        {message && <p className="modal__confirm-message">{message}</p>}
        <div className="modal__confirm-actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? '…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
