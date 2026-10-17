import prisma from '../lib/prisma.js';

/**
 * Get all notifications for the authenticated user.
 */
export const getUserNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Get single notification by ID.
 */
export const getNotificationById = async (userId, notificationId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }

  if (notification.userId !== userId) {
    const error = new Error('Forbidden: Access denied to this notification');
    error.statusCode = 403;
    throw error;
  }

  return notification;
};

/**
 * Mark a single notification as read.
 */
export const markNotificationAsRead = async (userId, notificationId) => {
  const notification = await getNotificationById(userId, notificationId);

  return prisma.notification.update({
    where: { id: notification.id },
    data: { isRead: true },
  });
};

/**
 * Mark all notifications for user as read.
 */
export const markAllNotificationsAsRead = async (userId) => {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};
