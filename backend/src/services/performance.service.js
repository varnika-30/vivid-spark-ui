import prisma from '../lib/prisma.js';

/**
 * Driver: Get performance data (daily scores and coaching goals).
 */
export const getDriverPerformance = async (driverUserId) => {
  const driver = await prisma.driver.findUnique({
    where: { userId: driverUserId },
  });

  if (!driver) {
    const error = new Error('Driver profile not found');
    error.statusCode = 404;
    throw error;
  }

  const dailyScores = await prisma.driverDailyScore.findMany({
    where: { driverId: driver.id },
    orderBy: { scoreDate: 'desc' },
    take: 30,
  });

  const coachingGoals = await prisma.driverCoachingGoal.findMany({
    where: { driverId: driver.id, isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return {
    driver: {
      id: driver.id,
      score: driver.score,
      riskLevel: driver.riskLevel,
      safetyGrade: driver.safetyGrade,
      totalTripsCompleted: driver.totalTripsCompleted,
      rating: driver.rating,
    },
    dailyScores,
    coachingGoals,
  };
};

/**
 * Fleet Manager: Get performance data for a specific driver.
 */
export const getManagerDriverPerformance = async (driverId) => {
  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    include: {
      user: { select: { fullName: true, email: true, phoneNumber: true, avatarUrl: true } },
    },
  });

  if (!driver) {
    const error = new Error('Driver not found');
    error.statusCode = 404;
    throw error;
  }

  const dailyScores = await prisma.driverDailyScore.findMany({
    where: { driverId },
    orderBy: { scoreDate: 'desc' },
    take: 30,
  });

  const coachingGoals = await prisma.driverCoachingGoal.findMany({
    where: { driverId },
    orderBy: { createdAt: 'desc' },
  });

  return {
    driver,
    dailyScores,
    coachingGoals,
  };
};

/**
 * Fleet Manager: Get AI Driver Recommendations for a delivery request.
 */
export const getManagerAiRecommendations = async (requestId) => {
  const recommendations = await prisma.aiDriverRecommendation.findMany({
    where: requestId ? { requestId } : {},
    orderBy: { matchScore: 'desc' },
    include: {
      request: { select: { id: true, requestCode: true, pickupAddress: true, dropAddress: true } },
      driver: {
        include: {
          user: { select: { fullName: true, avatarUrl: true, phoneNumber: true } },
        },
      },
    },
  });

  return recommendations;
};
