import express from 'express';
import * as requestController from '../controllers/delivery-request.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/role.middleware.js';

const router = express.Router();

// All client delivery request routes require client role authorization
router.use(authenticate, authorize('client'));

router.post('/', requestController.createRequest);
router.get('/', requestController.getClientRequests);
router.get('/:id', requestController.getClientRequestById);
router.patch('/:id', requestController.updateClientRequest);
router.delete('/:id', requestController.cancelClientRequest);

export default router;
