import api from './api';

export const notificationsService = {
  // Get notifications for current user
  getNotifications: async (options = {}) => {
    const params = new URLSearchParams();
    if (options.unreadOnly) {
      params.append('unread_only', 'true');
    }
    if (options.limit) {
      params.append('limit', options.limit);
    }
    const queryString = params.toString();
    const url = `/v1/notifications/${queryString ? `?${queryString}` : ''}`;
    const response = await api.get(url);
    return response;
  },

  // Get single notification
  getNotification: async (notificationId) => {
    const response = await api.get(`/v1/notifications/${notificationId}/`);
    return response;
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    const response = await api.post(`/v1/notifications/${notificationId}/read/`);
    return response;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.post('/v1/notifications/mark-all-read/');
    return response;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/v1/notifications/${notificationId}/`);
    return response;
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/v1/notifications/unread-count/');
    return response;
  },
};
