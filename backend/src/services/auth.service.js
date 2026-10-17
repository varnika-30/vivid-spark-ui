import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';

/**
 * Authenticates user credentials and generates JWT Access and Refresh Tokens.
 * @param {string} email - User email address
 * @param {string} password - User plain-text password
 * @returns {Promise<{ user: Object, accessToken: string, refreshToken: string }>}
 */
export const loginUser = async (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();

  // Find user by email including portal profile relations
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: {
      client: { select: { id: true, clientCode: true, companyName: true } },
      fleetManager: { select: { id: true, employeeCode: true, depotLocation: true } },
      driver: { select: { id: true, employeeCode: true, status: true, score: true, riskLevel: true, safetyGrade: true } },
    },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Compare plain-text password with bcrypt hash
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate tokens
  const payload = { userId: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Exclude passwordHash from returned user object
  const { passwordHash, ...safeUser } = user;

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};

/**
 * Validates a Refresh Token and generates a new Access Token.
 * @param {string} refreshToken - Refresh Token from HTTP-only cookie
 * @returns {Promise<{ accessToken: string }>} New Access Token
 */
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('Refresh token missing');
    error.statusCode = 401;
    throw error;
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }

  // Ensure target user exists in database
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, role: true },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    throw error;
  }

  const newAccessToken = generateAccessToken({ userId: user.id, role: user.role });

  return { accessToken: newAccessToken };
};

/**
 * Fetches user profile data by ID without password hash.
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} Safe user profile
 */
export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      client: { select: { id: true, clientCode: true, companyName: true, contactPerson: true, contactPhone: true, industry: true } },
      fleetManager: { select: { id: true, employeeCode: true, depotLocation: true, shiftDetails: true } },
      driver: { select: { id: true, employeeCode: true, status: true, score: true, riskLevel: true, safetyGrade: true, assignedDepot: true } },
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const { passwordHash, ...safeUser } = user;
  return safeUser;
};
