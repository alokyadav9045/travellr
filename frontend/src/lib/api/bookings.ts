import { api } from './axios';
import type { Booking, CreateBookingData, PaginatedResponse } from '@/types';

export const bookingApi = {
  // Create new booking
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  // Get booking by ID
  getBooking: async (bookingId: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  // Get user bookings
  getUserBookings: async (params?: any): Promise<PaginatedResponse<Booking>> => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  // Get my bookings (alias for compatibility)
  getMyBookings: async (params?: any): Promise<PaginatedResponse<Booking>> => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  // Get booking by ID (alias)
  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking
  updateBooking: async (bookingId: string, data: Partial<Booking>): Promise<Booking> => {
    const response = await api.patch(`/bookings/${bookingId}`, data);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId: string, reason?: string): Promise<Booking> => {
    const response = await api.delete(`/bookings/${bookingId}`, { data: { reason } });
    return response.data;
  },

  // Calculate booking price
  calculatePrice: async (data: {
    tripId: string;
    departureId: string;
    guests: {
      adults: number;
      children: number;
      infants: number;
    };
    addOns?: Array<{ addOnId: string; quantity: number }>;
  }): Promise<{
    subtotal: number;
    addOnsTotal: number;
    serviceFee: number;
    totalAmount: number;
  }> => {
    const response = await api.post(`/bookings/${data.tripId}/calculate-price`, data);
    return response.data;
  },

  // Download invoice
  downloadInvoice: async (bookingId: string): Promise<Blob> => {
    const response = await api.get(`/bookings/${bookingId}/invoice`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Send message for booking
  sendMessage: async (bookingId: string, message: string, attachments?: File[]): Promise<any> => {
    const formData = new FormData();
    formData.append('message', message);
    if (attachments) {
      attachments.forEach(file => formData.append('attachments', file));
    }

    const response = await api.post(`/bookings/${bookingId}/message`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Get booking messages
  getMessages: async (bookingId: string): Promise<any[]> => {
    const response = await api.get(`/bookings/${bookingId}/messages`);
    return response.data;
  }
};
