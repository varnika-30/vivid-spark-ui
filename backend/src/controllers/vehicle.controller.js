import * as vehicleService from '../services/vehicle.service.js';

export const getVehicles = async (req, res, next) => {
  try {
    const { status } = req.query;
    const vehicles = await vehicleService.getAllVehicles(status);
    return res.status(200).json({
      success: true,
      message: 'Vehicles fetched successfully',
      data: vehicles,
    });
  } catch (error) {
    next(error);
  }
};

export const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);
    return res.status(200).json({
      success: true,
      message: 'Vehicle details fetched successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const createVehicle = async (req, res, next) => {
  try {
    const { registrationNumber, makeModel, vehicleType } = req.body;
    if (!registrationNumber || !makeModel || !vehicleType) {
      return res.status(400).json({
        success: false,
        message: 'registrationNumber, makeModel, and vehicleType are required',
      });
    }

    const vehicle = await vehicleService.createVehicle(req.body);
    return res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

export const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await vehicleService.updateVehicle(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const assignVehicle = async (req, res, next) => {
  try {
    const { driverId, vehicleId, notes } = req.body;
    if (!driverId || !vehicleId) {
      return res.status(400).json({
        success: false,
        message: 'driverId and vehicleId are required',
      });
    }

    const assignment = await vehicleService.assignVehicleToDriver(driverId, vehicleId, notes);
    return res.status(201).json({
      success: true,
      message: 'Vehicle assigned to driver successfully',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
};
