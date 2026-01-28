import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api/axios';
import type { Trip, TripFilters, PaginatedResponse } from '@/types';

// Async thunks
export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (params: TripFilters & { page?: number; limit?: number }) => {
    const response = await api.get<PaginatedResponse<Trip>>('/trips', { params });
    return response.data;
  }
);

export const fetchTripBySlug = createAsyncThunk(
  'trips/fetchTripBySlug',
  async (slug: string) => {
    const response = await api.get<{ data: Trip }>(`/trips/${slug}`);
    return response.data.data;
  }
);

export const searchTrips = createAsyncThunk(
  'trips/searchTrips',
  async (query: string) => {
    const response = await api.get<PaginatedResponse<Trip>>('/trips', {
      params: { search: query }
    });
    return response.data;
  }
);

export const fetchTripById = createAsyncThunk(
  'trips/fetchTripById',
  async (id: string) => {
    const response = await api.get<{ data: Trip }>(`/trips/${id}`);
    return response.data.data;
  }
);

export const fetchUserTrips = createAsyncThunk(
  'trips/fetchUserTrips',
  async (vendorId: string) => {
    const response = await api.get<PaginatedResponse<Trip>>(`/vendors/${vendorId}/trips`);
    return response.data;
  }
);

export const deleteTrip = createAsyncThunk(
  'trips/deleteTrip',
  async (tripId: string) => {
    await api.delete(`/trips/${tripId}`);
    return tripId;
  }
);

interface TripsState {
  trips: Trip[];
  userTrips: Trip[]; // Add userTrips for vendor dashboard
  currentTrip: Trip | null;
  selectedTrip: Trip | null; // Add selectedTrip for compatibility
  searchResults: Trip[];
  filters: TripFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  loading: {
    trips: boolean;
    userTrips: boolean;
    currentTrip: boolean;
    search: boolean;
    deleting: boolean;
  };
  error: string | null;
}

const initialState: TripsState = {
  trips: [],
  userTrips: [],
  currentTrip: null,
  selectedTrip: null,
  searchResults: [],
  filters: {
    category: '',
    location: '',
    minPrice: 0,
    maxPrice: 100000,
    duration: undefined,
    minRating: 0
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  },
  loading: {
    trips: false,
    userTrips: false,
    currentTrip: false,
    search: false,
    deleting: false
  },
  error: null
};

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TripFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    clearCurrentTrip: (state) => {
      state.currentTrip = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading.trips = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading.trips = false;
        state.trips = action.payload.data;
        state.pagination = {
          page: action.payload.meta?.pagination?.page || 1,
          limit: action.payload.meta?.pagination?.limit || 12,
          total: action.payload.meta?.pagination?.total || 0,
          totalPages: action.payload.meta?.pagination?.totalPages || 0,
          hasNext: action.payload.meta?.pagination?.hasNext || false,
          hasPrev: action.payload.meta?.pagination?.hasPrev || false
        };
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading.trips = false;
        state.error = action.error.message || 'Failed to fetch trips';
      })
      // Fetch trip by slug
      .addCase(fetchTripBySlug.pending, (state) => {
        state.loading.currentTrip = true;
        state.error = null;
      })
      .addCase(fetchTripBySlug.fulfilled, (state, action) => {
        state.loading.currentTrip = false;
        state.currentTrip = action.payload;
      })
      .addCase(fetchTripBySlug.rejected, (state, action) => {
        state.loading.currentTrip = false;
        state.error = action.error.message || 'Failed to fetch trip';
      })
      // Search trips
      .addCase(searchTrips.pending, (state) => {
        state.loading.search = true;
        state.error = null;
      })
      .addCase(searchTrips.fulfilled, (state, action) => {
        state.loading.search = false;
        state.searchResults = action.payload.data;
      })
      .addCase(searchTrips.rejected, (state, action) => {
        state.loading.search = false;
        state.error = action.error.message || 'Search failed';
      })
      // Fetch trip by ID
      .addCase(fetchTripById.pending, (state) => {
        state.loading.currentTrip = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading.currentTrip = false;
        state.selectedTrip = action.payload;
        state.currentTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading.currentTrip = false;
        state.error = action.error.message || 'Failed to fetch trip';
      })
      // Fetch user trips
      .addCase(fetchUserTrips.pending, (state) => {
        state.loading.userTrips = true;
        state.error = null;
      })
      .addCase(fetchUserTrips.fulfilled, (state, action) => {
        state.loading.userTrips = false;
        state.userTrips = action.payload.data;
      })
      .addCase(fetchUserTrips.rejected, (state, action) => {
        state.loading.userTrips = false;
        state.error = action.error.message || 'Failed to fetch user trips';
      })
      // Delete trip
      .addCase(deleteTrip.pending, (state) => {
        state.loading.deleting = true;
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.loading.deleting = false;
        state.userTrips = state.userTrips.filter(trip => trip._id !== action.payload);
        state.trips = state.trips.filter(trip => trip._id !== action.payload);
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error = action.error.message || 'Failed to delete trip';
      });
  }
});

export const {
  setFilters,
  clearFilters,
  setPage,
  clearCurrentTrip,
  clearSearchResults,
  clearError
} = tripsSlice.actions;

export default tripsSlice.reducer;