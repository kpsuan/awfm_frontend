import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isHcw, setIsHcw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!displayName.trim()) {
          setError('Display name is required');
          setLoading(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }
        await register(email, password, displayName, isHcw);
      }

      // Success - call callback and close modal
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.message || `Failed to ${isLogin ? 'login' : 'register'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setDisplayName('');
    setIsHcw(false);
  };

  const handleFullPageAuth = () => {
    onClose();
    navigate(isLogin ? '/login' : '/register');
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal">
      <div className="auth-modal__backdrop" onClick={onClose} />
      <div className="auth-modal__content">
        <button
          className="auth-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          <span className="material-icons">close</span>
        </button>

        <div className="auth-modal__header">
          <h2 className="auth-modal__title">
            {isLogin ? 'Login to Continue' : 'Create an Account'}
          </h2>
          <p className="auth-modal__subtitle">
            {isLogin
              ? 'Please login to save your progress and access all features'
              : 'Create an account to save your responses and access your care plan'}
          </p>
        </div>

        {error && (
          <div className="auth-modal__error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-modal__form">
          {!isLogin && (
            <div className="auth-modal__form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your name"
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="auth-modal__form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              required
            />
          </div>

          <div className="auth-modal__form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? 'Enter your password' : 'Minimum 8 characters'}
              disabled={loading}
              required
            />
          </div>

          {!isLogin && (
            <div className="auth-modal__form-group auth-modal__form-group--checkbox">
              <input
                id="isHcw"
                type="checkbox"
                checked={isHcw}
                onChange={(e) => setIsHcw(e.target.checked)}
                disabled={loading}
              />
              <label htmlFor="isHcw">I am a healthcare worker</label>
            </div>
          )}

          <button
            type="submit"
            className="auth-modal__submit"
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <div className="auth-modal__footer">
          <p className="auth-modal__switch">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              type="button"
              onClick={handleSwitchMode}
              className="auth-modal__switch-btn"
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </p>

          <button
            type="button"
            onClick={handleFullPageAuth}
            className="auth-modal__full-page-link"
          >
            Go to full {isLogin ? 'login' : 'registration'} page →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
