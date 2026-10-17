import { api, setAccessToken } from './api';

export interface UserProfile {
  id: string;
  email: string;
  role: 'manager' | 'driver' | 'client';
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  client?: any;
  fleetManager?: any;
  driver?: any;
}

export interface LoginResponse {
  user: UserProfile;
  accessToken: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>('/auth/login', { email, password });
  if (res.data.accessToken) {
    setAccessToken(res.data.accessToken);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fleethub_user', JSON.stringify(res.data.user));
    }
  }
  return res.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    setAccessToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fleethub_user');
    }
  }
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  try {
    const res = await api.get<UserProfile>('/auth/me');
    if (res.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('fleethub_user', JSON.stringify(res.data));
      }
      return res.data;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const getStoredUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('fleethub_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};
