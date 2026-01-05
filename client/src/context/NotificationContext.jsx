import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { websocketService } from '../services/websocket';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { tokens, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [teamActivities, setTeamActivities] = useState([]);

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (tokens?.access && user) {
      websocketService.connect(tokens.access);
    } else {
      websocketService.disconnect();
    }

    return () => {
      websocketService.disconnect();
    };
  }, [tokens?.access, user]);

  // Set up WebSocket event listeners
  useEffect(() => {
    const handleConnected = () => {
      setIsConnected(true);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
    };

    const handleNotification = (data) => {
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    const handleToast = (data) => {
      const { message, level } = data;
      switch (level) {
        case 'success':
          toast.success(message);
          break;
        case 'error':
          toast.error(message);
          break;
        case 'warning':
          toast.warning(message);
          break;
        default:
          toast.info(message);
      }
    };

    const handleBadgeUpdate = (data) => {
      setUnreadCount(data.unread_count);
    };

    const handleTeamActivity = (data) => {
      setTeamActivities(prev => [data.activity, ...prev.slice(0, 49)]);
    };

    const handleQuestionCompleted = (data) => {
      toast.info(`${data.user_name} completed a question!`);
      setTeamActivities(prev => [{
        type: 'question_completed',
        user_name: data.user_name,
        question_id: data.question_id,
        team_id: data.team_id,
        timestamp: new Date().toISOString(),
      }, ...prev.slice(0, 49)]);
    };

    const handleAffirmationReceived = (data) => {
      toast.success(`${data.from_user_name} affirmed your choices!`);
    };

    const handleChatMessage = (data) => {
      // Only show toast if not viewing that channel
      // (This logic can be expanded based on current view state)
      setTeamActivities(prev => [{
        type: 'chat_message',
        message: data.message,
        team_id: data.team_id,
        channel_id: data.channel_id,
        timestamp: new Date().toISOString(),
      }, ...prev.slice(0, 49)]);
    };

    // Subscribe to events
    websocketService.on('connected', handleConnected);
    websocketService.on('disconnected', handleDisconnected);
    websocketService.on('notification', handleNotification);
    websocketService.on('toast', handleToast);
    websocketService.on('badge_update', handleBadgeUpdate);
    websocketService.on('team_activity', handleTeamActivity);
    websocketService.on('question_completed', handleQuestionCompleted);
    websocketService.on('affirmation_received', handleAffirmationReceived);
    websocketService.on('chat_message', handleChatMessage);

    // Cleanup
    return () => {
      websocketService.off('connected', handleConnected);
      websocketService.off('disconnected', handleDisconnected);
      websocketService.off('notification', handleNotification);
      websocketService.off('toast', handleToast);
      websocketService.off('badge_update', handleBadgeUpdate);
      websocketService.off('team_activity', handleTeamActivity);
      websocketService.off('question_completed', handleQuestionCompleted);
      websocketService.off('affirmation_received', handleAffirmationReceived);
      websocketService.off('chat_message', handleChatMessage);
    };
  }, []);

  const markAsRead = useCallback((notificationId) => {
    websocketService.markNotificationRead(notificationId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    notifications.forEach(n => {
      if (!n.read) {
        websocketService.markNotificationRead(n.id);
      }
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, [notifications]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isConnected,
      teamActivities,
      markAsRead,
      markAllAsRead,
      clearNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
