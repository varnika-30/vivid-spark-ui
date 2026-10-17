import prisma from '../lib/prisma.js';
import { generateEntityCode } from '../utils/codeGenerator.js';

/**
 * Creates a new delivery request associated with the logged-in client.
 */
export const createDeliveryRequest = async (userId, data) => {
  const client = await prisma.client.findUnique({
    where: { userId },
  });

  if (!client) {
    const error = new Error('Client profile not found for authenticated user');
    error.statusCode = 404;
    throw error;
  }

  const requestCode = generateEntityCode('REQ');

  const newRequest = await prisma.deliveryRequest.create({
    data: {
      requestCode,
      clientId: client.id,
      pickupAddress: data.pickupAddress,
      dropAddress: data.dropAddress,
      packageCategory: data.packageCategory || 'General Goods',
      weightKg: data.weightKg ? parseFloat(data.weightKg) : null,
      lengthCm: data.lengthCm ? parseFloat(data.lengthCm) : null,
      widthCm: data.widthCm ? parseFloat(data.widthCm) : null,
      heightCm: data.heightCm ? parseFloat(data.heightCm) : null,
      handleWithCare: Boolean(data.handleWithCare),
      priority: data.priority || 'normal',
      dateMode: data.dateMode || 'flexible',
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
      preferredTimeWindow: data.preferredTimeWindow || null,
      specialInstructions: data.specialInstructions || null,
      estimatedCost: data.estimatedCost ? parseFloat(data.estimatedCost) : null,
      estimatedTransitTime: data.estimatedTransitTime || null,
      status: 'pending',
    },
    include: {
      client: {
        select: { id: true, companyName: true, clientCode: true, contactPerson: true },
      },
    },
  });

  return newRequest;
};

/**
 * Returns all delivery requests belonging to the logged-in client.
 */
export const getClientDeliveryRequests = async (userId) => {
  const client = await prisma.client.findUnique({
    where: { userId },
  });

  if (!client) {
    const error = new Error('Client profile not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.deliveryRequest.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: 'desc' },
    include: {
      delivery: {
        select: {
          id: true,
          deliveryCode: true,
          status: true,
          driver: { select: { user: { select: { fullName: true } } } },
          vehicle: { select: { registrationNumber: true, makeModel: true } },
        },
      },
    },
  });
};

/**
 * Returns a specific delivery request for a client, enforcing ownership.
 */
export const getClientDeliveryRequestById = async (userId, requestId) => {
  const client = await prisma.client.findUnique({
    where: { userId },
  });

  if (!client) {
    const error = new Error('Client profile not found');
    error.statusCode = 404;
    throw error;
  }

  const request = await prisma.deliveryRequest.findUnique({
    where: { id: requestId },
    include: {
      client: { select: { id: true, companyName: true, clientCode: true } },
      delivery: {
        include: {
          driver: { include: { user: { select: { fullName: true, phoneNumber: true } } } },
          vehicle: true,
          trackingSteps: { orderBy: { sequence: 'asc' } },
        },
      },
    },
  });

  if (!request) {
    const error = new Error('Delivery request not found');
    error.statusCode = 404;
    throw error;
  }

  if (request.clientId !== client.id) {
    const error = new Error('Forbidden: Access denied to this delivery request');
    error.statusCode = 403;
    throw error;
  }

  return request;
};

/**
 * Updates a pending delivery request for a client.
 */
export const updateClientDeliveryRequest = async (userId, requestId, updateData) => {
  const request = await getClientDeliveryRequestById(userId, requestId);

  if (request.status !== 'pending') {
    const error = new Error(`Cannot modify request with status '${request.status}' once processing has started`);
    error.statusCode = 400;
    throw error;
  }

  const updatedRequest = await prisma.deliveryRequest.update({
    where: { id: requestId },
    data: {
      pickupAddress: updateData.pickupAddress ?? request.pickupAddress,
      dropAddress: updateData.dropAddress ?? request.dropAddress,
      packageCategory: updateData.packageCategory ?? request.packageCategory,
      weightKg: updateData.weightKg ? parseFloat(updateData.weightKg) : request.weightKg,
      handleWithCare: updateData.handleWithCare !== undefined ? Boolean(updateData.handleWithCare) : request.handleWithCare,
      priority: updateData.priority ?? request.priority,
      preferredDate: updateData.preferredDate ? new Date(updateData.preferredDate) : request.preferredDate,
      specialInstructions: updateData.specialInstructions ?? request.specialInstructions,
    },
  });

  return updatedRequest;
};

/**
 * Cancels a pending delivery request.
 */
export const cancelClientDeliveryRequest = async (userId, requestId) => {
  const request = await getClientDeliveryRequestById(userId, requestId);

  if (request.status !== 'pending' && request.status !== 'under_review') {
    const error = new Error(`Cannot cancel request with status '${request.status}'`);
    error.statusCode = 400;
    throw error;
  }

  return prisma.deliveryRequest.update({
    where: { id: requestId },
    data: { status: 'cancelled' },
  });
};

/**
 * Fleet Manager: List all delivery requests with optional status filter.
 */
export const getManagerDeliveryRequests = async (statusFilter) => {
  const where = statusFilter ? { status: statusFilter } : {};

  return prisma.deliveryRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { id: true, companyName: true, clientCode: true, contactPerson: true, contactPhone: true } },
      delivery: { select: { id: true, deliveryCode: true, status: true } },
      aiRecommendations: {
        take: 3,
        orderBy: { matchScore: 'desc' },
        include: { driver: { include: { user: { select: { fullName: true } } } } },
      },
    },
  });
};

/**
 * Fleet Manager: Get detailed delivery request.
 */
export const getManagerDeliveryRequestById = async (requestId) => {
  const request = await prisma.deliveryRequest.findUnique({
    where: { id: requestId },
    include: {
      client: true,
      delivery: {
        include: {
          driver: { include: { user: { select: { fullName: true, phoneNumber: true } } } },
          vehicle: true,
          trackingSteps: { orderBy: { sequence: 'asc' } },
        },
      },
      aiRecommendations: {
        orderBy: { matchScore: 'desc' },
        include: {
          driver: {
            include: {
              user: { select: { fullName: true, avatarUrl: true } },
            },
          },
        },
      },
    },
  });

  if (!request) {
    const error = new Error('Delivery request not found');
    error.statusCode = 404;
    throw error;
  }

  return request;
};

/**
 * Fleet Manager: Update request status (approve, reject, under_review, converted, cancelled).
 */
export const updateDeliveryRequestStatus = async (requestId, status) => {
  const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'converted', 'cancelled'];
  if (!validStatuses.includes(status)) {
    const error = new Error(`Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  const request = await prisma.deliveryRequest.findUnique({ where: { id: requestId } });
  if (!request) {
    const error = new Error('Delivery request not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.deliveryRequest.update({
    where: { id: requestId },
    data: { status },
  });
};
