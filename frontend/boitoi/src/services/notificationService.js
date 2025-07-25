import { API_BASE_URL } from '../config';

class NotificationService {
  // Get all notifications for a user
  static async getNotifications(userId, limit = 50, offset = 0) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${userId}?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notifications');
      }

      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Get unread notification count
  static async getUnreadCount(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${userId}/unread-count`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch unread count');
      }

      return data.unread_count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark notification as read');
      }

      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${userId}/mark-all-read`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark all notifications as read');
      }

      return data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId, userId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete notification');
      }

      return data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Create notification (admin use)
  static async createNotification(userId, message, type = 'SYSTEM') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, message, type }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create notification');
      }

      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create broadcast notification (admin use)
  static async createBroadcastNotification(userIds, message, type = 'SYSTEM') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/broadcast`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userIds, message, type }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create broadcast notification');
      }

      return data;
    } catch (error) {
      console.error('Error creating broadcast notification:', error);
      throw error;
    }
  }

  // Polling function to check for new notifications
  static startPolling(userId, callback, interval = 30000) {
    let lastNotificationCount = 0;

    const poll = async () => {
      try {
        const unreadCount = await this.getUnreadCount(userId);
        
        if (unreadCount !== lastNotificationCount) {
          lastNotificationCount = unreadCount;
          callback(unreadCount);
        }
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    };

    // Initial check
    poll();

    // Set up interval
    const intervalId = setInterval(poll, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }
}

export default NotificationService;
