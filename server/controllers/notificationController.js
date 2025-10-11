const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get notifications for a user with filtering and pagination
 */
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      type,
      isRead,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter conditions
    const where = {
      userId,
      ...(type && { type }),
      ...(isRead !== undefined && { isRead: isRead === 'true' }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { message: { contains: search } }
        ]
      })
    };

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Build sort order
    const orderBy = {};
    if (sortBy === 'priority') {
      orderBy.priority = sortOrder;
      orderBy.createdAt = 'desc'; // Secondary sort by createdAt
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Get notifications with pagination
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, isRead: false }
      })
    ]);

    const totalPages = Math.ceil(total / take);

    res.json({
      notifications,
      total,
      page: parseInt(page),
      totalPages,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

/**
 * Create a new notification
 */
const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, priority = 'NORMAL', metadata } = req.body;

    // Validate required fields
    if (!userId || !title || !message || !type) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, title, message, type' 
      });
    }

    // Validate enum values
    const validTypes = ['ORDER_UPDATE', 'PAYMENT_STATUS', 'PROMOTION', 'SYSTEM_ALERT'];
    const validPriorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid notification type' });
    }

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid notification priority' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        priority,
        metadata
      }
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

/**
 * Update notification (mark as read/unread)
 */
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    if (typeof isRead !== 'boolean') {
      return res.status(400).json({ error: 'isRead must be a boolean value' });
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead }
    });

    res.json(notification);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Notification not found' });
    }
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

/**
 * Bulk mark notifications as read
 */
const bulkMarkAsRead = async (req, res) => {
  try {
    const { notificationIds, userId } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ error: 'notificationIds must be a non-empty array' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const updateResult = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: userId // Ensure user can only update their own notifications
      },
      data: { isRead: true }
    });

    res.json({ 
      message: `${updateResult.count} notifications marked as read`,
      updatedCount: updateResult.count
    });
  } catch (error) {
    console.error('Error bulk marking notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};

/**
 * Delete single notification
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Ensure user can only delete their own notifications
    const notification = await prisma.notification.findFirst({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await prisma.notification.delete({
      where: { id }
    });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

/**
 * Bulk delete notifications
 */
const bulkDeleteNotifications = async (req, res) => {
  try {
    const { notificationIds, userId } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ error: 'notificationIds must be a non-empty array' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const deleteResult = await prisma.notification.deleteMany({
      where: {
        id: { in: notificationIds },
        userId: userId // Ensure user can only delete their own notifications
      }
    });

    res.json({ 
      message: `${deleteResult.count} notifications deleted`,
      deletedCount: deleteResult.count
    });
  } catch (error) {
    console.error('Error bulk deleting notifications:', error);
    res.status(500).json({ error: 'Failed to delete notifications' });
  }
};

/**
 * Get unread notification count for a user
 */
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

module.exports = {
  getUserNotifications,
  createNotification,
  updateNotification,
  bulkMarkAsRead,
  deleteNotification,
  bulkDeleteNotifications,
  getUnreadCount
};