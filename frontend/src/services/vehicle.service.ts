import { api } from './api';

export interface CreateVehiclePayload {
  registrationNumber: string;
  makeModel: string;
  vehicleType: string;
  capacityKg?: number;
  fuelType?: string;
  status?: string;
  telematicsDeviceId?: string;
}

export const getVehicles = async (status?: string) => {
  const endpoint = status ? `/vehicles?status=${status}` : '/vehicles';
  const res = await api.get(endpoint);
  return res.data;
};

export const getVehicleById = async (id: string) => {
  const res = await api.get(`/vehicles/${id}`);
  return res.data;
};

export const createVehicle = async (payload: CreateVehiclePayload) => {
  const res = await api.post('/vehicles', payload);
  return res.data;
};

export const updateVehicle = async (id: string, payload: Partial<CreateVehiclePayload>) => {
  const res = await api.patch(`/vehicles/${id}`, payload);
  return res.data;
};

export const assignVehicle = async (driverId: string, vehicleId: string, notes?: string) => {
  const res = await api.post('/vehicles/assign', { driverId, vehicleId, notes });
  return res.data;
};
