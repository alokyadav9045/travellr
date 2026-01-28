import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api/axios';
import type { Booking, BookingCreateData, PaginatedResponse } from '@/types';

// Async thunks
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: BookingCreateData) => {
    const response = await api.post<{ data: Booking }>('/bookings', bookingData);
    return response.data.data;
  }
);

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Booking>>('/bookings/my-bookings', { params });
    return response.data;
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id: string) => {
    const response = await api.get<{ data: Booking }>(`/bookings/${id}`);
    return response.data.data;
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, data }: { id: string; data: Partial<Booking> }) => {
    const response = await api.patch<{ data: Booking }>(`/bookings/${id}`, data);
    return response.data.data;
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id: string) => {
    const response = await api.delete<{ data: Booking }>(`/bookings/${id}`);
    return response.data.data;
  }
);

export const confirmPayment = createAsyncThunk(
  'bookings/confirmPayment',
  async ({ id, paymentIntentId }: { id: string; paymentIntentId: string }) => {
    const response = await api.post<{ data: Booking }>(`/bookings/${id}/confirm-payment`, {
      paymentIntentId
    });
    return response.data.data;
  }
);

export const requestRefund = createAsyncThunk(
  'bookings/requestRefund',
  async ({ id, reason }: { id: string; reason: string }) => {
    const response = await api.post<{ data: Booking }>(`/bookings/${id}/request-refund`, {
      reason
    });
    return response.data.data;
  }
);

interface BookingsState {
  bookings: Booking[];
  currentBooking: Booking | null;
  upcomingBookings: Booking[];
  pastBookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  loading: {
    bookings: boolean;
    currentBooking: boolean;
    creating: boolean;
    updating: boolean;
    cancelling: boolean;
    payment: boolean;
    refund: boolean;
  };
  error: string | null;
  filters: {
    status: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
}

const initialState: BookingsState = {
  bookings: [],
  currentBooking: null,
  upcomingBookings: [],
  pastBookings: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  },
  loading: {
    bookings: false,
    currentBooking: false,
    creating: false,
    updating: false,
    cancelling: false,
    payment: false,
    refund: false
  },
  error: null,
  filters: {
    status: 'all'
  }
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<BookingsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { status: 'all' };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateBookingInList: (state, action: PayloadAction<Booking>) => {
      const index = state.bookings.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading.creating = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.currentBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading.bookings = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading.bookings = false;
        state.bookings = action.payload.data;
        state.pagination = {
          page: action.payload.pagination?.page || 1,
          limit: action.payload.pagination?.limit || 10,
          total: action.payload.pagination?.total || 0,
          totalPages: action.payload.pagination?.pages || 0,
          hasNext: (action.payload.pagination?.page || 1) < (action.payload.pagination?.pages || 0),
          hasPrev: (action.payload.pagination?.page || 1) > 1
        };
        
        // Separate upcoming and past bookings
        const now = new Date();
        state.upcomingBookings = action.payload.data.filter(
          booking => new Date(booking.departure.startDate) >= now
        );
        state.pastBookings = action.payload.data.filter(
          booking => new Date(booking.departure.endDate) < now
        );
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading.bookings = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading.currentBooking = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading.currentBooking = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading.currentBooking = false;
        state.error = action.error.message || 'Failed to fetch booking';
      })
      // Update booking
      .addCase(updateBooking.pending, (state) => {
        state.loading.updating = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading.updating = false;
        if (state.currentBooking?._id === action.payload._id) {
          state.currentBooking = action.payload;
        }
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading.updating = false;
        state.error = action.error.message || 'Failed to update booking';
      })
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.loading.cancelling = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading.cancelling = false;
        if (state.currentBooking?._id === action.payload._id) {
          state.currentBooking = action.payload;
        }
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading.cancelling = false;
        state.error = action.error.message || 'Failed to cancel booking';
      })
      // Confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.loading.payment = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.loading.payment = false;
        if (state.currentBooking?._id === action.payload._id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading.payment = false;
        state.error = action.error.message || 'Payment confirmation failed';
      })
      // Request refund
      .addCase(requestRefund.pending, (state) => {
        state.loading.refund = true;
        state.error = null;
      })
      .addCase(requestRefund.fulfilled, (state, action) => {
        state.loading.refund = false;
        if (state.currentBooking?._id === action.payload._id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(requestRefund.rejected, (state, action) => {
        state.loading.refund = false;
        state.error = action.error.message || 'Refund request failed';
      });
  }
});

export const {
  setFilters,
  clearFilters,
  setPage,
  clearCurrentBooking,
  clearError,
  updateBookingInList
} = bookingsSlice.actions;

export default bookingsSlice.reducer;