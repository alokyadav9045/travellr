'use client';

import { useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCredentials, setUser, logout as logoutAction, setLoading } from '@/store/slices/authSlice';
import type { LoginCredentials, RegisterData } from '@/types';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const user = await authApi.getCurrentUser();
          dispatch(setUser(user));
        } catch (error) {
          localStorage.removeItem('token');
          dispatch(setLoading(false));
        }
      } else {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const data = await authApi.login(credentials);
      dispatch(setCredentials(data));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }, [dispatch]);

  // Register
  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authApi.register(data);
      dispatch(setCredentials(response));
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  }, [dispatch]);

  // Logout
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logoutAction());
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };
}
