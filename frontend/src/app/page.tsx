'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategorySection } from '@/components/home/CategorySection';
import { DestinationGrid } from '@/components/home/DestinationGrid';
import { FeaturedTrips } from '@/components/home/FeaturedTrips';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { LastMinuteDeals } from '@/components/home/LastMinuteDeals';
import { CommunitySection } from '@/components/community/CommunitySection';
import { Footer } from '@/components/layout/Footer';
import { Trip } from '@/types';
import { tripApi } from '@/lib/api/trips';
import { BudgetFriendlySection } from '@/components/home/BudgetFriendlySection';
import { WeekendEscapesSection } from '@/components/home/WeekendEscapesSection';
import { TrendingDestinations } from '@/components/home/TrendingDestinations';
import { WinterWanderlistSection } from '@/components/home/WinterWanderlistSection';

// Sample featured trips data (in production, this would come from API)
const sampleTrips: Trip[] = [
  {
    _id: '1',
    id: '1',
    title: 'Manali Adventure Trek',
    slug: 'manali-adventure-trek',
    description: 'Experience the breathtaking beauty of Himachal Pradesh with our expert guides on this unforgettable 5-day adventure.',
    shortDescription: 'Epic Himalayan adventure through snow-capped peaks',
    location: {
      city: 'Manali',
      state: 'Himachal Pradesh',
      country: 'India',
    },
    duration: { days: 5, nights: 4 },
    groupSize: { min: 4, max: 15 },
    price: {
      amount: 12999,
      currency: 'INR',
      priceType: 'per_person',
      discountedAmount: 9999,
      discountPercentage: 23,
    },
    images: [{ url: 'https://images.unsplash.com/photo-1590603784837-de409fd71ba9?w=800&q=80', isPrimary: true }],
    tripType: 'fixed_date',
    dates: [],
    itinerary: [],
    inclusions: ['Meals', 'Accommodation', 'Guide'],
    exclusions: ['Personal expenses'],
    requirements: {
      minAge: 18,
      fitnessLevel: 'moderate',
      documents: ['ID Proof'],
      specialRequirements: [],
    },
    vendor: 'v1',
    category: 'adventure',
    tags: ['trekking', 'mountains', 'adventure'],
    rating: { average: 4.8, count: 124 },
    status: 'published',
    isFeatured: true,
    stats: { views: 1250, bookings: 48, wishlistAdds: 156, rating: 4.8, reviewCount: 124, bookingsCount: 48 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    id: '2',
    title: 'Goa Beach Paradise',
    slug: 'goa-beach-paradise',
    description: 'Relax on pristine beaches, enjoy water sports, and experience the vibrant nightlife of Goa.',
    shortDescription: 'Sun, sand, and the perfect beach getaway',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
    },
    duration: { days: 4, nights: 3 },
    groupSize: { min: 2, max: 20 },
    price: {
      amount: 8999,
      currency: 'INR',
      priceType: 'per_person',
      discountedAmount: 7499,
    },
    images: [{ url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', isPrimary: true }],
    tripType: 'flexible',
    dates: [],
    itinerary: [],
    inclusions: ['Resort stay', 'Breakfast', 'Transfers'],
    exclusions: ['Flights'],
    requirements: {
      minAge: 18,
      fitnessLevel: 'easy',
      documents: ['ID Proof'],
      specialRequirements: [],
    },
    vendor: 'v2',
    category: 'beach',
    tags: ['beach', 'party', 'relaxation'],
    rating: { average: 4.6, count: 89 },
    status: 'published',
    isFeatured: true,
    stats: { views: 980, bookings: 35, wishlistAdds: 112, rating: 4.6, reviewCount: 89, bookingsCount: 35 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    id: '3',
    title: 'Kerala Backwaters Experience',
    slug: 'kerala-backwaters-experience',
    description: 'Cruise through serene backwaters on a traditional houseboat and discover the beauty of God\'s Own Country.',
    shortDescription: 'Serene houseboat journey through paradise',
    location: {
      city: 'Alleppey',
      state: 'Kerala',
      country: 'India',
    },
    duration: { days: 3, nights: 2 },
    groupSize: { min: 2, max: 8 },
    price: {
      amount: 15999,
      currency: 'INR',
      priceType: 'per_person',
      discountedAmount: 13999,
    },
    images: [{ url: 'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=800&q=80', isPrimary: true }],
    tripType: 'flexible',
    dates: [],
    itinerary: [],
    inclusions: ['Houseboat', 'All meals', 'Village tour'],
    exclusions: ['Travel to Kerala'],
    requirements: {
      minAge: 0,
      fitnessLevel: 'easy',
      documents: ['ID Proof'],
      specialRequirements: [],
    },
    vendor: 'v3',
    category: 'cultural',
    tags: ['backwaters', 'houseboat', 'relaxation'],
    rating: { average: 4.9, count: 156 },
    status: 'published',
    isFeatured: true,
    stats: { views: 1540, bookings: 62, wishlistAdds: 203, rating: 4.9, reviewCount: 156, bookingsCount: 62 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    id: '4',
    title: 'Ladakh Bike Expedition',
    slug: 'ladakh-bike-expedition',
    description: 'Ride through the highest motorable roads in the world on this epic motorcycle adventure.',
    shortDescription: 'Conquer the highest roads on two wheels',
    location: {
      city: 'Leh',
      state: 'Ladakh',
      country: 'India',
    },
    duration: { days: 10, nights: 9 },
    groupSize: { min: 4, max: 12 },
    price: {
      amount: 34999,
      currency: 'INR',
      priceType: 'per_person',
      discountedAmount: 29999,
    },
    images: [{ url: 'https://images.unsplash.com/photo-1506038634487-60a69ae4b7b1?w=800&q=80', isPrimary: true }],
    tripType: 'fixed_date',
    dates: [],
    itinerary: [],
    inclusions: ['Bike rental', 'Fuel', 'Accommodation', 'Mechanic support'],
    exclusions: ['Personal gear'],
    requirements: {
      minAge: 21,
      fitnessLevel: 'challenging',
      documents: ['Driving License', 'ID Proof'],
      specialRequirements: ['Riding experience required'],
    },
    vendor: 'v4',
    category: 'adventure',
    tags: ['biking', 'adventure', 'mountains'],
    rating: { average: 4.7, count: 78 },
    status: 'published',
    isFeatured: true,
    stats: { views: 850, bookings: 28, wishlistAdds: 94, rating: 4.7, reviewCount: 78, bookingsCount: 28 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    id: '5',
    title: 'Rishikesh Yoga Retreat',
    slug: 'rishikesh-yoga-retreat',
    description: 'Find inner peace at the yoga capital of the world with daily sessions by renowned instructors.',
    shortDescription: 'Transform your mind and body by the Ganges',
    location: {
      city: 'Rishikesh',
      state: 'Uttarakhand',
      country: 'India',
    },
    duration: { days: 7, nights: 6 },
    groupSize: { min: 4, max: 15 },
    price: {
      amount: 18999,
      currency: 'INR',
      priceType: 'per_person',
      discountedAmount: 14999,
    },
    images: [{ url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', isPrimary: true }],
    tripType: 'fixed_date',
    dates: [],
    itinerary: [],
    inclusions: ['Ashram stay', 'Vegetarian meals', 'Yoga sessions'],
    exclusions: ['Personal expenses'],
    requirements: {
      minAge: 18,
      fitnessLevel: 'easy',
      documents: ['ID Proof'],
      specialRequirements: [],
    },
    vendor: 'v5',
    category: 'wellness',
    tags: ['yoga', 'meditation', 'spiritual'],
    rating: { average: 4.8, count: 203 },
    status: 'published',
    isFeatured: true,
    stats: { views: 1680, bookings: 71, wishlistAdds: 245, rating: 4.8, reviewCount: 203, bookingsCount: 71 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    id: '6',
    title: 'Jaisalmer Desert Safari',
    slug: 'jaisalmer-desert-safari',
    description: 'Experience the magic of the Thar Desert with camel safaris, dune camping, and stargazing.',
    shortDescription: 'Golden sands and starlit nights await',
    location: {
      city: 'Jaisalmer',
      state: 'Rajasthan',
      country: 'India',
    },
    duration: { days: 4, nights: 3 },
    groupSize: { min: 2, max: 16 },
    price: {
      amount: 11999,
      currency: 'INR',
      priceType: 'per_person',
      discountedAmount: 8999,
    },
    images: [{ url: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', isPrimary: true }],
    tripType: 'flexible',
    dates: [],
    itinerary: [],
    inclusions: ['Desert camp', 'Camel safari', 'Meals', 'Folk music'],
    exclusions: ['Travel to Jaisalmer'],
    requirements: {
      minAge: 5,
      fitnessLevel: 'easy',
      documents: ['ID Proof'],
      specialRequirements: [],
    },
    vendor: 'v6',
    category: 'cultural',
    tags: ['desert', 'safari', 'camping'],
    rating: { average: 4.6, count: 145 },
    status: 'published',
    isFeatured: true,
    stats: { views: 920, bookings: 42, wishlistAdds: 167, rating: 4.6, reviewCount: 145, bookingsCount: 42 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function HomePage() {
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>(sampleTrips);

  useEffect(() => {
    const fetchFeaturedTrips = async () => {
      try {
        const data = await tripApi.getFeaturedTrips();
        if (data && data.length > 0) {
          setFeaturedTrips(data);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };
    fetchFeaturedTrips();
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section - Enhanced with Video Background */}
      <HeroSection />

      {/* Category Section - Browse by Trip Type */}
      <CategorySection />

      {/* Budget Friendly - Zostel Stays (NEW) */}
      <BudgetFriendlySection />

      {/* Weekend Escapes - Nearby Getaways (NEW) */}
      <WeekendEscapesSection />

      {/* Trending Destinations - Top locations (NEW) */}
      <TrendingDestinations />

      {/* Winter Wanderlist - Seasonal Specials (NEW) */}
      <WinterWanderlistSection />

      {/* Destination Grid - All Destinations with Filters (UPDATED) */}
      <DestinationGrid />

      {/* Last Minute Deals */}
      <LastMinuteDeals />

      {/* Community Section */}
      <CommunitySection />

      {/* Testimonials - Social Proof */}
      <TestimonialsSection />

      {/* Why Choose Us - Trust Building Section */}
      <WhyChooseUs />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Travellr',
            url: 'https://travellr.com',
            logo: 'https://travellr.com/icons/icon-512x512.png',
            sameAs: [
              'https://twitter.com/travellr',
              'https://facebook.com/travellr',
              'https://instagram.com/travellr'
            ],
            description: 'Discover and book unique travel experiences with verified vendors.',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '123 Travel Street',
              addressLocality: 'New Delhi',
              postalCode: '110001',
              addressCountry: 'IN'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+91-1800-123-4567',
              contactType: 'customer service'
            }
          }),
        }}
      />

      {/* Footer */}
      <Footer />
    </main>
  );
}
