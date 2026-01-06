import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context';
import ContentHeader from '../components/common/Navigation/ContentHeader';
import './NotificationsPage.css';

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

// Map notification types to icon and styles
const getNotificationStyle = (notificationType) => {
  const styles = {
    team_invitation: { icon: 'group_add', color: '#3b82f6', label: 'Team Invitation' },
    invitation_accepted: { icon: 'check_circle', color: '#22c55e', label: 'Invitation Accepted' },
    member_joined: { icon: 'person_add', color: '#22c55e', label: 'Member Joined' },
    member_left: { icon: 'person_remove', color: '#f59e0b', label: 'Member Left' },
    role_changed: { icon: 'swap_horiz', color: '#3b82f6', label: 'Role Changed' },
    affirmation: { icon: 'favorite', color: '#ec4899', label: 'Affirmation' },
    question_completed: { icon: 'task_alt', color: '#22c55e', label: 'Question Completed' },
    chat_message: { icon: 'chat', color: '#3b82f6', label: 'Message' },
    general: { icon: 'info', color: '#6b7280', label: 'General' },
  };
  return styles[notificationType] || styles.general;
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [typeFilter, setTypeFilter] = useState('all');

  // Get unique notification types for filter dropdown
  const notificationTypes = [...new Set(notifications.map(n => n.notification_type))];

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.is_read) return false;
    if (filter === 'read' && !n.is_read) return false;
    if (typeFilter !== 'all' && n.notification_type !== typeFilter) return false;
    return true;
  });

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    // Navigate based on notification type
    if (notification.metadata?.team_id) {
      navigate(`/team/${notification.metadata.team_id}`);
    }
  };

  return (
    <div className="notifications-page">
      <ContentHeader />

      <div className="notifications-page__content">
        <div className="notifications-page__header">
          <div className="notifications-page__title">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <span className="notifications-page__badge">{unreadCount} unread</span>
            )}
          </div>

          <div className="notifications-page__actions">
            {unreadCount > 0 && (
              <button
                className="notifications-page__mark-all"
                onClick={markAllAsRead}
              >
                <span className="material-icons">done_all</span>
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="notifications-page__filters">
          <div className="notifications-page__filter-group">
            <button
              className={`notifications-page__filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`notifications-page__filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            <button
              className={`notifications-page__filter-btn ${filter === 'read' ? 'active' : ''}`}
              onClick={() => setFilter('read')}
            >
              Read
            </button>
          </div>

          {notificationTypes.length > 1 && (
            <select
              className="notifications-page__type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All types</option>
              {notificationTypes.map(type => (
                <option key={type} value={type}>
                  {getNotificationStyle(type).label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="notifications-page__list">
          {isLoading ? (
            <div className="notifications-page__empty">
              <span className="material-icons">hourglass_empty</span>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const style = getNotificationStyle(notification.notification_type);
              return (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.is_read ? 'notification-item--unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div
                    className="notification-item__icon"
                    style={{ backgroundColor: `${style.color}15`, color: style.color }}
                  >
                    <span className="material-icons">{style.icon}</span>
                  </div>

                  <div className="notification-item__content">
                    <div className="notification-item__header">
                      <span className="notification-item__type" style={{ color: style.color }}>
                        {style.label}
                      </span>
                      <span className="notification-item__time">
                        {formatRelativeTime(notification.created_at)}
                      </span>
                    </div>
                    <h3 className="notification-item__title">{notification.title}</h3>
                    {notification.body && (
                      <p className="notification-item__body">{notification.body}</p>
                    )}
                  </div>

                  {!notification.is_read && (
                    <div className="notification-item__unread-dot" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="notifications-page__empty">
              <span className="material-icons">notifications_none</span>
              <p>
                {filter === 'unread'
                  ? 'No unread notifications'
                  : filter === 'read'
                  ? 'No read notifications'
                  : 'No notifications yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
