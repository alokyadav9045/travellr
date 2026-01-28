// Enhanced toast hook using sonner - provides consistent API across the project
import { useCallback } from 'react';
import { toast as sonnerToast } from 'sonner';

interface ToastConfig {
  title?: string;
  description?: string;
  message?: string;
  duration?: number;
}

export function useToast() {
  const showSuccess = useCallback((message: string, duration = 3000) => {
    sonnerToast.success(message, { duration });
  }, []);

  const showError = useCallback((message: string, duration = 4000) => {
    sonnerToast.error(message, { duration });
  }, []);

  const showWarning = useCallback((message: string, duration = 3500) => {
    sonnerToast.warning(message, { duration });
  }, []);

  const showInfo = useCallback((message: string, duration = 3000) => {
    sonnerToast.info(message, { duration });
  }, []);

  const show = useCallback((config: string | ToastConfig, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration?: number) => {
    if (typeof config === 'string') {
      // Legacy: useToast().show(message, type, duration)
      const options = duration ? { duration } : undefined;
      switch (type) {
        case 'success':
          sonnerToast.success(config, options);
          break;
        case 'error':
          sonnerToast.error(config, options);
          break;
        case 'warning':
          sonnerToast.warning(config, options);
          break;
        default:
          sonnerToast.info(config, options);
      }
    } else {
      // Object config: { message, title, description, duration }
      const message = config.message || config.description || config.title || '';
      if (message) {
        sonnerToast.info(message, { duration: config.duration });
      }
    }
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    show,
    // Legacy aliases for backward compatibility
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    // Direct sonner access for advanced use cases
    toast: sonnerToast,
  };
}
