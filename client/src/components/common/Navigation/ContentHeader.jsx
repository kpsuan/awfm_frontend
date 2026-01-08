import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useNotifications } from '../../../context';
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

// Helper to format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// Map notification types to icon and color
const getNotificationStyle = (notificationType) => {
  const styles = {
    team_invitation: { icon: 'group_add', type: 'info' },
    invitation_accepted: { icon: 'check_circle', type: 'success' },
    member_joined: { icon: 'person_add', type: 'success' },
    member_left: { icon: 'person_remove', type: 'warning' },
    role_changed: { icon: 'swap_horiz', type: 'info' },
    affirmation: { icon: 'favorite', type: 'success' },
    question_completed: { icon: 'task_alt', type: 'success' },
    chat_message: { icon: 'chat', type: 'info' },
    general: { icon: 'info', type: 'info' },
  };
  return styles[notificationType] || styles.general;
};

const ContentHeader = ({ onMenuClick, showMenuButton = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
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
                    <button
                      className="dropdown__action"
                      onClick={() => markAllAsRead()}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="dropdown__list">
                  {isLoading ? (
                    <div className="dropdown__empty">
                      <span className="material-icons">hourglass_empty</span>
                      <p>Loading...</p>
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.slice(0, 10).map((notification) => {
                      const style = getNotificationStyle(notification.notification_type);
                      return (
                        <div
                          key={notification.id}
                          className={`dropdown__item ${!notification.is_read ? 'dropdown__item--unread' : ''}`}
                          onClick={() => {
                            if (!notification.is_read) {
                              markAsRead(notification.id);
                            }
                            // Team invitations need to be accepted first - go to notifications page
                            if (notification.notification_type === 'team_invitation') {
                              navigate('/notifications');
                              setShowNotifications(false);
                              return;
                            }
                            // Navigate based on notification type
                            if (notification.metadata?.team_id) {
                              navigate(`/team/${notification.metadata.team_id}`);
                              setShowNotifications(false);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className={`dropdown__item-icon dropdown__item-icon--${style.type}`}>
                            <span className="material-icons">{style.icon}</span>
                          </div>
                          <div className="dropdown__item-content">
                            <p className="dropdown__item-title">{notification.title}</p>
                            <p className="dropdown__item-message">{notification.body}</p>
                            <span className="dropdown__item-time">
                              {formatRelativeTime(notification.created_at)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="dropdown__empty">
                      <span className="material-icons">notifications_none</span>
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <div className="dropdown__footer">
                  <button onClick={() => {
                    navigate('/notifications');
                    setShowNotifications(false);
                  }}>
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
