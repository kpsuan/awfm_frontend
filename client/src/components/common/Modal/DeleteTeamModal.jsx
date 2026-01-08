import React, { useState } from 'react';
import './DeleteAccountModal.css';

const DeleteTeamModal = ({ isOpen, teamName, onConfirm, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError('Please enter your password to confirm deletion');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onConfirm(password);
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to delete team. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword('');
    setError('');
    setIsLoading(false);
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="delete-account-modal">
      <div className="delete-account-modal__backdrop" onClick={handleCancel} />
      <div className="delete-account-modal__content">
        <div className="delete-account-modal__icon">
          <span className="material-icons">warning</span>
        </div>

        <h2 className="delete-account-modal__title">
          Delete Care Team
        </h2>

        <p className="delete-account-modal__message">
          Are you sure you want to delete <strong>{teamName}</strong>? This action cannot be undone.
          All team data, recordings, and member connections will be permanently removed.
        </p>

        <form onSubmit={handleSubmit} className="delete-account-modal__form">
          <div className="delete-account-modal__input-group">
            <label htmlFor="confirm-password" className="delete-account-modal__label">
              Enter your password to confirm
            </label>
            <input
              id="confirm-password"
              type="password"
              className="delete-account-modal__input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="delete-account-modal__error">
              <span className="material-icons">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="delete-account-modal__actions">
            <button
              type="button"
              className="delete-account-modal__button delete-account-modal__button--secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="delete-account-modal__button delete-account-modal__button--danger"
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteTeamModal;
