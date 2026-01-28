'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeviceDetection } from '@/hooks/useDevice';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

interface PWAInstallProps {
  className?: string;
  showInstructions?: boolean;
}

export default function PWAInstall({ className, showInstructions = true }: PWAInstallProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const { isMobile, isDesktop, browser, os } = useDeviceDetection();

  useEffect(() => {
    // Check if app is already installed
    const checkInstallStatus = () => {
      const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppCapableMode = (window.navigator as any).standalone === true;
      setIsInstalled(isInStandaloneMode || isInWebAppCapableMode);
    };

    checkInstallStatus();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
      
      // Show prompt after a delay if user hasn't dismissed it
      setTimeout(() => {
        const hasPromptBeenShown = localStorage.getItem('pwa-prompt-shown');
        const promptDismissed = localStorage.getItem('pwa-prompt-dismissed');
        
        if (!hasPromptBeenShown && !promptDismissed && !isInstalled) {
          setShowPrompt(true);
        }
      }, 10000); // Show after 10 seconds
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setCanInstall(false);
      localStorage.removeItem('pwa-prompt-dismissed');
      
      // Track installation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'app_installed', {
          method: 'pwa_prompt'
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem('pwa-prompt-shown', 'true');
        
        // Track successful installation
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'app_install_accepted', {
            platform: choiceResult.platform
          });
        }
      } else {
        localStorage.setItem('pwa-prompt-dismissed', 'true');
        
        // Track dismissal
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'app_install_dismissed', {
            platform: choiceResult.platform
          });
        }
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
      setCanInstall(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    
    // Track dismissal
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pwa_prompt_dismissed', {
        trigger: 'manual'
      });
    }
  };

  const getInstallInstructions = () => {
    if (isMobile) {
      if (os === 'iOS') {
        return {
          title: 'Add to Home Screen',
          steps: [
            'Tap the Share button at the bottom of the screen',
            'Scroll down and tap "Add to Home Screen"',
            'Tap "Add" to confirm'
          ],
          icon: <Smartphone className="w-6 h-6" />
        };
      } else {
        // Android Chrome
        return {
          title: 'Install Travellr App',
          steps: [
            'Tap the menu (⋮) in your browser',
            'Select "Add to Home screen" or "Install app"',
            'Tap "Install" to confirm'
          ],
          icon: <Chrome className="w-6 h-6" />
        };
      }
    } else {
      // Desktop
      return {
        title: 'Install Travellr App',
        steps: [
          'Click the install icon in your address bar',
          'Or use Chrome menu > More tools > Create shortcut',
          'Check "Open as window" for the best experience'
        ],
        icon: <Download className="w-6 h-6" />
      };
    }
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  const instructions = getInstallInstructions();

  return (
    <div className={className}>
      {/* Install Button for supported browsers */}
      {canInstall && (
        <Button
          onClick={handleInstallClick}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          <span>Install App</span>
        </Button>
      )}

      {/* Auto-prompt Modal */}
      <AnimatePresence>
        {showPrompt && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={handleDismiss}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 z-50"
            >
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Download className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">Install Travellr</h3>
                  <p className="text-gray-600 mt-2">
                    Get the full app experience with offline access and push notifications
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="flex-1"
                  >
                    Not Now
                  </Button>
                  <Button
                    onClick={handleInstallClick}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Install
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Manual instructions for browsers that don't support auto-prompt */}
      {!canInstall && showInstructions && !isInstalled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start space-x-3">
            {instructions.icon}
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-2">
                {instructions.title}
              </h4>
              <ol className="text-sm text-blue-700 space-y-1">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center mr-2 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}