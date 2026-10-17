import prisma from '../lib/prisma.js';
import { generateEntityCode } from '../utils/codeGenerator.js';

/**
 * Driver: Create a new driver concern / telematics context override.
 */
export const createDriverConcern = async (driverUserId, data) => {
  const driver = await prisma.driver.findUnique({
    where: { userId: driverUserId },
  });

  if (!driver) {
    const error = new Error('Driver profile not found');
    error.statusCode = 404;
    throw error;
  }

  const concernCode = generateEntityCode('CON');

  return prisma.driverConcern.create({
    data: {
      concernCode,
      driverId: driver.id,
      deliveryId: data.deliveryId || null,
      tripId: data.tripId || null,
      category: data.category || 'other',
      systemEventType: data.systemEventType || null,
      systemEventTimestamp: data.systemEventTimestamp ? new Date(data.systemEventTimestamp) : null,
      systemEventLocation: data.systemEventLocation || null,
      systemEventDetails: data.systemEventDetails || null,
      contextReason: data.contextReason || null,
      driverDescription: data.driverDescription,
      status: 'pending_review',
      submittedAt: new Date(),
    },
    include: {
      delivery: { select: { deliveryCode: true } },
      trip: { select: { tripCode: true } },
    },
  });
};

/**
 * Driver: Get all concerns submitted by driver.
 */
export const getDriverConcerns = async (driverUserId) => {
  const driver = await prisma.driver.findUnique({
    where: { userId: driverUserId },
  });

  if (!driver) {
    const error = new Error('Driver profile not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.driverConcern.findMany({
    where: { driverId: driver.id },
    orderBy: { submittedAt: 'desc' },
    include: {
      delivery: { select: { id: true, deliveryCode: true, status: true } },
      trip: { select: { id: true, tripCode: true, drivingScore: true } },
      reviewedByManager: { include: { user: { select: { fullName: true } } } },
    },
  });
};

/**
 * Driver: Get single concern by ID.
 */
export const getDriverConcernById = async (driverUserId, concernId) => {
  const driver = await prisma.driver.findUnique({
    where: { userId: driverUserId },
  });

  if (!driver) {
    const error = new Error('Driver profile not found');
    error.statusCode = 404;
    throw error;
  }

  const concern = await prisma.driverConcern.findUnique({
    where: { id: concernId },
    include: {
      delivery: true,
      trip: { include: { tripEvents: true } },
      reviewedByManager: { include: { user: { select: { fullName: true } } } },
    },
  });

  if (!concern) {
    const error = new Error('Driver concern not found');
    error.statusCode = 404;
    throw error;
  }

  if (concern.driverId !== driver.id) {
    const error = new Error('Forbidden: Access denied to this concern');
    error.statusCode = 403;
    throw error;
  }

  return concern;
};

/**
 * Fleet Manager: Get all driver concerns.
 */
export const getManagerConcerns = async (statusFilter) => {
  const where = statusFilter ? { status: statusFilter } : {};

  return prisma.driverConcern.findMany({
    where,
    orderBy: { submittedAt: 'desc' },
    include: {
      driver: { include: { user: { select: { fullName: true, avatarUrl: true } } } },
      delivery: { select: { id: true, deliveryCode: true } },
      trip: { select: { id: true, tripCode: true, drivingScore: true } },
      reviewedByManager: { include: { user: { select: { fullName: true } } } },
    },
  });
};

/**
 * Fleet Manager: Review and resolve driver concern.
 */
export const reviewManagerConcern = async (managerUserId, concernId, { status, managerReviewNotes }) => {
  const manager = await prisma.fleetManager.findUnique({
    where: { userId: managerUserId },
  });

  if (!manager) {
    const error = new Error('Fleet manager profile not found');
    error.statusCode = 404;
    throw error;
  }

  const validStatuses = ['pending_review', 'reviewed_verified', 'dismissed'];
  if (!validStatuses.includes(status)) {
    const error = new Error(`Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const concern = await prisma.driverConcern.findUnique({ where: { id: concernId } });
  if (!concern) {
    const error = new Error('Driver concern not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.driverConcern.update({
    where: { id: concernId },
    data: {
      status,
      managerReviewNotes: managerReviewNotes || concern.managerReviewNotes,
      reviewedByManagerId: manager.id,
      reviewedAt: new Date(),
    },
  });
};
