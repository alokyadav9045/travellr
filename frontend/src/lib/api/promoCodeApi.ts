import { api } from './axios';

export const promoCodeApi = {
  // Get available promo codes
  getPromoCodes: async (params?: any): Promise<any> => {
    const response = await api.get('/promo-codes', { params });
    return response.data;
  },

  // Get promo code by code
  getPromoCodeByCode: async (code: string): Promise<any> => {
    const response = await api.get(`/promo-codes/code/${code}`);
    return response.data;
  },

  // Validate promo code
  validatePromoCode: async (code: string, tripId?: string): Promise<any> => {
    const response = await api.post('/promo-codes/validate', { code, tripId });
    return response.data;
  },

  // Apply promo code (protected)
  applyPromoCode: async (code: string, bookingId: string): Promise<any> => {
    const response = await api.post(`/promo-codes/apply`, { code, bookingId });
    return response.data;
  },

  // Get promo code by ID (protected - admin only)
  getPromoCode: async (promoCodeId: string): Promise<any> => {
    const response = await api.get(`/promo-codes/${promoCodeId}`);
    return response.data;
  },

  // Create promo code (protected - admin only)
  createPromoCode: async (data: any): Promise<any> => {
    const response = await api.post('/promo-codes', data);
    return response.data;
  },

  // Update promo code (protected - admin only)
  updatePromoCode: async (promoCodeId: string, data: any): Promise<any> => {
    const response = await api.put(`/promo-codes/${promoCodeId}`, data);
    return response.data;
  },

  // Delete promo code (protected - admin only)
  deletePromoCode: async (promoCodeId: string): Promise<void> => {
    await api.delete(`/promo-codes/${promoCodeId}`);
  },

  // Get promo code usage (protected - admin only)
  getUsageStats: async (promoCodeId: string): Promise<any> => {
    const response = await api.get(`/promo-codes/${promoCodeId}/usage`);
    return response.data;
  }
};
