import * as dashboardService from '../services/dashboard.service.js';

export const getClientDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getClientDashboard(req.user.userId);
    return res.status(200).json({
      success: true,
      message: 'Client dashboard data fetched successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
