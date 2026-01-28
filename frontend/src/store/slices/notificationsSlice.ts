import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api/axios';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'booking' | 'payment' | 'system' | 'promotion' | 'review';
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  readAt?: Date;
}

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params?: { page?: number; limit?: number; isRead?: boolean; category?: string }) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data.data;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id: string) => {
    await api.delete(`/notifications/${id}`);
    return id;
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notifications/clearAllNotifications',
  async () => {
    await api.delete('/notifications');
    return true;
  }
);

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    category: string;
    isRead: boolean | null;
    priority: string;
  };
  loading: {
    fetching: boolean;
    marking: boolean;
    deleting: boolean;
  };
  error: string | null;
  realTimeEnabled: boolean;
  soundEnabled: boolean;
  lastFetch: Date | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  },
  filters: {
    category: 'all',
    isRead: null,
    priority: 'all'
  },
  loading: {
    fetching: false,
    marking: false,
    deleting: false
  },
  error: null,
  realTimeEnabled: true,
  soundEnabled: true,
  lastFetch: null
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Add new notification (for real-time)
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
    
    // Add multiple notifications
    addNotifications: (state, action: PayloadAction<Notification[]>) => {
      const newNotifications = action.payload.filter(
        newNotif => !state.notifications.some(existing => existing.id === newNotif.id)
      );
      state.notifications.unshift(...newNotifications);
      state.unreadCount += newNotifications.filter(n => !n.isRead).length;
    },
    
    // Update notification
    updateNotification: (state, action: PayloadAction<Partial<Notification> & { id: string }>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload.id);
      if (index !== -1) {
        const wasUnread = !state.notifications[index].isRead;
        state.notifications[index] = { ...state.notifications[index], ...action.payload };
        
        // Update unread count
        if (wasUnread && action.payload.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        } else if (!wasUnread && action.payload.isRead === false) {
          state.unreadCount += 1;
        }
      }
    },
    
    // Remove notification
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    
    // Set filters
    setFilters: (state, action: PayloadAction<Partial<NotificationsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear filters
    clearFilters: (state) => {
      state.filters = {
        category: 'all',
        isRead: null,
        priority: 'all'
      };
    },
    
    // Set page
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    
    // Toggle real-time
    toggleRealTime: (state) => {
      state.realTimeEnabled = !state.realTimeEnabled;
    },
    
    // Toggle sound
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Update last fetch time
    setLastFetch: (state) => {
      state.lastFetch = new Date();
    },
    
    // Manual mark as read (optimistic update)
    markAsReadOptimistic: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    // Manual mark all as read (optimistic update)
    markAllAsReadOptimistic: (state) => {
      state.notifications.forEach(notification => {
        if (!notification.isRead) {
          notification.isRead = true;
          notification.readAt = new Date();
        }
      });
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading.fetching = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading.fetching = false;
        state.notifications = action.payload.data || [];
        state.unreadCount = action.payload.unreadCount || 0;
        state.pagination = {
          page: action.payload.meta?.pagination?.page || 1,
          limit: action.payload.meta?.pagination?.limit || 20,
          total: action.payload.meta?.pagination?.total || 0,
          totalPages: action.payload.meta?.pagination?.totalPages || 0,
          hasNext: action.payload.meta?.pagination?.hasNext || false,
          hasPrev: action.payload.meta?.pagination?.hasPrev || false
        };
        state.lastFetch = new Date();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading.fetching = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      })
      
      // Mark as read
      .addCase(markAsRead.pending, (state) => {
        state.loading.marking = true;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.loading.marking = false;
        // Optimistic update already handled in reducer
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.loading.marking = false;
        state.error = action.error.message || 'Failed to mark as read';
      })
      
      // Mark all as read
      .addCase(markAllAsRead.pending, (state) => {
        state.loading.marking = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.loading.marking = false;
        // Optimistic update already handled in reducer
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.loading.marking = false;
        state.error = action.error.message || 'Failed to mark all as read';
      })
      
      // Delete notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading.deleting = true;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading.deleting = false;
        const index = state.notifications.findIndex(n => n.id === action.payload);
        if (index !== -1) {
          if (!state.notifications[index].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error = action.error.message || 'Failed to delete notification';
      })
      
      // Clear all notifications
      .addCase(clearAllNotifications.pending, (state) => {
        state.loading.deleting = true;
      })
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.loading.deleting = false;
        state.notifications = [];
        state.unreadCount = 0;
      })
      .addCase(clearAllNotifications.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error = action.error.message || 'Failed to clear notifications';
      });
  }
});

export const {
  addNotification,
  addNotifications,
  updateNotification,
  removeNotification,
  setFilters,
  clearFilters,
  setPage,
  toggleRealTime,
  toggleSound,
  clearError,
  setLastFetch,
  markAsReadOptimistic,
  markAllAsReadOptimistic
} = notificationsSlice.actions;

export default notificationsSlice.reducer;