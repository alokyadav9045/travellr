import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Suspense } from 'react';
import { Providers } from '@/components/providers';
import { GoogleAnalytics } from '@/lib/analytics';
import BottomNavigation from '@/components/layout/BottomNavigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'Travellr - Discover Your Next Adventure',
  description: 'Book unique travel experiences with verified vendors',
  keywords: 'travel, trips, adventure, booking, experiences, tours, vacation',
  authors: [{ name: 'Travellr Team' }],
  creator: 'Travellr',
  publisher: 'Travellr',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://travellr.com'),
  openGraph: {
    title: 'Travellr - Discover Your Next Adventure',
    description: 'Book unique travel experiences with verified vendors',
    url: 'https://travellr.com',
    siteName: 'Travellr',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travellr - Discover Your Next Adventure',
    description: 'Book unique travel experiences with verified vendors',
    images: ['/images/twitter-image.jpg'],
    creator: '@travellr_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <BottomNavigation />
        </Providers>
      </body>
    </html>
  );
}
