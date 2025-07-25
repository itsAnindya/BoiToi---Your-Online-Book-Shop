import React, { createContext, useContext, useState, useEffect } from 'react';
import NotificationService from '../services/notificationService';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pollingCleanup, setPollingCleanup] = useState(null);

  const { getCurrentUser } = useCart();
  const user = getCurrentUser();

  // Load notifications when user changes
  useEffect(() => {
    if (user?.id) {
      loadNotifications();
      loadUnreadCount();
      startPolling();
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
      stopPolling();
    }

    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [user?.id]);

  const loadNotifications = async (limit = 50, offset = 0) => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await NotificationService.getNotifications(user.id, limit, offset);
      
      if (offset === 0) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError(error.message);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!user?.id) return;

    try {
      const count = await NotificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
      // Don't show toast for unread count errors to avoid spam
    }
  };

  const markAsRead = async (notificationId) => {
    if (!user?.id) return;

    try {
      await NotificationService.markAsRead(notificationId, user.id);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.ID === notificationId
            ? { ...notification, IS_READ: 1 }
            : notification
        )
      );

      // Update unread count
      loadUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await NotificationService.markAllAsRead(user.id);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, IS_READ: 1 }))
      );

      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!user?.id) return;

    try {
      await NotificationService.deleteNotification(notificationId, user.id);
      
      // Update local state
      setNotifications(prev =>
        prev.filter(notification => notification.ID !== notificationId)
      );

      // Update unread count
      loadUnreadCount();
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const startPolling = () => {
    if (!user?.id || pollingCleanup) return;

    const cleanup = NotificationService.startPolling(
      user.id,
      (newUnreadCount) => {
        // Only update if count increased (new notifications)
        if (newUnreadCount > unreadCount) {
          setUnreadCount(newUnreadCount);
          // Optionally reload notifications to get new ones
          loadNotifications();
          
          // Show a subtle notification for new messages
          if (newUnreadCount > 0) {
            toast.success('You have new notifications!', {
              duration: 3000,
              icon: '🔔',
            });
          }
        } else {
          setUnreadCount(newUnreadCount);
        }
      },
      30000 // Poll every 30 seconds
    );

    setPollingCleanup(() => cleanup);
  };

  const stopPolling = () => {
    if (pollingCleanup) {
      pollingCleanup();
      setPollingCleanup(null);
    }
  };

  const refreshNotifications = () => {
    loadNotifications();
    loadUnreadCount();
  };

  // Helper function to get notification type styling
  const getNotificationTypeInfo = (type) => {
    const typeMap = {
      'SYSTEM': { color: 'bg-blue-500', icon: '🔔', label: 'System' },
      'ORDER': { color: 'bg-green-500', icon: '📦', label: 'Order' },
      'PAYMENT': { color: 'bg-yellow-500', icon: '💳', label: 'Payment' },
      'PROMOTION': { color: 'bg-purple-500', icon: '🎉', label: 'Promotion' },
      'DELIVERY': { color: 'bg-indigo-500', icon: '🚚', label: 'Delivery' },
    };

    return typeMap[type] || typeMap['SYSTEM'];
  };

  // Helper function to format notification date
  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const value = {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,

    // Actions
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,

    // Helpers
    getNotificationTypeInfo,
    formatNotificationDate,

    // Polling control
    startPolling,
    stopPolling,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
