import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Notification Context
 * Manages application-wide notifications and alerts
 */
const NotificationContext = createContext();

/**
 * Custom hook to access notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

/**
 * Notification Provider Component
 * Provides notification functionality throughout the app
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  /**
   * Show notification with specified type
   * @param {string} message - Notification message
   * @param {string} type - Type: success, error, warning, info
   */
  const showNotification = (message, type = 'info') => {
    // Show toast notification
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'warning':
        toast(message, {
          icon: '⚠️',
          style: {
            background: '#fef3c7',
            color: '#92400e',
          },
        });
        break;
      default:
        toast(message);
    }

    // Add to notifications array for history
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep last 5
  };

  /**
   * Clear specific notification
   */
  const clearNotification = (id) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  /**
   * Clear all notifications
   */
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    notifications,
    showNotification,
    clearNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
