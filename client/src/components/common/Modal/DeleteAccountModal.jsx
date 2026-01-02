import React, { useState } from 'react';
import './DeleteAccountModal.css';

const DeleteAccountModal = ({ isOpen, onConfirm, onCancel }) => {
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
      // Reset state on success
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to delete account. Please try again.');
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
          Delete Account
        </h2>

        <p className="delete-account-modal__message">
          This action cannot be undone. Your account will be permanently deleted after 30 days.
          To confirm, please enter your current password.
        </p>

        <form onSubmit={handleSubmit} className="delete-account-modal__form">
          <div className="delete-account-modal__input-group">
            <label htmlFor="confirm-password" className="delete-account-modal__label">
              Current Password
            </label>
            <input
              id="confirm-password"
              type="password"
              className="delete-account-modal__input"
              placeholder="Enter your current password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(''); // Clear error on input change
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
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
