import prisma from '../lib/prisma.js';

/**
 * Fleet Manager: Get all vehicles with optional status filter.
 */
export const getAllVehicles = async (statusFilter) => {
  const where = statusFilter ? { status: statusFilter } : {};

  return prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      vehicleAssignments: {
        where: { unassignedAt: null },
        include: {
          driver: { include: { user: { select: { fullName: true, phoneNumber: true } } } },
        },
      },
    },
  });
};

/**
 * Fleet Manager: Get single vehicle details.
 */
export const getVehicleById = async (vehicleId) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      vehicleAssignments: {
        orderBy: { assignedAt: 'desc' },
        include: {
          driver: { include: { user: { select: { fullName: true, phoneNumber: true } } } },
        },
      },
      deliveries: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, deliveryCode: true, status: true, expectedDeliveryTime: true },
      },
    },
  });

  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  return vehicle;
};

/**
 * Fleet Manager: Create new vehicle.
 */
export const createVehicle = async (data) => {
  const existing = await prisma.vehicle.findUnique({
    where: { registrationNumber: data.registrationNumber },
  });

  if (existing) {
    const error = new Error(`Vehicle with registration number '${data.registrationNumber}' already exists`);
    error.statusCode = 400;
    throw error;
  }

  return prisma.vehicle.create({
    data: {
      registrationNumber: data.registrationNumber,
      makeModel: data.makeModel,
      vehicleType: data.vehicleType,
      capacityKg: data.capacityKg ? parseFloat(data.capacityKg) : null,
      fuelType: data.fuelType || 'Diesel',
      status: data.status || 'active',
      telematicsDeviceId: data.telematicsDeviceId || null,
    },
  });
};

/**
 * Fleet Manager: Update vehicle status or details.
 */
export const updateVehicle = async (vehicleId, data) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  return prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      makeModel: data.makeModel ?? vehicle.makeModel,
      vehicleType: data.vehicleType ?? vehicle.vehicleType,
      capacityKg: data.capacityKg ? parseFloat(data.capacityKg) : vehicle.capacityKg,
      fuelType: data.fuelType ?? vehicle.fuelType,
      status: data.status ?? vehicle.status,
      telematicsDeviceId: data.telematicsDeviceId ?? vehicle.telematicsDeviceId,
    },
  });
};

/**
 * Fleet Manager: Assign vehicle to driver.
 */
export const assignVehicleToDriver = async (driverId, vehicleId, notes) => {
  const driver = await prisma.driver.findUnique({ where: { id: driverId } });
  if (!driver) {
    const error = new Error('Driver not found');
    error.statusCode = 404;
    throw error;
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) {
    const error = new Error('Vehicle not found');
    error.statusCode = 404;
    throw error;
  }

  // Unassign any current active vehicle assignment for this driver
  await prisma.vehicleAssignment.updateMany({
    where: { driverId, unassignedAt: null },
    data: { unassignedAt: new Date() },
  });

  // Create new active assignment
  return prisma.vehicleAssignment.create({
    data: {
      driverId,
      vehicleId,
      assignedAt: new Date(),
      assignmentNotes: notes || null,
    },
    include: {
      driver: { include: { user: { select: { fullName: true } } } },
      vehicle: true,
    },
  });
};
