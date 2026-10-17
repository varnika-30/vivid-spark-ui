import * as driverService from '../services/driver.service.js';
import * as deliveryService from '../services/delivery.service.js';
import * as concernService from '../services/concern.service.js';
import * as tripService from '../services/trip.service.js';
import * as performanceService from '../services/performance.service.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await driverService.getDriverProfile(req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Driver profile fetched successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await deliveryService.getDriverDeliveries(req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Driver deliveries fetched successfully',
      data: deliveries,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const delivery = await deliveryService.getDriverDeliveryById(req.user.userId, id);
    return res.status(200).json({
      success: true,
      message: 'Driver delivery details fetched successfully',
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrackingStep = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stageName } = req.body;
    if (!stageName) {
      return res.status(400).json({ success: false, message: 'stageName is required' });
    }

    const updated = await deliveryService.updateDriverDeliveryTracking(req.user.userId, id, stageName);
    return res.status(200).json({
      success: true,
      message: 'Delivery tracking updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getSchedule = async (req, res, next) => {
  try {
    const { date } = req.query;
    const schedule = await driverService.getDriverSchedule(req.user.userId, date);
    return res.status(200).json({
      success: true,
      message: 'Driver schedule fetched successfully',
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

export const updateScheduleStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const { isCompleted } = req.body;
    const updated = await driverService.updateScheduleStopStatus(req.user.userId, stopId, isCompleted);
    return res.status(200).json({
      success: true,
      message: 'Schedule stop status updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const createConcern = async (req, res, next) => {
  try {
    const { driverDescription } = req.body;
    if (!driverDescription) {
      return res.status(400).json({ success: false, message: 'driverDescription is required' });
    }

    const concern = await concernService.createDriverConcern(req.user.userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Driver concern created successfully',
      data: concern,
    });
  } catch (error) {
    next(error);
  }
};

export const getConcerns = async (req, res, next) => {
  try {
    const concerns = await concernService.getDriverConcerns(req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Driver concerns fetched successfully',
      data: concerns,
    });
  } catch (error) {
    next(error);
  }
};

export const getConcernById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const concern = await concernService.getDriverConcernById(req.user.userId, id);
    return res.status(200).json({
      success: true,
      message: 'Driver concern details fetched successfully',
      data: concern,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const trips = await tripService.getDriverTrips(req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Driver completed trips fetched successfully',
      data: trips,
    });
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await tripService.getDriverTripById(req.user.userId, id);
    return res.status(200).json({
      success: true,
      message: 'Driver completed trip details fetched successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

export const getPerformance = async (req, res, next) => {
  try {
    const performance = await performanceService.getDriverPerformance(req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Driver performance data fetched successfully',
      data: performance,
    });
  } catch (error) {
    next(error);
  }
};
