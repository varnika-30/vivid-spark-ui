import { api } from './api';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (): Promise<NotificationItem[]> => {
  const res = await api.get<NotificationItem[]>('/notifications');
  return res.data;
};

export const getNotificationById = async (id: string): Promise<NotificationItem> => {
  const res = await api.get<NotificationItem>(`/notifications/${id}`);
  return res.data;
};

export const markNotificationAsRead = async (id: string): Promise<NotificationItem> => {
  const res = await api.patch<NotificationItem>(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
};
