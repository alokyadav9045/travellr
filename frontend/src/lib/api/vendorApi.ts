import { api } from './axios';
import type { Vendor, PaginatedResponse } from '@/types';

export const vendorApi = {
  // Get all vendors
  getVendors: async (params?: any): Promise<PaginatedResponse<Vendor>> => {
    const response = await api.get('/vendors', { params });
    return response.data;
  },

  // Get current vendor profile
  getCurrentVendor: async (): Promise<Vendor> => {
    const response = await api.get('/vendors/me');
    return response.data;
  },

  // Get vendor by ID
  getVendor: async (vendorId: string): Promise<Vendor> => {
    const response = await api.get(`/vendors/${vendorId}`);
    return response.data;
  },

  // Get vendor's trips
  getVendorTrips: async (vendorId: string, params?: any): Promise<any> => {
    const response = await api.get(`/vendors/${vendorId}/trips`, { params });
    return response.data;
  },

  // Get vendor's reviews
  getVendorReviews: async (vendorId: string, params?: any): Promise<any> => {
    const response = await api.get(`/vendors/${vendorId}/reviews`, { params });
    return response.data;
  },

  // Create vendor profile (protected)
  createVendor: async (data: Partial<Vendor>): Promise<Vendor> => {
    const response = await api.post('/vendors', data);
    return response.data;
  },

  // Update vendor profile (protected)
  updateVendor: async (vendorId: string, data: Partial<Vendor>): Promise<Vendor> => {
    const response = await api.put(`/vendors/${vendorId}`, data);
    return response.data;
  },

  // Get vendor dashboard (protected)
  getDashboard: async (vendorId: string, params?: any): Promise<any> => {
    const response = await api.get(`/vendors/${vendorId}/dashboard`, { params });
    return response.data;
  },

  // Get vendor bookings (protected)
  getBookings: async (vendorId: string, params?: any): Promise<any> => {
    const response = await api.get(`/vendors/${vendorId}/bookings`, { params });
    return response.data;
  },

  // Get vendor earnings (protected)
  getEarnings: async (vendorId: string, params?: any): Promise<any> => {
    const response = await api.get(`/vendors/${vendorId}/earnings`, { params });
    return response.data;
  },

  // Create Stripe account (protected)
  createStripeAccount: async (vendorId: string): Promise<any> => {
    const response = await api.post(`/vendors/${vendorId}/stripe-account`);
    return response.data;
  },

  // Get Stripe account link (protected)
  getStripeAccountLink: async (vendorId: string): Promise<any> => {
    const response = await api.get(`/vendors/${vendorId}/stripe-account-link`);
    return response.data;
  },

  // Get Stripe login link (protected)
  getStripeLoginLink: async (vendorId: string): Promise<any> => {
    const response = await api.get(`/vendors/${vendorId}/stripe-login-link`);
    return response.data;
  },

  // Verify vendor (admin only)
  verifyVendor: async (vendorId: string): Promise<Vendor> => {
    const response = await api.patch(`/vendors/${vendorId}/verify`);
    return response.data;
  },

  // Update subscription (protected)
  updateSubscription: async (vendorId: string, subscriptionData: any): Promise<any> => {
    const response = await api.patch(`/vendors/${vendorId}/subscription`, subscriptionData);
    return response.data;
  }
};
