import { api } from './axios';

export const adminApi = {
  // Get admin dashboard (protected - admin only)
  getDashboard: async (params?: any): Promise<any> => {
    const response = await api.get('/admin/dashboard', { params });
    return response.data;
  },

  // Get analytics (protected - admin only)
  getAnalytics: async (params?: any): Promise<any> => {
    const response = await api.get('/admin/analytics', { params });
    return response.data;
  },

  // Get reports (protected - admin only)
  getReports: async (params?: any): Promise<any> => {
    const response = await api.get('/admin/reports', { params });
    return response.data;
  },

  // Get users (protected - admin only)
  getUsers: async (params?: any): Promise<any> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Get user by ID (protected - admin only)
  getUser: async (userId: string): Promise<any> => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Update user (protected - admin only)
  updateUser: async (userId: string, data: any): Promise<any> => {
    const response = await api.patch(`/admin/users/${userId}`, data);
    return response.data;
  },

  // Get vendors (protected - admin only)
  getVendors: async (params?: any): Promise<any> => {
    const response = await api.get('/admin/vendors', { params });
    return response.data;
  },

  // Get vendor by ID (protected - admin only)
  getVendor: async (vendorId: string): Promise<any> => {
    const response = await api.get(`/admin/vendors/${vendorId}`);
    return response.data;
  },

  // Verify vendor (protected - admin only)
  verifyVendor: async (vendorId: string): Promise<any> => {
    const response = await api.patch(`/admin/vendors/${vendorId}/verify`);
    return response.data;
  },

  // Get bookings (protected - admin only)
  getBookings: async (params?: any): Promise<any> => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  // Get booking by ID (protected - admin only)
  getBooking: async (bookingId: string): Promise<any> => {
    const response = await api.get(`/admin/bookings/${bookingId}`);
    return response.data;
  },

  // Get support tickets (protected - admin only)
  getSupportTickets: async (params?: any): Promise<any> => {
    const response = await api.get('/admin/support-tickets', { params });
    return response.data;
  },

  // Get ticket by ID (protected - admin only)
  getSupportTicket: async (ticketId: string): Promise<any> => {
    const response = await api.get(`/admin/support-tickets/${ticketId}`);
    return response.data;
  },

  // Update ticket status (protected - admin only)
  updateTicketStatus: async (ticketId: string, status: string): Promise<any> => {
    const response = await api.patch(`/admin/support-tickets/${ticketId}`, { status });
    return response.data;
  },

  // Create admin announcement (protected - admin only)
  createAnnouncement: async (data: any): Promise<any> => {
    const response = await api.post('/admin/announcements', data);
    return response.data;
  },

  // Get site settings (protected - admin only)
  getSettings: async (): Promise<any> => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  // Update site settings (protected - admin only)
  updateSettings: async (data: any): Promise<any> => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  }
};
