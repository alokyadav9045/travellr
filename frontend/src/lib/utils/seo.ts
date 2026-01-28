import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
}

export function generateSEO({
  title = 'Travellr - Discover Amazing Travel Experiences',
  description = 'Book unique travel experiences and adventures around the world. Discover curated trips, connect with local vendors, and create unforgettable memories.',
  keywords = ['travel', 'adventure', 'booking', 'trips', 'vacation', 'tourism'],
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  canonical,
  noindex = false,
}: SEOProps = {}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://travellr.com';
  const fullTitle = title.includes('Travellr') ? title : `${title} | Travellr`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Travellr Team' }],
    creator: 'Travellr',
    publisher: 'Travellr',
    applicationName: 'Travellr',
    generator: 'Next.js',
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
    alternates: {
      canonical: canonical ? `${baseUrl}${canonical}` : undefined,
    },
    openGraph: {
      type: ogType as any,
      title: fullTitle,
      description,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      siteName: 'Travellr',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`],
      creator: '@travellr',
      site: '@travellr',
    },
    icons: {
      icon: '/icons/icon-192x192.png',
      apple: '/icons/icon-192x192.png',
    },
    manifest: '/manifest.json',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  };
}

export function generateTripSEO(trip: {
  title: string;
  description: string;
  slug: string;
  images?: string[];
  category?: string;
  location?: string;
  price?: number;
}) {
  return generateSEO({
    title: trip.title,
    description: trip.description.slice(0, 160),
    keywords: [
      'travel',
      trip.category || 'adventure',
      trip.location || 'destination',
      'booking',
      'vacation',
    ],
    ogImage: trip.images?.[0] || '/images/og-image.jpg',
    ogType: 'article',
    canonical: `/trips/${trip.slug}`,
  });
}

export function generateVendorSEO(vendor: {
  businessName: string;
  description: string;
  location?: string;
}) {
  return generateSEO({
    title: `${vendor.businessName} - Travel Vendor`,
    description: vendor.description.slice(0, 160),
    keywords: ['travel vendor', vendor.location || 'travel', 'booking', 'tours'],
    ogType: 'profile',
    canonical: `/vendors/${vendor.businessName.toLowerCase().replace(/\s+/g, '-')}`,
  });
}
