import { api } from './api';

export interface CreateDeliveryRequestPayload {
  pickupAddress: string;
  dropAddress: string;
  packageCategory?: string;
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  handleWithCare?: boolean;
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  dateMode?: 'on' | 'before' | 'flexible';
  preferredDate?: string;
  preferredTimeWindow?: string;
  specialInstructions?: string;
  estimatedCost?: number;
}

export const getClientDashboard = async () => {
  const res = await api.get('/client/dashboard');
  return res.data;
};

export const getClientDeliveryRequests = async () => {
  const res = await api.get('/delivery-requests');
  return res.data;
};

export const getClientDeliveryRequestById = async (id: string) => {
  const res = await api.get(`/delivery-requests/${id}`);
  return res.data;
};

export const createDeliveryRequest = async (payload: CreateDeliveryRequestPayload) => {
  const res = await api.post('/delivery-requests', payload);
  return res.data;
};

export const updateDeliveryRequest = async (id: string, payload: Partial<CreateDeliveryRequestPayload>) => {
  const res = await api.patch(`/delivery-requests/${id}`, payload);
  return res.data;
};

export const cancelDeliveryRequest = async (id: string) => {
  const res = await api.delete(`/delivery-requests/${id}`);
  return res.data;
};
