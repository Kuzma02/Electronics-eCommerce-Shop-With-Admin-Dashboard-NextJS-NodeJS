const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  createNotification,
  updateNotification,
  bulkMarkAsRead,
  deleteNotification,
  bulkDeleteNotifications,
  getUnreadCount
} = require('../controllers/notificationController');

// GET /api/notifications/:userId/unread-count - Get unread notification count
router.get('/:userId/unread-count', getUnreadCount);

// GET /api/notifications/:userId - Get user notifications with filtering and pagination
router.get('/:userId', getUserNotifications);

// POST /api/notifications - Create new notification
router.post('/', createNotification);

// POST /api/notifications/mark-read - Bulk mark notifications as read
router.post('/mark-read', bulkMarkAsRead);

// DELETE /api/notifications/bulk - Bulk delete notifications
router.delete('/bulk', bulkDeleteNotifications);

// PUT /api/notifications/:id - Update notification (mark as read/unread)
router.put('/:id', updateNotification);

// DELETE /api/notifications/:id - Delete single notification
router.delete('/:id', deleteNotification);

module.exports = router;