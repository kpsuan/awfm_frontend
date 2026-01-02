import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import GoogleSignInButton from '../components/common/GoogleSignInButton';
import AuthHeroCarousel from '../components/common/AuthHeroCarousel';
import ConsentTermsModal from '../components/common/Modal/ConsentTermsModal';
import ConsentAIModal from '../components/common/Modal/ConsentAIModal';
import '../styles/auth.css';
import logo from '../styles/logo.png';

// Password validation check icon
const CheckIcon = ({ valid }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M13.3334 4L6.00008 11.3333L2.66675 8" 
      stroke={valid ? "#38a169" : "rgba(70, 95, 241, 0.4)"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

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

  const { register: registerUser, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Password validation
  const passwordValidation = useMemo(() => {
    return {
      length: password.length >= 8,
      noNameOrEmail: !password.toLowerCase().includes(email.split('@')[0].toLowerCase()) || !email,
      hasNumberOrSymbol: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password, email]);

  const passwordStrength = useMemo(() => {
    const validCount = Object.values(passwordValidation).filter(Boolean).length;
    if (validCount === 3) return 'Strong';
    if (validCount === 2) return 'Medium';
    return 'Weak';
  }, [passwordValidation]);

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
      navigate('/dashboard');
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
    <div className="auth-page">
      {/* Left Hero Panel - Animated Carousel */}
      <AuthHeroCarousel />

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          {/* Logo */}
          <div className="auth-logo">
            <img src={logo} alt="AWFM Logo" />
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <span className="auth-tab active">Sign Up</span>
            <Link to="/login" className="auth-tab">Sign In</Link>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="displayName">Full Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => handleFieldChange('display_name', e.target.value, setDisplayName)}
                required
                disabled={loading}
                placeholder="Enter your full name"
                className={fieldErrors.display_name ? 'input-error' : ''}
              />
              {fieldErrors.display_name && (
                <span className="field-error">{fieldErrors.display_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                required
                disabled={loading}
                placeholder="Enter your email"
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
                placeholder="Enter Password"
                className={fieldErrors.password ? 'input-error' : ''}
              />
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}

              {/* Password constraints */}
              <div className="password-constraints">
                <div className={`constraint ${passwordStrength !== 'Weak' ? 'valid' : 'invalid'}`}>
                  <span className="constraint-icon"><CheckIcon valid={passwordStrength !== 'Weak'} /></span>
                  <span>Password Strength: {passwordStrength}</span>
                </div>
                <div className={`constraint ${passwordValidation.length ? 'valid' : 'invalid'}`}>
                  <span className="constraint-icon"><CheckIcon valid={passwordValidation.length} /></span>
                  <span>At least 8 characters</span>
                </div>
                <div className={`constraint ${passwordValidation.hasNumberOrSymbol ? 'valid' : 'invalid'}`}>
                  <span className="constraint-icon"><CheckIcon valid={passwordValidation.hasNumberOrSymbol} /></span>
                  <span>Contains a number or symbol</span>
                </div>
              </div>
            </div>

            <div className="form-group-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isHcw}
                  onChange={(e) => setIsHcw(e.target.checked)}
                  disabled={loading}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">I am a healthcare worker</span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-button-primary"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={loading}
            text="Sign Up with Google"
          />

          <p className="auth-terms-notice">
            By signing up to create an account I accept Company's{' '}
            <button type="button" onClick={() => setShowTermsModal(true)}>
              Terms of use & Privacy Policy.
            </button>
          </p>
        </div>
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
