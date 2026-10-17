import prisma from '../lib/prisma.js';

/**
 * Fleet Manager Dashboard Analytics & Summary
 */
export const getManagerDashboard = async () => {
  const [
    totalDrivers,
    availableDrivers,
    onTripDrivers,
    totalVehicles,
    activeVehicles,
    pendingRequests,
    activeDeliveries,
    completedDeliveriesCount,
    pendingConcernsCount,
    recentRequests,
    recentDeliveries,
  ] = await Promise.all([
    prisma.driver.count(),
    prisma.driver.count({ where: { status: 'available' } }),
    prisma.driver.count({ where: { status: 'on_trip' } }),
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: 'active' } }),
    prisma.deliveryRequest.count({ where: { status: 'pending' } }),
    prisma.delivery.count({ where: { status: { in: ['assigned', 'reached_pickup', 'package_picked_up', 'in_transit', 'reached_destination'] } } }),
    prisma.delivery.count({ where: { status: 'completed' } }),
    prisma.driverConcern.count({ where: { status: 'pending_review' } }),
    prisma.deliveryRequest.findMany({
      where: { status: 'pending' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { companyName: true } } },
    }),
    prisma.delivery.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { companyName: true } },
        driver: { include: { user: { select: { fullName: true } } } },
        vehicle: { select: { registrationNumber: true } },
      },
    }),
  ]);

  return {
    metrics: {
      totalDrivers,
      availableDrivers,
      onTripDrivers,
      totalVehicles,
      activeVehicles,
      pendingRequests,
      activeDeliveries,
      completedDeliveriesCount,
      pendingConcernsCount,
    },
    recentRequests,
    recentDeliveries,
  };
};

/**
 * Client Dashboard Analytics & Summary
 */
export const getClientDashboard = async (userId) => {
  const client = await prisma.client.findUnique({ where: { userId } });
  if (!client) {
    const error = new Error('Client profile not found');
    error.statusCode = 404;
    throw error;
  }

  const [
    totalRequests,
    pendingRequests,
    activeDeliveries,
    completedDeliveries,
    recentRequests,
  ] = await Promise.all([
    prisma.deliveryRequest.count({ where: { clientId: client.id } }),
    prisma.deliveryRequest.count({ where: { clientId: client.id, status: 'pending' } }),
    prisma.delivery.count({
      where: {
        clientId: client.id,
        status: { in: ['assigned', 'reached_pickup', 'package_picked_up', 'in_transit', 'reached_destination'] },
      },
    }),
    prisma.delivery.count({ where: { clientId: client.id, status: 'completed' } }),
    prisma.deliveryRequest.findMany({
      where: { clientId: client.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        delivery: {
          select: {
            id: true,
            deliveryCode: true,
            status: true,
            trackingSteps: { orderBy: { sequence: 'asc' } },
          },
        },
      },
    }),
  ]);

  return {
    clientInfo: {
      companyName: client.companyName,
      clientCode: client.clientCode,
    },
    metrics: {
      totalRequests,
      pendingRequests,
      activeDeliveries,
      completedDeliveries,
    },
    recentRequests,
  };
};

/**
 * Driver Dashboard Analytics & Summary
 */
export const getDriverDashboard = async (userId) => {
  const driver = await prisma.driver.findUnique({
    where: { userId },
    include: {
      user: { select: { fullName: true, avatarUrl: true } },
      vehicleAssignments: {
        where: { unassignedAt: null },
        include: { vehicle: true },
      },
    },
  });

  if (!driver) {
    const error = new Error('Driver profile not found');
    error.statusCode = 404;
    throw error;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    activeDelivery,
    todaySchedule,
    recentTrip,
    activeGoals,
  ] = await Promise.all([
    prisma.delivery.findFirst({
      where: {
        driverId: driver.id,
        status: { in: ['assigned', 'reached_pickup', 'package_picked_up', 'in_transit', 'reached_destination'] },
      },
      include: {
        client: { select: { companyName: true, contactPhone: true } },
        trackingSteps: { orderBy: { sequence: 'asc' } },
      },
    }),
    prisma.driverSchedule.findFirst({
      where: { driverId: driver.id },
      orderBy: { scheduleDate: 'desc' },
      include: { stops: { orderBy: { sequence: 'asc' } } },
    }),
    prisma.completedTrip.findFirst({
      where: { driverId: driver.id },
      orderBy: { completionDate: 'desc' },
    }),
    prisma.driverCoachingGoal.findMany({
      where: { driverId: driver.id, isActive: true },
      take: 3,
    }),
  ]);

  return {
    driverProfile: {
      id: driver.id,
      fullName: driver.user.fullName,
      status: driver.status,
      score: driver.score,
      riskLevel: driver.riskLevel,
      safetyGrade: driver.safetyGrade,
      assignedVehicle: driver.vehicleAssignments[0]?.vehicle || null,
    },
    activeDelivery,
    todaySchedule,
    recentTrip,
    activeGoals,
  };
};
