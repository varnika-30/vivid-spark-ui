import express from 'express';
import { getHealth, getDbHealth } from '../controllers/health.controller.js';

const router = express.Router();

// GET /api/health -> Server health check
router.get('/', getHealth);

// GET /api/health/db -> Database connection & query test endpoint
router.get('/db', getDbHealth);

export default router;
