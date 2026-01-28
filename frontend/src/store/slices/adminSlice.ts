import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api/axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  phone?: string;
  businessName?: string;
  gstNumber?: string;
}

interface Booking {
  id: string;
  trip: {
    id: string;
    title: string;
    location: string;
  };
  customer: {
    id: string;
    name: string;
    email: string;
  };
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
}

interface Trip {
  id: string;
  title: string;
  location: string;
  price: number;
  vendor: {
    id: string;
    name: string;
  };
  status: 'active' | 'inactive' | 'draft';
  totalBookings: number;
  createdAt: string;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
  businessName: string;
  status: 'active' | 'suspended' | 'pending';
  totalTrips: number;
  totalRevenue: number;
  averageRating: number;
  createdAt: string;
}

interface Analytics {
  totalRevenue: number;
  monthlyGrowth: number;
  totalUsers: number;
  totalVendors: number;
  totalTrips: number;
  totalBookings: number;
}

interface AdminState {
  users: User[];
  bookings: Booking[];
  trips: Trip[];
  vendors: Vendor[];
  analytics: Analytics | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  bookings: [],
  trips: [],
  vendors: [],
  analytics: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/users');
      return response.data.data?.users || response.data.users || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'admin/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/bookings');
      return response.data.data?.bookings || response.data.bookings || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchTrips = createAsyncThunk(
  'admin/fetchTrips',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/trips');
      return response.data.data?.trips || response.data.trips || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trips');
    }
  }
);

export const fetchVendors = createAsyncThunk(
  'admin/fetchVendors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/vendors');
      return response.data.data?.vendors || response.data.vendors || [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vendors');
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'admin/fetchAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data.data || response.data.analytics || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, status }: { userId: string; status: 'active' | 'suspended' }, { rejectWithValue }) => {
    try {
      await api.patch(`/admin/users/${userId}`, { isActive: status === 'active' });
      return { userId, status };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user status');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      return userId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const approveVendor = createAsyncThunk(
  'admin/approveVendor',
  async (vendorId: string, { rejectWithValue }) => {
    try {
      await api.patch(`/admin/vendors/${vendorId}/approve`);
      return vendorId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve vendor');
    }
  }
);

export const rejectVendor = createAsyncThunk(
  'admin/rejectVendor',
  async ({ vendorId, reason }: { vendorId: string; reason?: string }, { rejectWithValue }) => {
    try {
      await api.patch(`/admin/vendors/${vendorId}/reject`, { reason });
      return vendorId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject vendor');
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update User Status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const { userId, status } = action.payload;
        const userIndex = state.users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].status = status;
        }
      })

      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })

      // Approve Vendor
      .addCase(approveVendor.fulfilled, (state, action) => {
        const vendorIndex = state.vendors.findIndex(vendor => vendor.id === action.payload);
        if (vendorIndex !== -1) {
          state.vendors[vendorIndex].status = 'active';
        }
      })

      // Reject Vendor
      .addCase(rejectVendor.fulfilled, (state, action) => {
        const vendorIndex = state.vendors.findIndex(vendor => vendor.id === action.payload);
        if (vendorIndex !== -1) {
          state.vendors[vendorIndex].status = 'suspended';
        }
      });
  },
});

export const { clearError, setLoading } = adminSlice.actions;
export default adminSlice.reducer;