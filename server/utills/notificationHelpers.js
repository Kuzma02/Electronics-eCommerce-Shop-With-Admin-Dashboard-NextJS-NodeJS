const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Generate ID using nanoid with dynamic import
 */
const generateId = async () => {
  try {
    const { nanoid } = await import('nanoid');
    return nanoid();
  } catch (error) {
    console.error('Error generating nanoid:', error);
    // Fallback ID generation
    return Math.random().toString(36).substr(2, 10);
  }
};

/**
 * Create an order update notification
 */
const createOrderUpdateNotification = async (userId, orderStatus, orderId, totalAmount = null) => {
  try {
    const statusMessages = {
      'pending': {
        title: 'Order Received',
        message: `Thank you! Your order #${orderId} has been received and is being processed.`,
        priority: 'NORMAL'
      },
      'confirmed': {
        title: 'Order Confirmed',
        message: `Great news! Your order #${orderId} has been confirmed and will be prepared for shipping.`,
        priority: 'HIGH'
      },
      'processing': {
        title: 'Order Processing',
        message: `Your order #${orderId} is currently being processed and will ship soon.`,
        priority: 'NORMAL'
      },
      'shipped': {
        title: 'Order Shipped',
        message: `Excellent! Your order #${orderId} has been shipped and is on its way to you.`,
        priority: 'HIGH'
      },
      'delivered': {
        title: 'Order Delivered',
        message: `Your order #${orderId} has been successfully delivered. We hope you love your new items!`,
        priority: 'HIGH'
      },
      'cancelled': {
        title: 'Order Cancelled',
        message: `Your order #${orderId} has been cancelled. If you have any questions, please contact our support.`,
        priority: 'URGENT'
      }
    };

    const statusInfo = statusMessages[orderStatus.toLowerCase()] || {
      title: 'Order Update',
      message: `Your order #${orderId} status has been updated to: ${orderStatus}`,
      priority: 'NORMAL'
    };

    const notificationId = await generateId();

    const notification = await prisma.notification.create({
      data: {
        id: notificationId,
        userId: userId,
        title: statusInfo.title,
        message: statusInfo.message,
        type: 'ORDER_UPDATE',
        priority: statusInfo.priority,
        isRead: false,
        metadata: {
          orderId: orderId,
          status: orderStatus,
          ...(totalAmount && { totalAmount: totalAmount })
        }
      }
    });

    console.log(`✅ Notification created for user ${userId}: ${statusInfo.title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating order notification:', error);
    throw error;
  }
};

/**
 * Create a payment status notification
 */
const createPaymentNotification = async (userId, paymentStatus, amount, orderId) => {
  try {
    const statusMessages = {
      'success': {
        title: 'Payment Successful',
        message: `Your payment of $${amount} has been successfully processed for order #${orderId}.`,
        priority: 'HIGH'
      },
      'failed': {
        title: 'Payment Failed',
        message: `Unfortunately, your payment of $${amount} for order #${orderId} could not be processed. Please try again.`,
        priority: 'URGENT'
      },
      'pending': {
        title: 'Payment Pending',
        message: `Your payment of $${amount} for order #${orderId} is currently being processed.`,
        priority: 'NORMAL'
      }
    };

    const statusInfo = statusMessages[paymentStatus.toLowerCase()] || {
      title: 'Payment Update',
      message: `Your payment status for order #${orderId} has been updated.`,
      priority: 'NORMAL'
    };

    const notificationId = await generateId();

    const notification = await prisma.notification.create({
      data: {
        id: notificationId,
        userId: userId,
        title: statusInfo.title,
        message: statusInfo.message,
        type: 'PAYMENT_STATUS',
        priority: statusInfo.priority,
        isRead: false,
        metadata: {
          orderId: orderId,
          paymentStatus: paymentStatus,
          amount: amount
        }
      }
    });

    console.log(`✅ Payment notification created for user ${userId}: ${statusInfo.title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating payment notification:', error);
    throw error;
  }
};

/**
 * Create a promotional notification
 */
const createPromotionNotification = async (userId, title, message, promoCode = null, discount = null) => {
  try {
    const notificationId = await generateId();

    const notification = await prisma.notification.create({
      data: {
        id: notificationId,
        userId: userId,
        title: title,
        message: message,
        type: 'PROMOTION',
        priority: 'NORMAL',
        isRead: false,
        metadata: {
          ...(promoCode && { promoCode: promoCode }),
          ...(discount && { discount: discount })
        }
      }
    });

    console.log(`✅ Promotion notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating promotion notification:', error);
    throw error;
  }
};

/**
 * Create a system alert notification
 */
const createSystemAlertNotification = async (userId, title, message, priority = 'HIGH') => {
  try {
    const notificationId = await generateId();

    const notification = await prisma.notification.create({
      data: {
        id: notificationId,
        userId: userId,
        title: title,
        message: message,
        type: 'SYSTEM_ALERT',
        priority: priority,
        isRead: false,
        metadata: {
          alertType: 'system'
        }
      }
    });

    console.log(`✅ System alert notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating system alert notification:', error);
    throw error;
  }
};

/**
 * Bulk create notifications for multiple users
 */
const createBulkNotifications = async (userIds, title, message, type = 'SYSTEM_ALERT', priority = 'NORMAL', metadata = {}) => {
  try {
    // Generate all IDs first
    const notificationData = await Promise.all(
      userIds.map(async (userId) => {
        const notificationId = await generateId();
        return {
          id: notificationId,
          userId: userId,
          title: title,
          message: message,
          type: type,
          priority: priority,
          isRead: false,
          metadata: metadata
        };
      })
    );

    await prisma.notification.createMany({
      data: notificationData
    });

    console.log(`✅ Bulk notifications created for ${userIds.length} users: ${title}`);
    return notificationData.length;
  } catch (error) {
    console.error('❌ Error creating bulk notifications:', error);
    throw error;
  }
};

module.exports = {
  createOrderUpdateNotification,
  createPaymentNotification,
  createPromotionNotification,
  createSystemAlertNotification,
  createBulkNotifications
};
