import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  const handleSignIn = () => {
    onClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  // Default user icon SVG
  const DefaultUserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="sidebar__user-icon">
      <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.3"/>
      <path d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="sidebar__backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <button
            className="sidebar__close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="sidebar__user-section">
            <div className="sidebar__user-avatar">
              {user.profile_photo_url ? (
                <img src={user.profile_photo_url} alt={user.display_name || user.email} />
              ) : (
                <DefaultUserIcon />
              )}
            </div>
            <div className="sidebar__user-info">
              <h3 className="sidebar__user-name">{user.display_name || 'User'}</h3>
              <p className="sidebar__user-email">{user.email}</p>
              {user.is_hcw && (
                <span className="sidebar__hcw-badge">Healthcare Worker</span>
              )}
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="sidebar__nav">
          <button
            className="sidebar__nav-item"
            onClick={() => handleNavigation('/account-settings')}
          >
            <span className="material-icons">settings</span>
            <span>Account Settings</span>
          </button>

          <button
            className="sidebar__nav-item"
            onClick={() => handleNavigation('/care-team')}
          >
            <span className="material-icons">group</span>
            <span>Care Team</span>
          </button>

          <button
            className="sidebar__nav-item"
            onClick={() => handleNavigation('/progress')}
          >
            <span className="material-icons">analytics</span>
            <span>Your Progress</span>
          </button>

          <div className="sidebar__divider" />

          {user ? (
            <button
              className="sidebar__nav-item sidebar__nav-item--danger"
              onClick={handleLogout}
            >
              <span className="material-icons">logout</span>
              <span>Logout</span>
            </button>
          ) : (
            <button
              className="sidebar__nav-item"
              onClick={handleSignIn}
            >
              <span className="material-icons">login</span>
              <span>Sign in</span>
            </button>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          <p className="sidebar__app-name">A Whole Family Matter</p>
          <p className="sidebar__version">Pre-MVP v0.1</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
