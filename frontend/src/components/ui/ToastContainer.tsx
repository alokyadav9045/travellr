'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addToastHandler } from '@/lib/toast';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

const typeConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: CheckCircle2,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: AlertCircle,
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: AlertTriangle,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: Info,
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const unsubscribe = addToastHandler((toastData) => {
      const id = Date.now().toString() + Math.random();
      const duration = toastData.duration || 3000;

      setToasts((prev) => [...prev, {
        id,
        message: toastData.message,
        type: toastData.type,
        duration
      }]);

      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      timers.push(timer);
    });

    return () => {
      unsubscribe();
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-20 md:bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = typeConfig[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 100 }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              className="w-full pointer-events-auto"
            >
              <div
                className={`
                  ${config.bg} ${config.border}
                  border rounded-lg p-4 shadow-lg
                  flex items-start gap-3
                  backdrop-blur-sm bg-opacity-95
                `}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.text}`} />
                <p className={`flex-1 text-sm font-medium ${config.text}`}>
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`flex-shrink-0 hover:opacity-70 transition-opacity ${config.text}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
