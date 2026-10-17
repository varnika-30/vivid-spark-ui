import jwt from 'jsonwebtoken';

const getAccessTokenSecret = () => process.env.ACCESS_TOKEN_SECRET || 'fleethub_access_token_default_secret_key';
const getRefreshTokenSecret = () => process.env.REFRESH_TOKEN_SECRET || 'fleethub_refresh_token_default_secret_key';
const getAccessTokenExpiry = () => process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
const getRefreshTokenExpiry = () => process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Generate JWT Access Token
 * @param {Object} payload - Object containing userId and role
 * @returns {string} Signed Access Token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(
    { userId: payload.userId, role: payload.role },
    getAccessTokenSecret(),
    { expiresIn: getAccessTokenExpiry() }
  );
};

/**
 * Generate JWT Refresh Token
 * @param {Object} payload - Object containing userId and role
 * @returns {string} Signed Refresh Token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(
    { userId: payload.userId, role: payload.role },
    getRefreshTokenSecret(),
    { expiresIn: getRefreshTokenExpiry() }
  );
};

/**
 * Verify JWT Access Token
 * @param {string} token - Access Token string
 * @returns {Object} Decoded payload
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, getAccessTokenSecret());
};

/**
 * Verify JWT Refresh Token
 * @param {string} token - Refresh Token string
 * @returns {Object} Decoded payload
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshTokenSecret());
};
