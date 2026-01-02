import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/auth';
import { useAuth } from '../context';
import { Button } from '../components/common/Button';
import '../styles/auth.css';

const RestoreAccount = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter code
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.requestRestoreCode(email);
      setStep(2);
      toast.success('Restoration code sent to your email!');
    } catch (err) {
      setError(err.message || 'Failed to send restoration code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreAccount = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.restoreAccount(email, code);

      // Store tokens and log the user in
      if (response.tokens) {
        localStorage.setItem('authTokens', JSON.stringify(response.tokens));
      }

      toast.success('Account restored successfully!');

      // Redirect to questionnaire after a brief delay
      setTimeout(() => {
        window.location.href = '/questionnaire/Q10A';
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to restore account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    try {
      await authService.requestRestoreCode(email);
      toast.success('New code sent to your email!');
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-icon">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <path fill="currentColor" d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>

        <h1 className="auth-title">Restore Account</h1>

        {/* Progress Steps */}
        <div className="auth-steps">
          <div className={`auth-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Email</span>
          </div>
          <div className="auth-step-divider"></div>
          <div className={`auth-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Verify</span>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {step === 1 && (
          <>
            <p className="auth-subtitle">
              Enter your email address to receive a restoration code
            </p>
            <form onSubmit={handleRequestCode} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="your@email.com"
                  autoFocus
                />
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
                Send Restoration Code
              </Button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className="auth-subtitle">
              Enter the 6-digit code sent to <strong>{email}</strong>
            </p>
            <form onSubmit={handleRestoreAccount} className="auth-form">
              <div className="form-group">
                <label htmlFor="code">Verification Code</label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={loading}
                  placeholder="000000"
                  maxLength={6}
                  className="code-input"
                  autoFocus
                />
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} disabled={code.length !== 6}>
                Restore My Account
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="md"
                fullWidth
                onClick={handleResendCode}
                disabled={loading}
              >
                Resend Code
              </Button>
            </form>
          </>
        )}

        <p className="auth-link">
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RestoreAccount;
