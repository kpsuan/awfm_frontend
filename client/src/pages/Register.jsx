import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import { Button } from '../components/common/Button';
import GoogleSignInButton from '../components/common/GoogleSignInButton';
import ConsentTermsModal from '../components/common/Modal/ConsentTermsModal';
import ConsentAIModal from '../components/common/Modal/ConsentAIModal';
import '../styles/auth.css';
import './LegalPages.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isHcw, setIsHcw] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAI, setAgreeAI] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const { register: registerUser, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Clear field error when user starts typing
  const handleFieldChange = (field, value, setter) => {
    setter(value);
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    // Client-side validation
    const errors = {};
    if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (!email) {
      errors.email = 'Email is required';
    }
    if (!displayName) {
      errors.display_name = 'Display name is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Show consent modals if not yet agreed
    if (!agreeTerms) {
      setShowTermsModal(true);
      return;
    }

    if (!agreeAI) {
      setShowAIModal(true);
      return;
    }

    // Both consents given, proceed with registration
    setLoading(true);
    try {
      await registerUser(email, password, displayName, isHcw);
      navigate('/verification-pending');
    } catch (err) {
      // Parse field-specific errors from the error message
      const errorMsg = err.message || '';

      // Check if it's a field-specific error
      if (errorMsg.toLowerCase().includes('email')) {
        setFieldErrors({ email: errorMsg });
      } else if (errorMsg.toLowerCase().includes('password')) {
        setFieldErrors({ password: errorMsg });
      } else if (errorMsg.toLowerCase().includes('display') || errorMsg.toLowerCase().includes('name')) {
        setFieldErrors({ display_name: errorMsg });
      } else {
        setError(errorMsg || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit after agreeing to modals
  const handleTermsAgree = () => {
    setAgreeTerms(true);
    // Show AI modal next if not agreed
    if (!agreeAI) {
      setTimeout(() => setShowAIModal(true), 300);
    }
  };

  const handleAIAgree = () => {
    setAgreeAI(true);
  };

  const handleGoogleSuccess = async (googleData) => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle(googleData.access_token, googleData.id_token);
      navigate('/questionnaire/Q10A');
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage || 'Google sign-in failed. Please try again.');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start your care planning journey</p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <GoogleSignInButton
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          disabled={loading}
          text="Sign up with Google"
        />

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => handleFieldChange('display_name', e.target.value, setDisplayName)}
              required
              disabled={loading}
              placeholder="Your Name"
              className={fieldErrors.display_name ? 'input-error' : ''}
            />
            {fieldErrors.display_name && (
              <span className="field-error">{fieldErrors.display_name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
              required
              disabled={loading}
              placeholder="your@email.com"
              className={fieldErrors.email ? 'input-error' : ''}
            />
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
              required
              disabled={loading}
              placeholder="At least 8 characters"
              minLength={8}
              className={fieldErrors.password ? 'input-error' : ''}
            />
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>

          <div className="form-group-checkbox">
            <input
              id="isHcw"
              type="checkbox"
              checked={isHcw}
              onChange={(e) => setIsHcw(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="isHcw">I am a healthcare worker</label>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            Create Account
          </Button>

          <p className="auth-consent-notice">
            By creating an account, you agree to our{' '}
            <button type="button" onClick={() => setShowTermsModal(true)}>
              Terms of Service & Privacy Policy
            </button>{' '}
            and acknowledge our{' '}
            <button type="button" onClick={() => setShowAIModal(true)}>
              AI Assistance Disclosure
            </button>
          </p>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      {/* Consent Modals */}
      <ConsentTermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={handleTermsAgree}
        initialChecked={agreeTerms}
      />

      <ConsentAIModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onAgree={handleAIAgree}
        initialChecked={agreeAI}
      />
    </div>
  );
};

export default Register;
