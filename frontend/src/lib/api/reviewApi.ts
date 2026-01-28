import { api } from './axios';
import type { Review, PaginatedResponse } from '@/types';

export const reviewApi = {
  // Create review (protected)
  createReview: async (data: {
    booking: string;
    rating: number;
    title: string;
    comment: string;
  }): Promise<Review> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Get reviews for trip
  getForTrip: async (tripId: string, params?: any): Promise<PaginatedResponse<Review>> => {
    const response = await api.get(`/reviews/trip/${tripId}`, { params });
    return response.data;
  },

  // Get reviews for vendor
  getForVendor: async (vendorId: string, params?: any): Promise<PaginatedResponse<Review>> => {
    const response = await api.get(`/reviews/vendor/${vendorId}`, { params });
    return response.data;
  },

  // Get review by ID
  getReview: async (reviewId: string): Promise<Review> => {
    const response = await api.get(`/reviews/${reviewId}`);
    return response.data;
  },

  // Update review (protected)
  updateReview: async (reviewId: string, data: Partial<Review>): Promise<Review> => {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  // Delete review (protected)
  deleteReview: async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },

  // Get review responses
  getResponses: async (reviewId: string): Promise<any[]> => {
    const response = await api.get(`/reviews/${reviewId}/responses`);
    return response.data;
  },

  // Add response to review (protected)
  addResponse: async (reviewId: string, response: string): Promise<any> => {
    const result = await api.post(`/reviews/${reviewId}/responses`, { response });
    return result.data;
  }
};
