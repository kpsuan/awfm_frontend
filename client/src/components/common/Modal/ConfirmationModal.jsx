import React from 'react';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import './Modal.css';

const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  message,
  confirmLabel = "Yes, Confirm",
  cancelLabel = "Cancel",
  isSubmitting = false,
  variant = "info", // info, warning, success
  icon: CustomIcon
}) => {
  if (!isOpen) return null;

  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle
  };

  const IconComponent = CustomIcon || icons[variant] || Info;

  const variantClasses = {
    info: 'confirmation-modal__icon--info',
    warning: 'confirmation-modal__icon--warning',
    success: 'confirmation-modal__icon--success'
  };

  return (
    <div className="confirmation-modal__overlay" onClick={onCancel}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`confirmation-modal__icon ${variantClasses[variant]}`}>
          <IconComponent size={32} />
        </div>

        <h2 className="confirmation-modal__title">{title}</h2>

        {message && (
          <p className="confirmation-modal__message">{message}</p>
        )}

        <div className="confirmation-modal__actions">
          <button
            className="confirmation-modal__btn confirmation-modal__btn--cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </button>
          <button
            className="confirmation-modal__btn confirmation-modal__btn--confirm"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
