import React from 'react';
import './ExitConfirmModal.css';

const ExitConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="exit-confirm-modal">
      <div className="exit-confirm-modal__backdrop" onClick={onCancel} />
      <div className="exit-confirm-modal__content">
        <div className="exit-confirm-modal__icon">
          <span className="material-icons">warning</span>
        </div>

        <h2 className="exit-confirm-modal__title">
          Exit Questionnaire?
        </h2>

        <p className="exit-confirm-modal__message">
          Are you sure you want to exit? Your progress will be saved, but you'll need to start from the main screen next time.
        </p>

        <div className="exit-confirm-modal__actions">
          <button
            className="exit-confirm-modal__button exit-confirm-modal__button--secondary"
            onClick={onCancel}
          >
            Stay
          </button>
          <button
            className="exit-confirm-modal__button exit-confirm-modal__button--primary"
            onClick={onConfirm}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmModal;
