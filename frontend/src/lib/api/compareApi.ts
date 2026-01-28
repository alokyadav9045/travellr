import { api } from './axios';

export const compareApi = {
  // Get user's compare list (protected)
  getCompareList: async (params?: any): Promise<any> => {
    const response = await api.get('/compare', { params });
    return response.data;
  },

  // Add trip to compare list (protected)
  addTrip: async (tripId: string): Promise<any> => {
    const response = await api.post(`/compare/${tripId}`);
    return response.data;
  },

  // Remove trip from compare list (protected)
  removeTrip: async (tripId: string): Promise<void> => {
    await api.delete(`/compare/${tripId}`);
  },

  // Check if trip is in compare list (protected)
  checkIfInCompare: async (tripId: string): Promise<{ inCompare: boolean }> => {
    const response = await api.get(`/compare/check/${tripId}`);
    return response.data;
  },

  // Clear compare list (protected)
  clearCompareList: async (): Promise<void> => {
    await api.delete('/compare');
  },

  // Compare specific trips (protected)
  compareTrips: async (tripIds: string[]): Promise<any> => {
    const response = await api.post('/compare/compare-trips', { tripIds });
    return response.data;
  }
};
