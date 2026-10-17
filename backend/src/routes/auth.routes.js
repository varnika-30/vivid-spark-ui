import express from 'express';
import { login, refresh, logout, getMe } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/login -> Authenticate with email/password
router.post('/login', login);

// POST /api/auth/refresh -> Issue new Access Token via HTTP-only Refresh Token cookie
router.post('/refresh', refresh);

// POST /api/auth/logout -> Clear Refresh Token cookie
router.post('/logout', logout);

// GET /api/auth/me -> Current user profile (Protected with Access Token)
router.get('/me', authenticate, getMe);

export default router;
