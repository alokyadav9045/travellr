'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const toastIcons = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const toastColors = {
  success: 'from-green-500 to-green-600',
  error: 'from-red-500 to-red-600',
  warning: 'from-yellow-500 to-orange-600',
  info: 'from-blue-500 to-blue-600',
};

export default function Toast({
  message,
  type = 'info',
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div
            className={`
              bg-gradient-to-r ${toastColors[type]}
              text-white rounded-xl shadow-2xl p-4
              flex items-start gap-3
            `}
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 font-bold">
              {toastIcons[type]}
            </div>
            <p className="flex-1 font-medium">{message}</p>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Toast Manager Hook
interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

let toastId = 0;
const toastListeners: Set<(toast: ToastOptions & { id: number }) => void> = new Set();

export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastOptions & { id: number }>>([]);

  useEffect(() => {
    const listener = (toast: ToastOptions & { id: number }) => {
      setToasts(prev => [...prev, toast]);
    };

    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  const showToast = (options: ToastOptions) => {
    const toast = { ...options, id: toastId++ };
    toastListeners.forEach(listener => listener(toast));
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return {
    toasts,
    showToast,
    removeToast,
    success: (message: string, duration?: number) =>
      showToast({ message, type: 'success', duration }),
    error: (message: string, duration?: number) =>
      showToast({ message, type: 'error', duration }),
    warning: (message: string, duration?: number) =>
      showToast({ message, type: 'warning', duration }),
    info: (message: string, duration?: number) =>
      showToast({ message, type: 'info', duration }),
  };
}

// Toast Container Component
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
