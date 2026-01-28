'use client';

import { useState, useEffect } from 'react';
import { X, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnlineStatus } from '@/hooks/useDevice';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const [showBanner, setShowBanner] = useState(false);
  const [justWentOnline, setJustWentOnline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
      setJustWentOnline(false);
    } else if (showBanner) {
      // User just came back online
      setJustWentOnline(true);
      setTimeout(() => {
        setShowBanner(false);
        setJustWentOnline(false);
      }, 3000);
    }
  }, [isOnline]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div
            className={`
              ${justWentOnline
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : 'bg-gradient-to-r from-orange-500 to-red-600'
              }
              text-white py-3 px-4 shadow-lg
            `}
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                {justWentOnline ? (
                  <Wifi className="w-5 h-5" />
                ) : (
                  <WifiOff className="w-5 h-5 animate-pulse" />
                )}
                <div>
                  <p className="font-semibold">
                    {justWentOnline
                      ? '✓ You\'re back online!'
                      : 'No Internet Connection'
                    }
                  </p>
                  <p className="text-sm text-white/90">
                    {justWentOnline
                      ? 'Your connection has been restored'
                      : 'Some features may not be available'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {justWentOnline && (
                  <button
                    onClick={handleRefresh}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                )}
                <button
                  onClick={() => setShowBanner(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
