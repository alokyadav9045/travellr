import { api } from './axios';
import type { Trip, TripSearchParams, PaginatedResponse, Departure } from '@/types';

export const tripApi = {
  // Search trips with filters
  searchTrips: async (params: TripSearchParams): Promise<PaginatedResponse<Trip>> => {
    const response = await api.get('/trips', { params });
    return response.data;
  },

  // Get all trips
  getTrips: async (params?: any): Promise<PaginatedResponse<Trip>> => {
    const response = await api.get('/trips', { params });
    return response.data;
  },

  // Get trip by slug or ID
  getTripBySlug: async (slug: string): Promise<Trip> => {
    const response = await api.get(`/trips/${slug}`);
    return response.data;
  },

  // Get trip by ID (uses same endpoint as slug)
  getTripById: async (id: string): Promise<Trip> => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  // Get featured trips
  getFeaturedTrips: async (limit = 8): Promise<Trip[]> => {
    const response = await api.get('/trips', { params: { featured: true, limit } });
    return response.data;
  },

  // Get popular trips
  getPopularTrips: async (limit = 8): Promise<Trip[]> => {
    const response = await api.get('/trips', { params: { sortBy: 'popularity', limit } });
    return response.data;
  },

  // Check availability
  checkAvailability: async (
    tripId: string,
    departureId: string,
    guests: number
  ): Promise<{ available: boolean; remainingSpots: number }> => {
    const response = await api.get(`/trips/${tripId}/availability`, {
      params: { departureId, guests }
    });
    return response.data;
  },

  // Get similar trips
  getSimilarTrips: async (tripId: string, limit = 4): Promise<Trip[]> => {
    const response = await api.get(`/trips/${tripId}/similar`, { params: { limit } });
    return response.data;
  },

  // Get trip reviews
  getTripReviews: async (tripId: string, params?: any): Promise<any> => {
    const response = await api.get(`/trips/${tripId}/reviews`, { params });
    return response.data;
  },

  // Create trip (vendor only)
  createTrip: async (tripData: Partial<Trip>): Promise<Trip> => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },

  // Update trip (vendor only)
  updateTrip: async (tripId: string, tripData: Partial<Trip>): Promise<Trip> => {
    const response = await api.put(`/trips/${tripId}`, tripData);
    return response.data;
  },

  // Delete trip (vendor only)
  deleteTrip: async (tripId: string): Promise<void> => {
    await api.delete(`/trips/${tripId}`);
  },

  // Publish trip (vendor only)
  publishTrip: async (tripId: string): Promise<Trip> => {
    const response = await api.patch(`/trips/${tripId}/publish`);
    return response.data;
  },

  // Unpublish trip (vendor only)
  unpublishTrip: async (tripId: string): Promise<Trip> => {
    const response = await api.patch(`/trips/${tripId}/unpublish`);
    return response.data;
  },

  // Add departure (vendor only)
  addDeparture: async (tripId: string, departure: Partial<Departure>): Promise<Trip> => {
    const response = await api.post(`/trips/${tripId}/departures`, departure);
    return response.data;
  },

  // Upload trip images (vendor only)
  uploadImages: async (tripId: string, formData: FormData): Promise<Trip> => {
    const response = await api.post(`/trips/${tripId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete trip image (vendor only)
  deleteImage: async (tripId: string, imageId: string): Promise<Trip> => {
    const response = await api.delete(`/trips/${tripId}/images/${imageId}`);
    return response.data;
  }
};
