'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="relative w-64 h-64 mb-8">
        <Image
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80"
          alt="404 Illustration"
          fill
          className="object-cover rounded-full opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-9xl font-bold text-white drop-shadow-lg">404</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Oops! Destination Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Looks like you've wandered off the map. The page you're looking for has either moved or doesn't exist.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg" className="bg-[#FF6B35] hover:bg-[#E55A2B]">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
        <Link href="/trips">
          <Button size="lg" variant="outline">
            <Search className="w-5 h-5 mr-2" />
            Explore Trips
          </Button>
        </Link>
      </div>

      <Button
        variant="ghost"
        className="mt-8 text-gray-500 hover:text-gray-900"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Go Back
      </Button>
    </div>
  );
}
