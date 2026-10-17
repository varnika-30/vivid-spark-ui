import { verifyAccessToken } from '../utils/jwt.js';

/**
 * Authentication Middleware
 * Validates JWT Access Token from 'Authorization: Bearer <token>' header.
 * Attaches decoded user payload ({ userId, role }) to req.user.
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing or invalid',
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing',
      });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
    });
  }
};

export default authenticate;
