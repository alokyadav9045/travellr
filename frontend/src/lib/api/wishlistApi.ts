import { api } from './axios';
import type { PaginatedResponse } from '@/types';

export const wishlistApi = {
  // Get user's wishlist (protected)
  getWishlist: async (params?: any): Promise<PaginatedResponse<any>> => {
    const response = await api.get('/wishlist', { params });
    return response.data;
  },

  // Toggle trip in/out of wishlist (protected)
  toggleTrip: async (tripId: string, notes?: string): Promise<any> => {
    const response = await api.post(`/wishlist/${tripId}`, { notes });
    return response.data;
  },

  // Check if trip is in wishlist (protected)
  checkIfInWishlist: async (tripId: string): Promise<{ inWishlist: boolean }> => {
    const response = await api.get(`/wishlist/check/${tripId}`);
    return response.data;
  },

  // Add trip to wishlist (protected)
  addTrip: async (tripId: string, notes?: string): Promise<any> => {
    const response = await api.post(`/wishlist/${tripId}`, { notes, action: 'add' });
    return response.data;
  },

  // Remove trip from wishlist (protected)
  removeTrip: async (tripId: string): Promise<void> => {
    await api.delete(`/wishlist/${tripId}`);
  }
};
