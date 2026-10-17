import { api } from './api';

export const getDriverDashboard = async () => {
  const res = await api.get('/driver/dashboard');
  return res.data;
};

export const getDriverProfile = async () => {
  const res = await api.get('/driver/profile');
  return res.data;
};

export const getDriverDeliveries = async () => {
  const res = await api.get('/driver/deliveries');
  return res.data;
};

export const getDriverDeliveryById = async (id: string) => {
  const res = await api.get(`/driver/deliveries/${id}`);
  return res.data;
};

export const updateTrackingStep = async (deliveryId: string, stageName: string) => {
  const res = await api.patch(`/driver/deliveries/${deliveryId}/tracking`, { stageName });
  return res.data;
};

export const getDriverSchedule = async (date?: string) => {
  const endpoint = date ? `/driver/schedule?date=${date}` : '/driver/schedule';
  const res = await api.get(endpoint);
  return res.data;
};

export const updateScheduleStop = async (stopId: string, isCompleted: boolean) => {
  const res = await api.patch(`/driver/schedule/stops/${stopId}`, { isCompleted });
  return res.data;
};

export const createConcern = async (payload: {
  deliveryId?: string;
  tripId?: string;
  category: string;
  contextReason?: string;
  driverDescription: string;
  systemEventType?: string;
}) => {
  const res = await api.post('/driver/concerns', payload);
  return res.data;
};

export const getDriverConcerns = async () => {
  const res = await api.get('/driver/concerns');
  return res.data;
};

export const getDriverConcernById = async (id: string) => {
  const res = await api.get(`/driver/concerns/${id}`);
  return res.data;
};

export const getDriverTrips = async () => {
  const res = await api.get('/driver/trips');
  return res.data;
};

export const getDriverTripById = async (id: string) => {
  const res = await api.get(`/driver/trips/${id}`);
  return res.data;
};

export const getDriverPerformance = async () => {
  const res = await api.get('/driver/performance');
  return res.data;
};
