import express from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import deliveryRequestRoutes from './delivery-request.routes.js';
import managerRoutes from './manager.routes.js';
import driverRoutes from './driver.routes.js';
import clientRoutes from './client.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import notificationRoutes from './notification.routes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/delivery-requests', deliveryRequestRoutes);
router.use('/manager', managerRoutes);
router.use('/driver', driverRoutes);
router.use('/client', clientRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/notifications', notificationRoutes);

export default router;
