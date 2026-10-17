import express from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Notifications routes require authentication
router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.get('/:id', notificationController.getNotificationById);
router.patch('/read-all', notificationController.markAllAsRead);
router.patch('/:id/read', notificationController.markAsRead);

export default router;
