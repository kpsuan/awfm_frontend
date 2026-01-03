import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context';
import './ContentHeader.css';

// Helper to get initials from name
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const ContentHeader = ({ onMenuClick, showMenuButton = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock notifications - would come from API
  const notifications = [
    {
      id: 1,
      type: 'info',
      title: 'Care Team Update',
      message: 'John accepted your invitation',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'success',
      title: 'Progress Saved',
      message: 'Your answers have been saved',
      time: '1 day ago',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;
  const userName = user?.display_name || user?.email?.split('@')[0] || 'User';
  const userRole = user?.is_hcw ? 'Healthcare Worker' : 'Patient';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="content-header">
      <div className="content-header__left">
        {showMenuButton && (
          <button
            className="content-header__menu-btn"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <span className="material-icons">menu</span>
          </button>
        )}

        {/* Search Bar */}
        <form className="content-header__search" onSubmit={handleSearch}>
          <span className="material-icons content-header__search-icon">search</span>
          <input
            type="text"
            placeholder="Search by contact, deal, account..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="content-header__search-input"
          />
          <span className="material-icons content-header__search-dropdown">expand_more</span>
        </form>
      </div>

      <div className="content-header__right">
        {/* Notification Bell */}
        <div className="content-header__notifications">
          <button
            className="content-header__icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <span className="material-icons">notifications_none</span>
            {unreadCount > 0 && (
              <span className="content-header__badge">{unreadCount}</span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              <div
                className="content-header__dropdown-backdrop"
                onClick={() => setShowNotifications(false)}
              />
              <div className="content-header__dropdown">
                <div className="dropdown__header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="dropdown__action">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="dropdown__list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`dropdown__item ${!notification.read ? 'dropdown__item--unread' : ''}`}
                      >
                        <div className={`dropdown__item-icon dropdown__item-icon--${notification.type}`}>
                          <span className="material-icons">
                            {notification.type === 'success' ? 'check_circle' : 'info'}
                          </span>
                        </div>
                        <div className="dropdown__item-content">
                          <p className="dropdown__item-title">{notification.title}</p>
                          <p className="dropdown__item-message">{notification.message}</p>
                          <span className="dropdown__item-time">{notification.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="dropdown__empty">
                      <span className="material-icons">notifications_none</span>
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <div className="dropdown__footer">
                  <button onClick={() => navigate('/notifications')}>
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="content-header__user">
          <button
            className="content-header__user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="User menu"
          >
            <div className="content-header__avatar">
              {user?.profile_photo_url ? (
                <img src={user.profile_photo_url} alt={userName} />
              ) : (
                <span className="content-header__avatar-initials">{getInitials(userName)}</span>
              )}
            </div>
            <div className="content-header__user-info">
              <span className="content-header__user-name">{userName}</span>
              <span className="content-header__user-role">{userRole}</span>
            </div>
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="content-header__dropdown-backdrop"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="content-header__dropdown content-header__dropdown--user">
                <button className="dropdown__menu-item" onClick={() => navigate('/account-settings')}>
                  <span className="material-icons">settings</span>
                  Account Settings
                </button>
                <button className="dropdown__menu-item" onClick={() => navigate('/help')}>
                  <span className="material-icons">help_outline</span>
                  Help & Support
                </button>
                <div className="dropdown__divider" />
                <button className="dropdown__menu-item dropdown__menu-item--danger" onClick={() => navigate('/login')}>
                  <span className="material-icons">logout</span>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default ContentHeader;
