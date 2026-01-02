import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContentHeader.css';

const ContentHeader = ({ onMenuClick, showMenuButton = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter content
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
            placeholder="Search questions, recordings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="content-header__search-input"
          />
        </form>
      </div>

      <div className="content-header__right">
        {/* Notification Bell */}
        <div className="content-header__notifications">
          <button
            className="content-header__notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <span className="material-icons">notifications</span>
            {unreadCount > 0 && (
              <span className="content-header__notification-badge">{unreadCount}</span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              <div
                className="content-header__notification-backdrop"
                onClick={() => setShowNotifications(false)}
              />
              <div className="content-header__notification-dropdown">
                <div className="notification-dropdown__header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="notification-dropdown__mark-read">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="notification-dropdown__list">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? 'notification-item--unread' : ''}`}
                      >
                        <div className={`notification-item__icon notification-item__icon--${notification.type}`}>
                          <span className="material-icons">
                            {notification.type === 'success' ? 'check_circle' : 'info'}
                          </span>
                        </div>
                        <div className="notification-item__content">
                          <p className="notification-item__title">{notification.title}</p>
                          <p className="notification-item__message">{notification.message}</p>
                          <span className="notification-item__time">{notification.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-dropdown__empty">
                      <span className="material-icons">notifications_none</span>
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <div className="notification-dropdown__footer">
                  <button onClick={() => navigate('/notifications')}>
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default ContentHeader;
