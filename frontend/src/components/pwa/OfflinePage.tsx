'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  WifiOff, 
  RefreshCw, 
  Home, 
  Search, 
  User, 
  Bookmark,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface OfflinePageProps {
  className?: string;
}

export default function OfflinePage({ className }: OfflinePageProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [cachedPages, setCachedPages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      // Automatically reload the page when back online
      window.location.reload();
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get cached pages from service worker
    getCachedPages();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getCachedPages = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const cached: string[] = [];
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          requests.forEach(request => {
            if (request.url.includes(window.location.origin)) {
              const path = new URL(request.url).pathname;
              if (!cached.includes(path) && path !== '/offline') {
                cached.push(path);
              }
            }
          });
        }
        
        setCachedPages(cached.slice(0, 5)); // Limit to 5 recent pages
      } catch (error) {
        console.error('Error getting cached pages:', error);
      }
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    
    try {
      // Test connectivity
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-store'
      });
      
      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error('Still offline');
      }
    } catch (error) {
      // Still offline
      setTimeout(() => setRetrying(false), 2000);
    }
  };

  const navigateToCachedPage = (path: string) => {
    router.push(path);
  };

  const quickActions = [
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Home',
      path: '/',
      available: true
    },
    {
      icon: <Search className="w-5 h-5" />,
      label: 'Search',
      path: '/search',
      available: cachedPages.includes('/search')
    },
    {
      icon: <User className="w-5 h-5" />,
      label: 'Profile',
      path: '/profile',
      available: cachedPages.includes('/profile')
    },
    {
      icon: <Bookmark className="w-5 h-5" />,
      label: 'Wishlist',
      path: '/profile/wishlist',
      available: cachedPages.includes('/profile/wishlist')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {/* Status Indicator */}
        <div className="mb-6">
          {isOnline ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="w-20 h-20 mx-auto bg-orange-100 rounded-full flex items-center justify-center"
            >
              <WifiOff className="w-10 h-10 text-orange-600" />
            </motion.div>
          )}
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isOnline ? "You're Back Online!" : "You're Offline"}
          </h1>
          <p className="text-gray-600">
            {isOnline 
              ? "Your connection has been restored. Refreshing the page..."
              : "No internet connection. But you can still browse some cached content."
            }
          </p>
        </div>

        {/* Retry Button */}
        {!isOnline && (
          <Button
            onClick={handleRetry}
            disabled={retrying}
            className="mb-6 w-full"
            size="lg"
          >
            {retrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Checking Connection...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
        )}

        {/* Quick Actions */}
        {!isOnline && (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Available Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Button
                    key={action.path}
                    variant={action.available ? "outline" : "ghost"}
                    disabled={!action.available}
                    onClick={() => action.available && navigateToCachedPage(action.path)}
                    className="flex flex-col items-center space-y-1 h-auto py-3"
                  >
                    <div className={action.available ? 'text-blue-600' : 'text-gray-400'}>
                      {action.icon}
                    </div>
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Cached Pages */}
            {cachedPages.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Recently Visited
                </h3>
                <div className="space-y-2">
                  {cachedPages.map((page) => (
                    <button
                      key={page}
                      onClick={() => navigateToCachedPage(page)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {page === '/' ? 'Home' : page.replace(/\//g, ' / ').replace(/^\s\/\s/, '')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-xs text-blue-800 font-medium mb-1">Offline Tip</p>
                  <p className="text-xs text-blue-700">
                    Install our app for better offline experience and faster loading times.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Connection Status */}
        <div className="mt-6 text-xs text-gray-500">
          Connection Status: <span className={isOnline ? 'text-green-600' : 'text-orange-600'}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// Hook for detecting online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}