'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'sonner';
import { BottomNav } from '@/components/ui/BottomNav';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="min-h-screen flex flex-col bg-background">
            <main className="relative flex-1 pb-20 lg:pb-0">
              {children}
            </main>
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'white',
                  border: '1px solid #e5e7eb',
                },
              }}
            />
            {/* BottomNav removed as it is already in RootLayout as BottomNavigation */}
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
