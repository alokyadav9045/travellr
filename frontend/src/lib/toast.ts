// Toast notification system - uses centralized store
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  message: string;
  type: ToastType;
  duration?: number;
}

const toastHandlers: Set<(toast: ToastMessage) => void> = new Set();

export const toast = {
  success: (message: string, duration = 3000) => {
    console.log('✅ Success:', message);
    const toastMsg: ToastMessage = { message, type: 'success', duration };
    toastHandlers.forEach(handler => handler(toastMsg));
  },
  error: (message: string, duration = 4000) => {
    console.log('❌ Error:', message);
    const toastMsg: ToastMessage = { message, type: 'error', duration };
    toastHandlers.forEach(handler => handler(toastMsg));
  },
  info: (message: string, duration = 3000) => {
    console.log('ℹ️ Info:', message);
    const toastMsg: ToastMessage = { message, type: 'info', duration };
    toastHandlers.forEach(handler => handler(toastMsg));
  },
  warning: (message: string, duration = 3500) => {
    console.log('⚠️ Warning:', message);
    const toastMsg: ToastMessage = { message, type: 'warning', duration };
    toastHandlers.forEach(handler => handler(toastMsg));
  }
};

export function addToastHandler(handler: (toast: ToastMessage) => void) {
  toastHandlers.add(handler);
  return () => toastHandlers.delete(handler);
}
