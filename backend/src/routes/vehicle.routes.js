import express from 'express';
import * as vehicleController from '../controllers/vehicle.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// Vehicle management routes require manager authorization
router.use(authenticate, authorize('manager'));

router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.post('/', vehicleController.createVehicle);
router.patch('/:id', vehicleController.updateVehicle);
router.post('/assign', vehicleController.assignVehicle);

export default router;
