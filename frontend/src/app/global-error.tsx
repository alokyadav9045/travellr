'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-9xl font-bold text-gray-200">500</h1>
              <div className="text-4xl font-bold text-gray-800 mb-4">Server Error</div>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Oops! Something went wrong on our servers. Our team has been notified and is working on it.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Try Again
              </button>
              <a
                href="/"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Go Home
              </a>
            </div>

            <div className="mt-12 text-sm text-gray-500">
              <p>Error ID: {error.digest}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
