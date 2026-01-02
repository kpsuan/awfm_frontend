import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import { authService } from '../services/auth';
import '../styles/auth.css';

const VerificationPending = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle key down (backspace)
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);

    // Focus last filled input or submit if complete
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  // Handle verify
  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.verifyEmail(fullCode);
      navigate('/login', { state: { verified: true } });
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Handle resend
  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      await authService.resendVerification();
      setTimeLeft(600); // Reset timer
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  // Auto-submit when all digits entered
  useEffect(() => {
    const fullCode = code.join('');
    if (fullCode.length === 6 && !loading) {
      handleVerify();
    }
  }, [code]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Verify Your Email</h1>

        <p className="verification-subtitle">
          We sent a 6-digit code to
        </p>
        <p className="verification-email">{user?.email || 'your email'}</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="code-inputs" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="code-input"
              disabled={loading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <p className="code-timer">
          Code expires in: <strong>{formatTime(timeLeft)}</strong>
        </p>

        <button
          onClick={handleVerify}
          className="auth-button"
          disabled={loading || code.some(d => d === '')}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <p className="resend-text">
          {canResend ? (
            <button
              onClick={handleResend}
              className="resend-button"
              disabled={resending}
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          ) : (
            "Didn't receive the code? You can request a new one when the timer expires."
          )}
        </p>

        <p className="auth-link">
          <Link to="/register">← Back to signup</Link>
        </p>
      </div>
    </div>
  );
};

export default VerificationPending;
