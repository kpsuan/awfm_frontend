import React, { useState } from 'react';
import './ChangePasswordModal.css';

const ChangePasswordModal = ({ isOpen, onSuccess, onCancel }) => {
  const [step, setStep] = useState(1); // 1: Enter current password, 2: Enter code and new password
  const [currentPassword, setCurrentPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const resetState = () => {
    setStep(1);
    setCurrentPassword('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsLoading(false);
    setCodeSent(false);
  };

  const handleCancel = () => {
    resetState();
    onCancel();
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      setError('Please enter your current password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Request verification code will be handled by parent
      await onSuccess({ action: 'request_code', currentPassword });
      setCodeSent(true);
      setStep(2);
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to send verification code');
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validation
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSuccess({
        action: 'change_password',
        currentPassword,
        verificationCode,
        newPassword,
        confirmPassword,
      });
      resetState();
    } catch (err) {
      setError(err.message || 'Failed to change password');
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError('');

    try {
      await onSuccess({ action: 'request_code', currentPassword });
      setCodeSent(true);
      setError('');
      setIsLoading(false);
      // Show success message briefly
      const tempError = error;
      setError('New code sent to your email!');
      setTimeout(() => setError(tempError), 3000);
    } catch (err) {
      setError(err.message || 'Failed to resend code');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="change-password-modal">
      <div className="change-password-modal__backdrop" onClick={handleCancel} />
      <div className="change-password-modal__content">
        <div className="change-password-modal__icon">
          <span className="material-icons">lock</span>
        </div>

        <h2 className="change-password-modal__title">
          Change Password
        </h2>

        <div className="change-password-modal__steps">
          <div className={`change-password-modal__step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
            <div className="change-password-modal__step-number">1</div>
            <span>Verify Identity</span>
          </div>
          <div className="change-password-modal__step-divider"></div>
          <div className={`change-password-modal__step ${step === 2 ? 'active' : ''}`}>
            <div className="change-password-modal__step-number">2</div>
            <span>New Password</span>
          </div>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestCode} className="change-password-modal__form">
            <p className="change-password-modal__description">
              Enter your current password to receive a verification code via email.
            </p>

            <div className="change-password-modal__input-group">
              <label htmlFor="current-password" className="change-password-modal__label">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                className="change-password-modal__input"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="change-password-modal__error">
                <span className="material-icons">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="change-password-modal__actions">
              <button
                type="button"
                className="change-password-modal__button change-password-modal__button--secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="change-password-modal__button change-password-modal__button--primary"
                disabled={isLoading}
              >
                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleChangePassword} className="change-password-modal__form">
            <p className="change-password-modal__description">
              Enter the 6-digit code sent to your email and your new password.
            </p>

            <div className="change-password-modal__input-group">
              <label htmlFor="verification-code" className="change-password-modal__label">
                Verification Code
              </label>
              <input
                id="verification-code"
                type="text"
                className="change-password-modal__input change-password-modal__input--code"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                disabled={isLoading}
                maxLength={6}
                autoFocus
              />
              <button
                type="button"
                className="change-password-modal__resend-link"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                Resend code
              </button>
            </div>

            <div className="change-password-modal__input-group">
              <label htmlFor="new-password" className="change-password-modal__label">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                className="change-password-modal__input"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
              />
            </div>

            <div className="change-password-modal__input-group">
              <label htmlFor="confirm-password" className="change-password-modal__label">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="change-password-modal__input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="change-password-modal__error">
                <span className="material-icons">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="change-password-modal__actions">
              <button
                type="button"
                className="change-password-modal__button change-password-modal__button--secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="change-password-modal__button change-password-modal__button--primary"
                disabled={isLoading}
              >
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
