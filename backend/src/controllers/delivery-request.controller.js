import * as requestService from '../services/delivery-request.service.js';

export const createRequest = async (req, res, next) => {
  try {
    const { pickupAddress, dropAddress } = req.body;
    if (!pickupAddress || !dropAddress) {
      return res.status(400).json({
        success: false,
        message: 'pickupAddress and dropAddress are required',
      });
    }

    const newRequest = await requestService.createDeliveryRequest(req.user.userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Delivery request created successfully',
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getClientRequests = async (req, res, next) => {
  try {
    const requests = await requestService.getClientDeliveryRequests(req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Client delivery requests fetched successfully',
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

export const getClientRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const request = await requestService.getClientDeliveryRequestById(req.user.userId, id);
    return res.status(200).json({
      success: true,
      message: 'Delivery request details fetched successfully',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClientRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await requestService.updateClientDeliveryRequest(req.user.userId, id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Delivery request updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelClientRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cancelled = await requestService.cancelClientDeliveryRequest(req.user.userId, id);
    return res.status(200).json({
      success: true,
      message: 'Delivery request cancelled successfully',
      data: cancelled,
    });
  } catch (error) {
    next(error);
  }
};
