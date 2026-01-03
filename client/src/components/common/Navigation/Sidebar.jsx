import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context';
import './Sidebar.css';
import logo from '../../../styles/logo.png';

const Sidebar = ({ isOpen, onClose, isMobileOrFocus }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
    navigate('/login');
  };

  const handleSignIn = () => {
    if (onClose) onClose();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Determine sidebar class based on mode
  const sidebarClass = isMobileOrFocus
    ? `sidebar sidebar--mobile ${isOpen ? 'sidebar--open' : ''}`
    : 'sidebar sidebar--desktop';

  return (
    <>
      {/* Backdrop - only for mobile/focus mode */}
      {isMobileOrFocus && isOpen && (
        <div
          className="sidebar__backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClass}>
        {/* Header with logo */}
        <div className="sidebar__header">
          <div className="sidebar__logo-section" onClick={() => handleNavigation('/dashboard')}>
            <img src={logo} alt="AWFM Logo" className="sidebar__logo" />
            <span className="sidebar__brand">AWFM</span>
          </div>
          {isMobileOrFocus && (
            <button
              className="sidebar__close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <span className="material-icons">close</span>
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar__nav">
          <button
            className={`sidebar__nav-item ${isActive('/dashboard') ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => handleNavigation('/dashboard')}
          >
            <span className="material-icons">dashboard</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`sidebar__nav-item ${isActive('/questionnaire') ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => handleNavigation('/questionnaire')}
          >
            <span className="material-icons">assignment</span>
            <span>Questionnaire</span>
          </button>

          <button
            className={`sidebar__nav-item ${isActive('/care-team') ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => handleNavigation('/care-team')}
          >
            <span className="material-icons">group</span>
            <span>Care Team</span>
          </button>

          <button
            className={`sidebar__nav-item ${isActive('/progress') ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => handleNavigation('/progress')}
          >
            <span className="material-icons">analytics</span>
            <span>Your Progress</span>
          </button>

          <div className="sidebar__divider" />

          <button
            className={`sidebar__nav-item ${isActive('/account-settings') ? 'sidebar__nav-item--active' : ''}`}
            onClick={() => handleNavigation('/account-settings')}
          >
            <span className="material-icons">settings</span>
            <span>Account Settings</span>
          </button>

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
