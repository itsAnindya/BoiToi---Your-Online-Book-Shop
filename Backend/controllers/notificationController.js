const db = require('../config/database');

const notificationController = {
  // Get all notifications for a user
  getNotifications: async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      const sql = `
        SELECT 
          ID,
          MESSAGE,
          TYPE,
          IS_READ,
          CREATED_AT
        FROM notifications 
        WHERE USER_ID = ? 
        ORDER BY CREATED_AT DESC 
        LIMIT ? OFFSET ?
      `;
      
      db.query(sql, [userId, parseInt(limit), parseInt(offset)], (err, results) => {
        if (err) {
          console.error('Error fetching notifications:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error fetching notifications',
            error: err.message 
          });
        }
        
        res.json({
          success: true,
          notifications: results,
          count: results.length
        });
      });
    } catch (error) {
      console.error('Error in getNotifications:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  // Get unread notification count
  getUnreadCount: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const sql = `
        SELECT COUNT(*) as unread_count 
        FROM notifications 
        WHERE USER_ID = ? AND IS_READ = 0
      `;
      
      db.query(sql, [userId], (err, results) => {
        if (err) {
          console.error('Error fetching unread count:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error fetching unread count',
            error: err.message 
          });
        }
        
        res.json({
          success: true,
          unread_count: results[0].unread_count
        });
      });
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const { userId } = req.body;
      
      const sql = `
        UPDATE notifications 
        SET IS_READ = 1 
        WHERE ID = ? AND USER_ID = ?
      `;
      
      db.query(sql, [notificationId, userId], (err, result) => {
        if (err) {
          console.error('Error marking notification as read:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error updating notification',
            error: err.message 
          });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: 'Notification not found or does not belong to user'
          });
        }
        
        res.json({
          success: true,
          message: 'Notification marked as read'
        });
      });
    } catch (error) {
      console.error('Error in markAsRead:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (req, res) => {
    try {
      const { userId } = req.params;
      
      const sql = `
        UPDATE notifications 
        SET IS_READ = 1 
        WHERE USER_ID = ? AND IS_READ = 0
      `;
      
      db.query(sql, [userId], (err, result) => {
        if (err) {
          console.error('Error marking all notifications as read:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error updating notifications',
            error: err.message 
          });
        }
        
        res.json({
          success: true,
          message: 'All notifications marked as read',
          updated_count: result.affectedRows
        });
      });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  // Delete notification
  deleteNotification: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const { userId } = req.body;
      
      const sql = `
        DELETE FROM notifications 
        WHERE ID = ? AND USER_ID = ?
      `;
      
      db.query(sql, [notificationId, userId], (err, result) => {
        if (err) {
          console.error('Error deleting notification:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error deleting notification',
            error: err.message 
          });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: 'Notification not found or does not belong to user'
          });
        }
        
        res.json({
          success: true,
          message: 'Notification deleted successfully'
        });
      });
    } catch (error) {
      console.error('Error in deleteNotification:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  // Create notification (for system use)
  createNotification: async (req, res) => {
    try {
      const { userId, message, type = 'SYSTEM' } = req.body;
      
      if (!userId || !message) {
        return res.status(400).json({
          success: false,
          message: 'User ID and message are required'
        });
      }
      
      const sql = `
        INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
        VALUES (?, ?, ?, 0, NOW())
      `;
      
      db.query(sql, [userId, message, type], (err, result) => {
        if (err) {
          console.error('Error creating notification:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error creating notification',
            error: err.message 
          });
        }
        
        res.status(201).json({
          success: true,
          message: 'Notification created successfully',
          notificationId: result.insertId
        });
      });
    } catch (error) {
      console.error('Error in createNotification:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  // Create notification for multiple users (broadcast)
  createBroadcastNotification: async (req, res) => {
    try {
      const { userIds, message, type = 'SYSTEM' } = req.body;
      
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !message) {
        return res.status(400).json({
          success: false,
          message: 'User IDs array and message are required'
        });
      }
      
      const values = userIds.map(userId => [userId, message, type, 0]);
      const placeholders = userIds.map(() => '(?, ?, ?, ?)').join(', ');
      
      const sql = `
        INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ)
        VALUES ${placeholders}
      `;
      
      const flatValues = values.flat();
      
      db.query(sql, flatValues, (err, result) => {
        if (err) {
          console.error('Error creating broadcast notification:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error creating broadcast notification',
            error: err.message 
          });
        }
        
        res.status(201).json({
          success: true,
          message: 'Broadcast notification created successfully',
          affected_users: result.affectedRows
        });
      });
    } catch (error) {
      console.error('Error in createBroadcastNotification:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  },

  // Helper function to create notification (for internal use)
  createNotificationInternal: (userId, message, type = 'SYSTEM') => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO notifications (USER_ID, MESSAGE, TYPE, IS_READ, CREATED_AT)
        VALUES (?, ?, ?, 0, NOW())
      `;
      
      db.query(sql, [userId, message, type], (err, result) => {
        if (err) {
          console.error('Error creating internal notification:', err);
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  }
};

module.exports = notificationController;
