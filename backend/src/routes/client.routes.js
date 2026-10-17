import express from 'express';
import * as clientController from '../controllers/client.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// All Client Portal routes require client role authorization
router.use(authenticate, authorize('client'));

// Client Dashboard
router.get('/dashboard', clientController.getClientDashboard);

export default router;
