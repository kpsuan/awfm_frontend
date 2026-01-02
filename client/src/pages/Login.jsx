import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context';
import GoogleSignInButton from '../components/common/GoogleSignInButton';
import AuthHeroCarousel from '../components/common/AuthHeroCarousel';
import '../styles/auth.css';
import logo from '../styles/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard'); // Redirect after successful login
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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
            <Link to="/register" className="auth-tab">Sign Up</Link>
            <span className="auth-tab active">Sign In</span>
          </div>

          {error && (
            <div className="auth-error">
              {error}
              {error.toLowerCase().includes('deleted') && (
                <div className="auth-error-action">
                  <Link to="/restore-account" className="restore-account-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    Restore Your Account
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter Password"
              />
            </div>

            <div className="form-group-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="auth-button-primary"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <GoogleSignInButton
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={loading}
            text="Sign In with Google"
          />

          <p className="auth-terms-notice">
            By signing in you accept Company's{' '}
            <Link to="/terms">Terms of use & Privacy Policy.</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
