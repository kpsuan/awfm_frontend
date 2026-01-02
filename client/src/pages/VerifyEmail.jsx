import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../services/auth';
import '../styles/auth.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been verified successfully!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Failed to verify email. The link may have expired.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === 'verifying' && (
          <>
            <h1 className="auth-title">Verifying Email</h1>
            <p className="auth-subtitle">Please wait while we verify your email address...</p>
            <div className="auth-loading">
              <div className="spinner"></div>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="auth-title">Email Verified!</h1>
            <div className="auth-success">
              <svg viewBox="0 0 24 24" className="success-icon">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <p className="auth-subtitle">{message}</p>
            <p className="auth-subtitle">Redirecting to login...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="auth-title">Verification Failed</h1>
            <div className="auth-error">{message}</div>
            <p className="auth-link">
              <Link to="/login">Go to Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
