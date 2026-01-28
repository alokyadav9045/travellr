import { api } from './axios';
import type { User, LoginCredentials, RegisterData } from '@/types';

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password with token
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (): Promise<{ message: string }> => {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  },

  // Update password
  updatePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.put('/auth/update-password', { currentPassword, newPassword });
    return response.data;
  },

  // Google OAuth login
  googleLogin: async (token: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/google', { token });
    return response.data;
  },

  // Facebook OAuth login
  facebookLogin: async (token: string): Promise<{ user: User; token: string }> => {
    const response = await api.post('/auth/facebook', { token });
    return response.data;
  }
};
