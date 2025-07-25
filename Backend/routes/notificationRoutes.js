const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

/**
 * Notification Routes
 * Base path: /api/notifications
 */

// GET /api/notifications/:userId - Get all notifications for a user
router.get('/:userId', notificationController.getNotifications);

// GET /api/notifications/:userId/unread-count - Get unread notification count
router.get('/:userId/unread-count', notificationController.getUnreadCount);

// PUT /api/notifications/:notificationId/read - Mark notification as read
router.put('/:notificationId/read', notificationController.markAsRead);

// PUT /api/notifications/:userId/mark-all-read - Mark all notifications as read
router.put('/:userId/mark-all-read', notificationController.markAllAsRead);

// DELETE /api/notifications/:notificationId - Delete notification
router.delete('/:notificationId', notificationController.deleteNotification);

// POST /api/notifications - Create single notification (admin/system use)
router.post('/', notificationController.createNotification);

// POST /api/notifications/broadcast - Create broadcast notification (admin use)
router.post('/broadcast', notificationController.createBroadcastNotification);

module.exports = router;
