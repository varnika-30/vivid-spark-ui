import prisma from '../lib/prisma.js';

/**
 * Driver: Get completed trips for logged in driver.
 */
export const getDriverTrips = async (driverUserId) => {
  const driver = await prisma.driver.findUnique({
    where: { userId: driverUserId },
  });

  if (!driver) {
    const error = new Error('Driver profile not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.completedTrip.findMany({
    where: { driverId: driver.id },
    orderBy: { completionDate: 'desc' },
    include: {
      delivery: { select: { deliveryCode: true, pickupLocation: true, dropLocation: true } },
      vehicle: { select: { registrationNumber: true, makeModel: true } },
      tripEvents: { orderBy: { eventTimestamp: 'asc' } },
    },
  });
};

/**
 * Driver: Get single completed trip details.
 */
export const getDriverTripById = async (driverUserId, tripId) => {
  const driver = await prisma.driver.findUnique({
    where: { userId: driverUserId },
  });

  if (!driver) {
    const error = new Error('Driver profile not found');
    error.statusCode = 404;
    throw error;
  }

  const trip = await prisma.completedTrip.findUnique({
    where: { id: tripId },
    include: {
      delivery: true,
      vehicle: true,
      tripEvents: { orderBy: { eventTimestamp: 'asc' } },
      concerns: true,
    },
  });

  if (!trip) {
    const error = new Error('Completed trip not found');
    error.statusCode = 404;
    throw error;
  }

  if (trip.driverId !== driver.id) {
    const error = new Error('Forbidden: Access denied to this trip record');
    error.statusCode = 403;
    throw error;
  }

  return trip;
};

/**
 * Fleet Manager: Get all completed trips.
 */
export const getManagerTrips = async () => {
  return prisma.completedTrip.findMany({
    orderBy: { completionDate: 'desc' },
    include: {
      driver: { include: { user: { select: { fullName: true, avatarUrl: true } } } },
      vehicle: { select: { registrationNumber: true, makeModel: true } },
      delivery: { select: { deliveryCode: true, pickupLocation: true, dropLocation: true } },
      tripEvents: true,
    },
  });
};

/**
 * Fleet Manager: Get detailed trip report.
 */
export const getManagerTripById = async (tripId) => {
  const trip = await prisma.completedTrip.findUnique({
    where: { id: tripId },
    include: {
      driver: { include: { user: { select: { fullName: true, phoneNumber: true } } } },
      vehicle: true,
      delivery: { include: { client: { select: { companyName: true } } } },
      tripEvents: { orderBy: { eventTimestamp: 'asc' } },
      concerns: true,
    },
  });

  if (!trip) {
    const error = new Error('Completed trip not found');
    error.statusCode = 404;
    throw error;
  }

  return trip;
};
