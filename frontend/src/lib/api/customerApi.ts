import { api } from './axios';

export const customerApi = {
  // Get customer profile (protected)
  getProfile: async (): Promise<any> => {
    const response = await api.get('/customer/profile');
    return response.data;
  },

  // Update customer profile (protected)
  updateProfile: async (data: any): Promise<any> => {
    const response = await api.put('/customer/profile', data);
    return response.data;
  },

  // Get customer preferences (protected)
  getPreferences: async (): Promise<any> => {
    const response = await api.get('/customer/preferences');
    return response.data;
  },

  // Update customer preferences (protected)
  updatePreferences: async (data: any): Promise<any> => {
    const response = await api.put('/customer/preferences', data);
    return response.data;
  },

  // Get saved addresses (protected)
  getSavedAddresses: async (): Promise<any[]> => {
    const response = await api.get('/customer/addresses');
    return response.data;
  },

  // Add saved address (protected)
  addAddress: async (address: any): Promise<any> => {
    const response = await api.post('/customer/addresses', address);
    return response.data;
  },

  // Update saved address (protected)
  updateAddress: async (addressId: string, address: any): Promise<any> => {
    const response = await api.put(`/customer/addresses/${addressId}`, address);
    return response.data;
  },

  // Delete saved address (protected)
  deleteAddress: async (addressId: string): Promise<void> => {
    await api.delete(`/customer/addresses/${addressId}`);
  },

  // Get payment methods (protected)
  getPaymentMethods: async (): Promise<any[]> => {
    const response = await api.get('/customer/payment-methods');
    return response.data;
  },

  // Add payment method (protected)
  addPaymentMethod: async (method: any): Promise<any> => {
    const response = await api.post('/customer/payment-methods', method);
    return response.data;
  },

  // Delete payment method (protected)
  deletePaymentMethod: async (methodId: string): Promise<void> => {
    await api.delete(`/customer/payment-methods/${methodId}`);
  },

  // Get support history (protected)
  getSupportHistory: async (params?: any): Promise<any> => {
    const response = await api.get('/customer/support-history', { params });
    return response.data;
  },

  // Create support ticket (protected)
  createSupportTicket: async (ticket: any): Promise<any> => {
    const response = await api.post('/customer/support-tickets', ticket);
    return response.data;
  }
};
