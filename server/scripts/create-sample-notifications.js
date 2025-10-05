const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('nanoid');

const prisma = new PrismaClient();

async function createSampleNotifications() {
  try {
    // Get the first user from database
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    console.log(`Creating sample notifications for user: ${user.email}`);

    // Sample notifications data
    const notifications = [
      {
        id: nanoid(),
        userId: user.id,
        title: 'Order Shipped',
        message: 'Great news! Your order #12345 has been shipped and is on its way to you.',
        type: 'ORDER_UPDATE',
        priority: 'HIGH',
        isRead: false,
        metadata: { orderId: '12345', status: 'shipped' }
      },
      {
        id: nanoid(),
        userId: user.id,
        title: 'Payment Successful',
        message: 'Your payment of $299.99 has been successfully processed.',
        type: 'PAYMENT_STATUS',
        priority: 'HIGH',
        isRead: false,
        metadata: { amount: 299.99, paymentStatus: 'success' }
      },
      {
        id: nanoid(),
        userId: user.id,
        title: 'Special Offer - 20% Off!',
        message: 'Don\'t miss out! Get 20% off on all electronics. Use code SAVE20.',
        type: 'PROMOTION',
        priority: 'NORMAL',
        isRead: true,
        metadata: { promoCode: 'SAVE20', discount: 20 }
      },
      {
        id: nanoid(),
        userId: user.id,
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur on Sunday from 2-4 AM. Some services may be temporarily unavailable.',
        type: 'SYSTEM_ALERT',
        priority: 'NORMAL',
        isRead: false,
        metadata: { maintenanceDate: '2024-01-15' }
      },
      {
        id: nanoid(),
        userId: user.id,
        title: 'Order Confirmed',
        message: 'Your order #12344 has been confirmed and will be processed soon.',
        type: 'ORDER_UPDATE',
        priority: 'NORMAL',
        isRead: true,
        metadata: { orderId: '12344', status: 'confirmed' }
      },
      {
        id: nanoid(),
        userId: user.id,
        title: 'Welcome Bonus',
        message: 'Welcome to our platform! Enjoy free shipping on your first order.',
        type: 'PROMOTION',
        priority: 'NORMAL',
        isRead: false,
        metadata: { welcomeBonus: true }
      }
    ];

    // Create notifications using createMany for better performance
    await prisma.notification.createMany({
      data: notifications
    });

    console.log(`Successfully created ${notifications.length} sample notifications!`);
    
    // Display summary
    const unreadCount = await prisma.notification.count({
      where: { userId: user.id, isRead: false }
    });
    
    console.log(`Unread notifications: ${unreadCount}`);
    
  } catch (error) {
    console.error('Error creating sample notifications:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSampleNotifications();