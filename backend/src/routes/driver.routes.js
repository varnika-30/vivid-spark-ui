import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// All Driver routes require driver role authorization
router.use(authenticate, authorize('driver'));

// Driver Dashboard
router.get('/dashboard', dashboardController.getDriverDashboard);

// Driver Profile & Performance
router.get('/profile', driverController.getProfile);
router.get('/performance', driverController.getPerformance);

// Assigned Deliveries & Real-Time Tracking
router.get('/deliveries', driverController.getDeliveries);
router.get('/deliveries/:id', driverController.getDeliveryById);
router.patch('/deliveries/:id/tracking', driverController.updateTrackingStep);

// Shift Schedule & Stops
router.get('/schedule', driverController.getSchedule);
router.patch('/schedule/stops/:stopId', driverController.updateScheduleStop);

// Concerns & Overrides
router.post('/concerns', driverController.createConcern);
router.get('/concerns', driverController.getConcerns);
router.get('/concerns/:id', driverController.getConcernById);

// Completed Trips History
router.get('/trips', driverController.getTrips);
router.get('/trips/:id', driverController.getTripById);

export default router;
