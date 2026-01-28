// Toast utility using sonner
import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, duration?: number) => {
    sonnerToast.success(message, { duration: duration || 3000 });
  },
  error: (message: string, duration?: number) => {
    sonnerToast.error(message, { duration: duration || 4000 });
  },
  warning: (message: string, duration?: number) => {
    sonnerToast.warning(message, { duration: duration || 3500 });
  },
  info: (message: string, duration?: number) => {
    sonnerToast.info(message, { duration: duration || 3000 });
  }
};