import { api } from './axios';

export const notificationApi = {
  // Get user's notifications (protected)
  getNotifications: async (params?: any): Promise<any> => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Get notification by ID (protected)
  getNotification: async (notificationId: string): Promise<any> => {
    const response = await api.get(`/notifications/${notificationId}`);
    return response.data;
  },

  // Mark notification as read (protected)
  markAsRead: async (notificationId: string): Promise<any> => {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read (protected)
  markAllAsRead: async (): Promise<any> => {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification (protected)
  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`/notifications/${notificationId}`);
  },

  // Delete all notifications (protected)
  deleteAllNotifications: async (): Promise<void> => {
    await api.delete('/notifications');
  },

  // Get notification preferences (protected)
  getPreferences: async (): Promise<any> => {
    const response = await api.get('/notifications/preferences');
    return response.data;
  },

  // Update notification preferences (protected)
  updatePreferences: async (preferences: any): Promise<any> => {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data;
  }
};
