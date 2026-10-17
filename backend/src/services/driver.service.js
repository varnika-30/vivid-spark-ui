import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

/**
 * Fleet Manager: Get all drivers from PostgreSQL.
 */
export const getAllDrivers = async () => {
  const drivers = await prisma.driver.findMany({
    include: {
      user: {
        select: { id: true, email: true, fullName: true, phoneNumber: true, avatarUrl: true, createdAt: true },
      },
      reportingManager: {
        include: { user: { select: { fullName: true, phoneNumber: true } } },
      },
      vehicleAssignments: {
        where: { unassignedAt: null },
        include: { vehicle: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return drivers.map((d) => {
    const assignedVehicle = d.vehicleAssignments?.[0]?.vehicle;
    const vehicleName = assignedVehicle
      ? `${assignedVehicle.makeModel} · ${assignedVehicle.registrationNumber}`
      : null;

    return {
      id: d.id,
      userId: d.userId,
      name: d.user?.fullName || 'Driver',
      phone: d.user?.phoneNumber || null,
      email: d.user?.email || null,
      city: d.assignedDepot || d.address || null,
      status: d.status,
      score: d.score ? Number(d.score) : 0,
      rating: d.rating ? Number(d.rating) : 0,
      trips: d.totalTripsCompleted ?? 0,
      availability: d.status === 'off_duty' ? 0 : 100,
      vehicle: vehicleName,
      employment: {
        employeeId: d.employeeCode,
        joinedOn: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null,
        contractType: d.contractType || null,
        shift: d.shiftWindow || null,
        depot: d.assignedDepot || null,
        reportingManager: d.reportingManager?.user?.fullName || null,
        licenceNo: d.licenseNumber || null,
        licenceExpiry: d.licenseExpiry ? new Date(d.licenseExpiry).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null,
        emergencyContactName: d.emergencyContactName || null,
        emergencyContactPhone: d.emergencyContactPhone || null,
        emergencyContact: [d.emergencyContactName, d.emergencyContactPhone].filter(Boolean).join(' · ') || null,
        address: d.address || null,
      },
    };
  });
};

/**
 * Fleet Manager: Get single driver by ID from PostgreSQL.
 */
export const getDriverById = async (id) => {
  const d = await prisma.driver.findFirst({
    where: { OR: [{ id }, { userId: id }] },
    include: {
      user: {
        select: { id: true, email: true, fullName: true, phoneNumber: true, avatarUrl: true, createdAt: true },
      },
      reportingManager: {
        include: { user: { select: { fullName: true, phoneNumber: true } } },
      },
      vehicleAssignments: {
        where: { unassignedAt: null },
        include: { vehicle: true },
      },
    },
  });

  if (!d) {
    const error = new Error('Driver not found');
    error.statusCode = 404;
    throw error;
  }

  const assignedVehicle = d.vehicleAssignments?.[0]?.vehicle;
  const vehicleName = assignedVehicle
    ? `${assignedVehicle.makeModel} · ${assignedVehicle.registrationNumber}`
    : null;

  return {
    id: d.id,
    userId: d.userId,
    name: d.user?.fullName || 'Driver',
    phone: d.user?.phoneNumber || null,
    email: d.user?.email || null,
    city: d.assignedDepot || d.address || null,
    status: d.status,
    score: d.score ? Number(d.score) : 0,
    rating: d.rating ? Number(d.rating) : 0,
    trips: d.totalTripsCompleted ?? 0,
    availability: d.status === 'off_duty' ? 0 : 100,
    vehicle: vehicleName,
    employment: {
      employeeId: d.employeeCode,
      joinedOn: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null,
      contractType: d.contractType || null,
      shift: d.shiftWindow || null,
      depot: d.assignedDepot || null,
      reportingManager: d.reportingManager?.user?.fullName || null,
      licenceNo: d.licenseNumber || null,
      licenceExpiry: d.licenseExpiry ? new Date(d.licenseExpiry).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null,
      emergencyContactName: d.emergencyContactName || null,
      emergencyContactPhone: d.emergencyContactPhone || null,
      emergencyContact: [d.emergencyContactName, d.emergencyContactPhone].filter(Boolean).join(' · ') || null,
      address: d.address || null,
    },
  };
};

/**
 * Fleet Manager: Create new driver in PostgreSQL.
 */
export const createDriver = async (data) => {
  const {
    fullName,
    name,
    email,
    phone,
    city,
    address,
    emergencyContactName,
    emergencyContactPhone,
    employeeCode,
    employeeId,
    joinedOn,
    contractType,
    shiftWindow,
    shift,
    assignedDepot,
    depot,
    licenseNumber,
    licenceNo,
    licenseExpiry,
    licenceExpiry,
    vehicle,
    status = 'available',
  } = data;

  const finalName = (fullName || name || '').trim();
  const finalEmail = (email || '').trim();
  const finalEmpCode = (employeeCode || employeeId || '').trim();
  const finalShift = (shiftWindow || shift || '').trim();
  const finalDepot = (assignedDepot || depot || city || '').trim();
  const finalLicenceNo = (licenseNumber || licenceNo || '').trim();
  const finalLicenceExpiry = licenseExpiry || licenceExpiry;

  if (!finalName) {
    const error = new Error('Full Name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!finalEmail) {
    const error = new Error('Email address is required');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = finalEmail.toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    const error = new Error(`User with email '${normalizedEmail}' already exists`);
    error.statusCode = 400;
    throw error;
  }

  const codeToUse = finalEmpCode || `FL-EMP-${Math.floor(1000 + Math.random() * 9000)}`;

  const existingDriverCode = await prisma.driver.findUnique({ where: { employeeCode: codeToUse } });
  if (existingDriverCode) {
    const error = new Error(`Driver with employee code '${codeToUse}' already exists`);
    error.statusCode = 400;
    throw error;
  }

  if (finalLicenceNo) {
    const existingLicense = await prisma.driver.findUnique({ where: { licenseNumber: finalLicenceNo } });
    if (existingLicense) {
      const error = new Error(`Driver with license number '${finalLicenceNo}' already exists`);
      error.statusCode = 400;
      throw error;
    }
  }

  const passwordHash = await bcrypt.hash('DriverPass123!', 10);

  const newDriver = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: 'driver',
        fullName: finalName,
        phoneNumber: phone ? phone.trim() : null,
        createdAt: joinedOn ? new Date(joinedOn) : new Date(),
      },
    });

    const driverRecord = await tx.driver.create({
      data: {
        userId: user.id,
        employeeCode: codeToUse,
        status: status || 'available',
        score: 0,
        rating: 0,
        totalTripsCompleted: 0,
        contractType: contractType ? contractType.trim() : null,
        shiftWindow: finalShift || null,
        assignedDepot: finalDepot || null,
        licenseNumber: finalLicenceNo || null,
        licenseExpiry: finalLicenceExpiry ? new Date(finalLicenceExpiry) : null,
        emergencyContactName: emergencyContactName ? emergencyContactName.trim() : null,
        emergencyContactPhone: emergencyContactPhone ? emergencyContactPhone.trim() : null,
        address: address ? address.trim() : (city ? city.trim() : null),
        createdAt: joinedOn ? new Date(joinedOn) : new Date(),
      },
      include: {
        user: { select: { id: true, email: true, fullName: true, phoneNumber: true, createdAt: true } },
      },
    });

    return driverRecord;
  });

  return getDriverById(newDriver.id);
};

/**
 * Fleet Manager: Delete driver from PostgreSQL.
 */
export const deleteDriver = async (id) => {
  const driver = await prisma.driver.findFirst({
    where: { OR: [{ id }, { userId: id }] },
  });

  if (!driver) {
    const error = new Error('Driver not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.user.delete({ where: { id: driver.userId } });
  return true;
};

/**
 * Driver: Get driver profile details.
 */
export const getDriverProfile = async (userId) => {
  const driver = await prisma.driver.findUnique({
    where: { userId },
    include: {
      user: { select: { email: true, fullName: true, phoneNumber: true, avatarUrl: true } },
      reportingManager: {
        include: { user: { select: { fullName: true, phoneNumber: true } } },
      },
      dailyScores: {
        orderBy: { scoreDate: 'desc' },
        take: 7,
      },
      coachingGoals: {
        where: { isActive: true },
      },
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

  return driver;
};

/**
 * Driver: Get schedule & stops for a specific date (defaults to today).
 */
export const getDriverSchedule = async (userId, targetDate) => {
  const driver = await prisma.driver.findUnique({
    where: { userId },
  });

  if (!driver) {
    const error = new Error('Driver profile not found');
    error.statusCode = 404;
    throw error;
  }

  const queryDate = targetDate ? new Date(targetDate) : new Date();
  queryDate.setHours(0, 0, 0, 0);

  let schedule = await prisma.driverSchedule.findFirst({
    where: {
      driverId: driver.id,
      scheduleDate: queryDate,
    },
    include: {
      stops: {
        orderBy: { sequence: 'asc' },
        include: {
          delivery: {
            select: {
              id: true,
              deliveryCode: true,
              pickupLocation: true,
              dropLocation: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!schedule) {
    schedule = await prisma.driverSchedule.findFirst({
      where: { driverId: driver.id },
      orderBy: { scheduleDate: 'desc' },
      include: {
        stops: {
          orderBy: { sequence: 'asc' },
          include: {
            delivery: {
              select: {
                id: true,
                deliveryCode: true,
                pickupLocation: true,
                dropLocation: true,
                status: true,
              },
            },
          },
        },
      },
    });
  }

  return schedule;
};

/**
 * Driver: Update schedule stop completion status.
 */
export const updateScheduleStopStatus = async (userId, stopId, isCompleted) => {
  const driver = await prisma.driver.findUnique({ where: { userId } });
  if (!driver) {
    const error = new Error('Driver profile not found');
    error.statusCode = 404;
    throw error;
  }

  const stop = await prisma.driverScheduleStop.findUnique({
    where: { id: stopId },
    include: { schedule: true },
  });

  if (!stop) {
    const error = new Error('Schedule stop not found');
    error.statusCode = 404;
    throw error;
  }

  if (stop.schedule.driverId !== driver.id) {
    const error = new Error('Forbidden: Access denied to this schedule stop');
    error.statusCode = 403;
    throw error;
  }

  return prisma.driverScheduleStop.update({
    where: { id: stopId },
    data: {
      isCompleted: Boolean(isCompleted),
      completedAt: Boolean(isCompleted) ? new Date() : null,
    },
  });
};
