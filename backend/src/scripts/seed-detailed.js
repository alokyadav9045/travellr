require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import all models
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const PromoCode = require('../models/PromoCode');

// Detailed sample data with ALL fields
const DETAILED_DATA = {
  // 1. USERS - 9 users with complete details
  users: [
    // Customers
    {
      name: 'John Wilson',
      email: 'john.wilson@example.com',
      password: 'SecurePass123!@',
      phone: '+919876543210',
      avatar: {
        url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=1',
        publicId: 'avatar_1'
      },
      role: 'customer',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      lastLogin: new Date()
    },
    {
      name: 'Sarah Ahmed',
      email: 'sarah.ahmed@example.com',
      password: 'SecurePass123!@',
      phone: '+919876543211',
      avatar: {
        url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=2',
        publicId: 'avatar_2'
      },
      role: 'customer',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: true
        }
      },
      lastLogin: new Date()
    },
    {
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      password: 'SecurePass123!@',
      phone: '+919876543212',
      avatar: {
        url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=3',
        publicId: 'avatar_3'
      },
      role: 'customer',
      isEmailVerified: true,
      isPhoneVerified: false,
      isActive: true,
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          sms: false
        }
      },
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },

    // Vendors
    {
      name: 'Raj Kumar',
      email: 'raj.adventuretravel@example.com',
      password: 'VendorPass123!@',
      phone: '+919876543220',
      avatar: {
        url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=4',
        publicId: 'avatar_4'
      },
      role: 'vendor',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: true
        }
      },
      lastLogin: new Date()
    },
    {
      name: 'Emma Thompson',
      email: 'emma.beachtravel@example.com',
      password: 'VendorPass123!@',
      phone: '+919876543221',
      avatar: {
        url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=5',
        publicId: 'avatar_5'
      },
      role: 'vendor',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      lastLogin: new Date()
    },
    {
      name: 'Priya Sharma',
      email: 'priya.culturaltours@example.com',
      password: 'VendorPass123!@',
      phone: '+919876543222',
      avatar: {
        url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=6',
        publicId: 'avatar_6'
      },
      role: 'vendor',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: {
        currency: 'INR',
        language: 'hi',
        notifications: {
          email: true,
          push: true,
          sms: true
        }
      },
      lastLogin: new Date()
    },

    // Admin
    {
      name: 'Admin User',
      email: 'admin@travellr.com',
      password: 'AdminPass123!@',
      phone: '+919876543230',
      avatar: {
        url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=7',
        publicId: 'avatar_7'
      },
      role: 'admin',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: {
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: true
        }
      },
      lastLogin: new Date()
    },
    // Additional Customers
    {
      name: 'Robert Martinez',
      email: 'robert.martinez@example.com',
      password: 'SecurePass123!@',
      phone: '+919876543213',
      avatar: { url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=8', publicId: 'avatar_8' },
      role: 'customer',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: { currency: 'INR', language: 'en', notifications: { email: true, push: true, sms: false } },
      lastLogin: new Date()
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      password: 'SecurePass123!@',
      phone: '+919876543214',
      avatar: { url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=9', publicId: 'avatar_9' },
      role: 'customer',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: { currency: 'INR', language: 'en', notifications: { email: true, push: true, sms: true } },
      lastLogin: new Date()
    },
    {
      name: 'David Kim',
      email: 'david.kim@example.com',
      password: 'SecurePass123!@',
      phone: '+919876543215',
      avatar: { url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=10', publicId: 'avatar_10' },
      role: 'customer',
      isEmailVerified: false,
      isPhoneVerified: true,
      isActive: true,
      preferences: { currency: 'INR', language: 'ko', notifications: { email: true, push: false, sms: false } },
      lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    // Additional Vendors
    {
      name: 'Marco Rossi',
      email: 'marco.alpinetravel@example.com',
      password: 'VendorPass123!@',
      phone: '+919876543223',
      avatar: { url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=11', publicId: 'avatar_11' },
      role: 'vendor',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: { currency: 'INR', language: 'it', notifications: { email: true, push: true, sms: true } },
      lastLogin: new Date()
    },
    {
      name: 'Sophie Dubois',
      email: 'sophie.travelfrance@example.com',
      password: 'VendorPass123!@',
      phone: '+919876543224',
      avatar: { url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=12', publicId: 'avatar_12' },
      role: 'vendor',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: { currency: 'INR', language: 'fr', notifications: { email: true, push: true, sms: false } },
      lastLogin: new Date()
    },
    {
      name: 'Johan Andersson',
      email: 'johan.nordictravel@example.com',
      password: 'VendorPass123!@',
      phone: '+919876543225',
      avatar: { url: 'https://res.cloudinary.com/demo/image/fetch/https://i.pravatar.cc/150?img=13', publicId: 'avatar_13' },
      role: 'vendor',
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
      preferences: { currency: 'INR', language: 'sv', notifications: { email: true, push: true, sms: true } },
      lastLogin: new Date()
    }
  ],

  // 2. VENDORS - Complete vendor profiles
  vendors: [
    {
      businessName: 'Himalayan Adventures Pro',
      businessType: 'company',
      description: 'Premium mountain trekking and adventure experiences across the Himalayas',
      contactEmail: 'contact@himalayandventures.com',
      contactPhone: '+919876543220',
      website: 'https://himalayandventures.com',
      address: {
        street: '45 Mountain Road',
        city: 'Kathmandu',
        state: 'Central',
        country: 'Nepal',
        postalCode: '44600'
      },
      verificationStatus: 'approved',
      verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      stripeAccountId: 'acct_1234567890',
      stripeOnboardingComplete: true,
      stripePayoutsEnabled: true,
      subscriptionTier: 'professional',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      commissionRate: 10,
      stats: {
        totalTrips: 12,
        activeTrips: 8,
        totalBookings: 145,
        totalRevenue: 450000,
        avgRating: 4.8,
        totalReviews: 89
      },
      settings: {
        autoConfirmBookings: false,
        instantBooking: true,
        cancellationPolicy: 'moderate',
        payoutSchedule: 'weekly'
      },
      socialMedia: {
        facebook: 'https://facebook.com/himalayandventures',
        instagram: 'https://instagram.com/himalayandventures',
        twitter: 'https://twitter.com/himalayandventures'
      },
      isActive: true
    },
    {
      businessName: 'Tropical Beach Experiences',
      businessType: 'company',
      description: 'Luxury beach getaways and water sports adventures in tropical paradise',
      contactEmail: 'contact@tropicalbeach.com',
      contactPhone: '+919876543221',
      website: 'https://tropicalbeach.com',
      address: {
        street: '123 Beach Avenue',
        city: 'Male',
        state: 'Northern Province',
        country: 'Maldives',
        postalCode: '20026'
      },
      verificationStatus: 'approved',
      verifiedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      stripeAccountId: 'acct_1987654321',
      stripeOnboardingComplete: true,
      stripePayoutsEnabled: true,
      subscriptionTier: 'professional',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      commissionRate: 10,
      stats: {
        totalTrips: 8,
        activeTrips: 6,
        totalBookings: 98,
        totalRevenue: 380000,
        avgRating: 4.6,
        totalReviews: 67
      },
      settings: {
        autoConfirmBookings: true,
        instantBooking: true,
        cancellationPolicy: 'flexible',
        payoutSchedule: 'weekly'
      },
      socialMedia: {
        facebook: 'https://facebook.com/tropicalbeach',
        instagram: 'https://instagram.com/tropicalbeach'
      },
      isActive: true
    },
    {
      businessName: 'Royal Rajasthan Tours',
      businessType: 'individual',
      description: 'Authentic cultural tours exploring Rajasthan heritage and traditions',
      contactEmail: 'contact@royalrajasthan.com',
      contactPhone: '+919876543222',
      website: 'https://royalrajasthan.com',
      address: {
        street: '789 Heritage Street',
        city: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        postalCode: '302001'
      },
      verificationStatus: 'approved',
      verifiedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      stripeAccountId: 'acct_1111111111',
      stripeOnboardingComplete: true,
      stripePayoutsEnabled: true,
      subscriptionTier: 'starter',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      commissionRate: 15,
      stats: {
        totalTrips: 5,
        activeTrips: 4,
        totalBookings: 52,
        totalRevenue: 125000,
        avgRating: 4.7,
        totalReviews: 34
      },
      settings: {
        autoConfirmBookings: false,
        instantBooking: false,
        cancellationPolicy: 'strict',
        payoutSchedule: 'monthly'
      },
      socialMedia: {
        instagram: 'https://instagram.com/royalrajasthan',
        youtube: 'https://youtube.com/royalrajasthan'
      },
      isActive: true
    },
    {
      businessName: 'Alpine European Tours',
      businessType: 'company',
      description: 'Specialized mountain hiking tours across European Alps',
      contactEmail: 'info@alpineeuropean.com',
      contactPhone: '+33123456789',
      website: 'https://alpineeuropean.com',
      address: { street: 'Rue de la Montagne 45', city: 'Chamonix', state: 'Auvergne-Rhône-Alpes', country: 'France', postalCode: '74400' },
      verificationStatus: 'approved',
      verifiedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      stripeAccountId: 'acct_2222222222',
      stripeOnboardingComplete: true,
      stripePayoutsEnabled: true,
      subscriptionTier: 'professional',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      commissionRate: 12,
      stats: { totalTrips: 8, activeTrips: 7, totalBookings: 234, totalRevenue: 567800, avgRating: 4.9, totalReviews: 89 },
      settings: { autoConfirmBookings: true, instantBooking: true, cancellationPolicy: 'moderate', payoutSchedule: 'weekly' },
      isActive: true
    },
    {
      businessName: 'Tropical Asia Adventures',
      businessType: 'company',
      description: 'Beach and island tours across Southeast Asia',
      contactEmail: 'hello@tropicalasia.com',
      contactPhone: '+66987654321',
      website: 'https://tropicalasia.com',
      address: { street: 'Soi 5 Sukhumvit', city: 'Bangkok', country: 'Thailand', postalCode: '10110' },
      verificationStatus: 'approved',
      verifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      stripeAccountId: 'acct_3333333333',
      stripeOnboardingComplete: true,
      stripePayoutsEnabled: true,
      subscriptionTier: 'professional',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
      commissionRate: 14,
      stats: { totalTrips: 12, activeTrips: 11, totalBookings: 456, totalRevenue: 789300, avgRating: 4.8, totalReviews: 156 },
      settings: { autoConfirmBookings: false, instantBooking: false, cancellationPolicy: 'moderate', payoutSchedule: 'weekly' },
      isActive: true
    },
    {
      businessName: 'Nordic Arctic Expeditions',
      businessType: 'company',
      description: 'Arctic and Nordic adventure expeditions with Northern Lights tours',
      contactEmail: 'expeditions@nordicarctic.com',
      contactPhone: '+354555666777',
      website: 'https://nordicarctic.com',
      address: { street: 'Laugavegur 89', city: 'Reykjavik', country: 'Iceland', postalCode: '101' },
      verificationStatus: 'approved',
      verifiedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
      stripeAccountId: 'acct_4444444444',
      stripeOnboardingComplete: true,
      stripePayoutsEnabled: true,
      subscriptionTier: 'enterprise',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      commissionRate: 11,
      stats: { totalTrips: 6, activeTrips: 5, totalBookings: 189, totalRevenue: 445200, avgRating: 4.95, totalReviews: 67 },
      settings: { autoConfirmBookings: true, instantBooking: true, cancellationPolicy: 'flexible', payoutSchedule: 'daily' },
      isActive: true
    }
  ],

  // 3. TRIPS - 6 complete trips with all fields
  trips: [
    {
      title: 'Everest Base Camp Trek - 14 Days Adventure',
      slug: 'everest-base-camp-trek-14-days',
      description: 'Experience the ultimate Himalayan adventure. Trek to the base camp of Mount Everest with experienced guides, exploring Sherpa villages and experiencing authentic mountain culture.',
      shortDescription: 'Epic trek to Mount Everest Base Camp with stunning views',
      category: 'adventure',
      tags: ['trekking', 'himalaya', 'nepal', 'high-altitude', 'experienced'],
      location: 'Kathmandu, Nepal',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          publicId: 'ebc_1',
          caption: 'Mount Everest Base Camp View',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
          publicId: 'ebc_2',
          caption: 'Sherpa Village'
        }
      ],
      duration: { days: 14, nights: 13 },
      dates: [
        {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-03-14'),
          availableSeats: 12,
          bookedSeats: 8,
          price: 1299,
          status: 'available'
        },
        {
          startDate: new Date('2024-04-01'),
          endDate: new Date('2024-04-14'),
          availableSeats: 12,
          bookedSeats: 4,
          price: 1299,
          status: 'available'
        }
      ],
      price: 1299,
      originalPrice: 1999,
      currency: 'INR',
      groupSize: { min: 2, max: 15 },
      itinerary: [
        {
          day: 1,
          title: 'Arrive in Kathmandu',
          description: 'Arrival at Tribhuvan International Airport. Transfer to hotel in Kathmandu. Evening orientation briefing.',
          activities: ['Hotel Check-in', 'Team Briefing'],
          meals: { breakfast: false, lunch: false, dinner: true },
          accommodation: 'Hotel Kathmandu 4-Star'
        },
        {
          day: 2,
          title: 'Kathmandu Valley Tour',
          description: 'Explore UNESCO World Heritage Sites: Pashupatinath Temple, Boudhanath Stupa, and Swayambhunath.',
          activities: ['Breakfast', 'Temple Tour', 'Stupa Visit'],
          meals: { breakfast: true, lunch: true, dinner: true },
          accommodation: 'Hotel Kathmandu 4-Star'
        }
      ],
      inclusions: [
        'All accommodation (tea house style)',
        'Meals: Breakfast, lunch, and dinner',
        'Professional English-speaking guide',
        'Porters for luggage',
        'Nepal entry permit',
        'Travel insurance'
      ],
      exclusions: [
        'International flights',
        'Personal climbing gear',
        'Tips and gratuities'
      ],
      difficulty: 'challenging',
      cancellationPolicy: {
        type: 'moderate',
        refundPercentage: 50,
        daysBeforeTrip: 15,
        description: 'Moderate cancellation policy'
      },
      stats: { views: 5234, bookingsCount: 156, rating: 4.9, reviewCount: 156 },
      isFeatured: true,
      status: 'published',
      isActive: true
    },
    {
      title: 'Maldives Luxury Beach Resort - 7 Days',
      slug: 'maldives-luxury-beach-resort-7-days',
      description: 'Escape to paradise with this all-inclusive luxury beach getaway in the Maldives.',
      shortDescription: 'Luxury beach escape in tropical paradise',
      category: 'beach',
      tags: ['beach', 'maldives', 'luxury', 'snorkeling', 'honeymoon'],
      location: 'Male, Maldives',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
          publicId: 'maldives_1',
          caption: 'Luxury Resort Overview',
          isPrimary: true
        }
      ],
      duration: { days: 7, nights: 6 },
      price: 2499,
      originalPrice: 3499,
      currency: 'INR',
      groupSize: { min: 1, max: 30 },
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Island Transfer',
          description: 'Arrive at Male International Airport. Speed boat transfer to resort.',
          meals: { breakfast: false, lunch: true, dinner: true }
        }
      ],
      inclusions: ['Luxury overwater bungalow', 'All meals and premium beverages'],
      status: 'published',
      isFeatured: true,
      isActive: true,
      stats: { views: 8523, bookingsCount: 234, rating: 4.8, reviewCount: 234 }
    },
    {
      title: 'Rajasthan Golden Triangle - 6 Days',
      slug: 'rajasthan-golden-triangle-6-days',
      description: 'Explore the iconic Golden Triangle: Delhi, Agra, and Jaipur.',
      shortDescription: 'Cultural heritage tour of Rajasthan',
      category: 'cultural',
      tags: ['cultural', 'india', 'heritage', 'monuments', 'history'],
      location: 'Delhi, India',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1512453226082-36c50ee6aacd?w=800',
          publicId: 'taj_mahal',
          caption: 'Taj Mahal',
          isPrimary: true
        }
      ],
      duration: { days: 6, nights: 5 },
      price: 799,
      currency: 'INR',
      groupSize: { min: 2, max: 20 },
      itinerary: [
        { day: 1, title: 'Delhi Arrival', description: 'Explore Delhi', meals: { breakfast: false, lunch: true, dinner: true } }
      ],
      inclusions: ['5 nights accommodation', 'Daily breakfast', 'Train passes'],
      status: 'published',
      isActive: true,
      stats: { views: 6234, bookingsCount: 189, rating: 4.7, reviewCount: 189 }
    },
    {
      title: 'Bali Luxury Spa Retreat - 5 Days',
      slug: 'bali-luxury-spa-retreat-5-days',
      description: 'Indulge in ultimate relaxation at luxury spa resorts in Bali.',
      shortDescription: 'Wellness and spa retreat in tropical Bali',
      category: 'wellness',
      tags: ['spa', 'wellness', 'yoga', 'bali', 'relaxation'],
      location: 'Ubud, Bali',
      images: [{
        url: 'https://images.unsplash.com/photo-1544367567-0d6fcffe7f1f?w=800',
        publicId: 'bali_spa_1',
        caption: 'Luxury Spa Resort',
        isPrimary: true
      }],
      duration: { days: 5, nights: 4 },
      price: 1899,
      currency: 'INR',
      groupSize: { min: 1, max: 20 },
      itinerary: [
        { day: 1, title: 'Arrival & Spa Welcome', description: 'Welcome massage', meals: { breakfast: false, lunch: true, dinner: true } }
      ],
      status: 'published',
      isActive: true,
      stats: { views: 7124, bookingsCount: 267, rating: 4.9, reviewCount: 267 }
    },
    {
      title: 'Swiss Alps Hiking Adventure - 8 Days',
      slug: 'swiss-alps-hiking-adventure-8-days',
      description: 'Explore pristine alpine meadows and majestic mountain peaks in the Swiss Alps with expert mountain guides.',
      shortDescription: 'Alpine hiking through stunning mountain scenery',
      category: 'adventure',
      tags: ['hiking', 'mountains', 'switzerland', 'nature', 'adventure'],
      location: 'Interlaken, Switzerland',
      images: [{
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        publicId: 'swiss_alps_1',
        caption: 'Alpine Mountains',
        isPrimary: true
      }],
      duration: { days: 8, nights: 7 },
      price: 1599,
      currency: 'INR',
      groupSize: { min: 2, max: 12 },
      itinerary: [
        { day: 1, title: 'Arrival in Interlaken', description: 'Welcome briefing and gear check', meals: { breakfast: false, lunch: true, dinner: true } }
      ],
      inclusions: ['Mountain guide', 'Accommodation in alpine villages', 'All meals', 'Equipment rental'],
      status: 'published',
      isActive: true,
      stats: { views: 5634, bookingsCount: 145, rating: 4.8, reviewCount: 145 }
    },
    {
      title: 'Japan Cultural Tour - 12 Days',
      slug: 'japan-cultural-tour-12-days',
      description: 'Discover ancient temples, modern cities, and traditional culture across Tokyo, Kyoto, and Osaka.',
      shortDescription: 'Immersive cultural experience in Japan',
      category: 'cultural',
      tags: ['japan', 'culture', 'temples', 'asia', 'travel'],
      location: 'Tokyo, Japan',
      images: [{
        url: 'https://images.unsplash.com/photo-1540959375944-7049f642e9cc?w=800',
        publicId: 'japan_1',
        caption: 'Tokyo Skyline',
        isPrimary: true
      }],
      duration: { days: 12, nights: 11 },
      price: 2199,
      currency: 'INR',
      groupSize: { min: 2, max: 16 },
      itinerary: [
        { day: 1, title: 'Tokyo Arrival', description: 'Explore Shinjuku and Shibuya', meals: { breakfast: false, lunch: true, dinner: true } }
      ],
      inclusions: ['All accommodation', 'JR Pass', 'Guided tours', 'Traditional meals'],
      status: 'published',
      isActive: true,
      stats: { views: 9234, bookingsCount: 312, rating: 4.9, reviewCount: 312 }
    }
  ],

  // 4. BOOKINGS - 5 complete bookings
  bookings: [
    {
      bookingNumber: 'TRV-001-ABC123',
      totalGuests: 3,
      guestDetails: {
        leadGuest: { firstName: 'John', lastName: 'Wilson', email: 'john@example.com', phone: '+919876543210', nationality: 'USA' },
        additionalGuests: [
          { firstName: 'Jane', lastName: 'Wilson' },
          { firstName: 'Emma', lastName: 'Wilson' }
        ],
        specialRequests: 'Early morning breakfast preferred. Need vegetarian meals.'
      },
      basePrice: 107717,
      platformFee: 4150,
      discount: 8300,
      totalPrice: 365947,
      vendorAmount: 357647
    },
    {
      bookingNumber: 'TRV-002-DEF456',
      totalGuests: 1,
      guestDetails: {
        leadGuest: { firstName: 'Sarah', lastName: 'Ahmed', email: 'sarah@example.com', phone: '+919876543211', nationality: 'Egypt' },
        specialRequests: 'Solo traveler. Looking for group activities.'
      },
      basePrice: 207517,
      platformFee: 2075,
      discount: 0,
      totalPrice: 234792,
      vendorAmount: 232717
    },
    {
      bookingNumber: 'TRV-003-GHI789',
      totalGuests: 6,
      guestDetails: {
        leadGuest: { firstName: 'Michael', lastName: 'Chen', email: 'michael@example.com', phone: '+919876543212', nationality: 'Singapore' },
        additionalGuests: [
          { firstName: 'Lisa', lastName: 'Chen' },
          { firstName: 'Robert', lastName: 'Martinez' },
          { firstName: 'Carmen', lastName: 'Martinez' },
          { firstName: 'David', lastName: 'Chen' },
          { firstName: 'Emily', lastName: 'Martinez' }
        ],
        specialRequests: 'Large family group. Need 3 rooms. Kids need child-friendly activities.'
      },
      basePrice: 107717,
      platformFee: 8300,
      discount: 41500,
      totalPrice: 715711,
      vendorAmount: 707411
    },
    {
      bookingNumber: 'TRV-004-JKL012',
      totalGuests: 2,
      guestDetails: {
        leadGuest: { firstName: 'David', lastName: 'Kim', email: 'david@example.com', phone: '+919876543215', nationality: 'South Korea' },
        additionalGuests: [
          { firstName: 'Jennifer', lastName: 'Kim' }
        ],
        specialRequests: 'Honeymoon couple. Special romantic dinner requested.'
      },
      basePrice: 182517,
      platformFee: 4150,
      discount: 0,
      totalPrice: 433094,
      vendorAmount: 428944
    },
    {
      bookingNumber: 'TRV-005-MNO345',
      totalGuests: 3,
      guestDetails: {
        leadGuest: { firstName: 'Marco', lastName: 'Rossi', email: 'marco@example.com', phone: '+919876543223', nationality: 'Italy' },
        additionalGuests: [
          { firstName: 'Anna', lastName: 'Rossi' },
          { firstName: 'Paolo', lastName: 'Rossi' }
        ],
        specialRequests: 'Family group trip with elderly member.'
      },
      basePrice: 132717,
      platformFee: 4150,
      discount: 0,
      totalPrice: 442141,
      vendorAmount: 437991
    }
  ],

  // 5. PAYMENTS - 2 payment records
  payments: [
    {
      amount: 4409,
      currency: 'INR',
      type: 'full_payment',
      status: 'succeeded',
      paymentMethod: 'card',
      paymentMethodDetails: {
        brand: 'visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2025
      },
      fees: {
        stripeFee: 132,
        platformFee: 220,
        totalFees: 352
      },
      netAmount: 4057,
      processedAt: new Date()
    },
    {
      amount: 1500,
      currency: 'INR',
      type: 'deposit',
      status: 'pending',
      paymentMethod: null,
      fees: { stripeFee: 0, platformFee: 0, totalFees: 0 }
    },
    {
      amount: 8617,
      currency: 'INR',
      type: 'full_payment',
      status: 'succeeded',
      paymentMethod: 'card',
      paymentMethodDetails: { brand: 'mastercard', last4: '5555', expiryMonth: 3, expiryYear: 2026 },
      fees: { stripeFee: 259, platformFee: 430, totalFees: 689 },
      netAmount: 7928,
      processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      amount: 5218,
      currency: 'INR',
      type: 'full_payment',
      status: 'succeeded',
      paymentMethod: 'card',
      paymentMethodDetails: { brand: 'amex', last4: '3456', expiryMonth: 6, expiryYear: 2027 },
      fees: { stripeFee: 156, platformFee: 260, totalFees: 416 },
      netAmount: 4802,
      processedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
    },
    {
      amount: 2664,
      currency: 'INR',
      type: 'refund',
      status: 'succeeded',
      paymentMethod: 'card',
      paymentMethodDetails: { brand: 'visa', last4: '1111', expiryMonth: 9, expiryYear: 2025 },
      fees: { stripeFee: 0, platformFee: 0, totalFees: 0 },
      netAmount: 2664,
      refundReason: 'Booking cancelled',
      processedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    }
  ],

  // 6. PROMO CODES - 6 promotional codes
  promoCodes: [
    { code: 'WELCOME20', description: '20% discount for new users on first booking', discountType: 'percentage', discountValue: 20, minPurchaseAmount: 500, usageLimit: 100, usagePerUser: 1 },
    { code: 'BEACH50', description: 'Flat $50 off on beach trips', discountType: 'fixed', discountValue: 50, minPurchaseAmount: 1000, usageLimit: 150, usagePerUser: 1 },
    { code: 'EARLYBIRD15', description: 'Early bird discount - book 60 days in advance', discountType: 'percentage', discountValue: 15, minPurchaseAmount: 0, usageLimit: 200, usagePerUser: 1 },
    { code: 'FAMILY25', description: 'Family packages - 25% off for groups of 4+ people', discountType: 'percentage', discountValue: 25, minPurchaseAmount: 1000, usageLimit: 150, usagePerUser: 2 },
    { code: 'ADVENTURE30', description: 'Adventure seekers special - 30% off adventure trips', discountType: 'percentage', discountValue: 30, minPurchaseAmount: 800, usageLimit: 100, usagePerUser: 1 },
    { code: 'SUMMER40', description: 'Summer mega sale - 40% off selected trips', discountType: 'percentage', discountValue: 40, maxDiscount: 500, minPurchaseAmount: 1200, usageLimit: 200, usagePerUser: 1 }
  ],

  // 7. REVIEWS - 5 simple reviews matching the model
  reviews: [
    { rating: 5, title: 'Life-Changing Trek Experience!', body: 'Absolutely incredible! The guides were fantastic, the views were breathtaking, and the organization was impeccable. This is a must-do trek for anyone who loves mountains.' },
    { rating: 5, title: 'Honeymoon Dream Come True!', body: 'This trip was absolutely perfect for our honeymoon! Every detail was taken care of. The romantic dinner on the beach was unforgettable. The entire team made us feel so special.' },
    { rating: 4, title: 'Great Experience with Minor Issues', body: 'Overall a fantastic trip! The guide was knowledgeable and fun. Some accommodations were basic but that\'s part of the experience. Would definitely book again.' },
    { rating: 4, title: 'Adventurous and Well Organized', body: 'Great adventure trip! The hiking was challenging but rewarding. Our guide knew all the best spots and shared fascinating stories. The only issue was one delayed transfer.' },
    { rating: 3, title: 'Good but Overpriced', body: 'The experience was decent, but I felt the pricing was quite high for what was offered. The accommodations were not as luxurious as advertised. The guide was friendly though.' }
  ]
};

// Main seeding function
async function seedDetailedData() {
  try {
    console.log('\n🌱 Starting Detailed Data Seeding...\n');

    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Clear existing data
    console.log('🗑️  Clearing existing collections...');
    await User.deleteMany({});
    await Vendor.deleteMany({});
    await Trip.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
    await Review.deleteMany({});
    await PromoCode.deleteMany({});
    console.log('✅ All collections cleared\n');

    // 1. Seed Users
    console.log('👥 Seeding Users...');
    const createdUsers = await User.insertMany(DETAILED_DATA.users);
    console.log(`✅ Created ${createdUsers.length} users`);
    console.log(`   Emails: ${createdUsers.map(u => u.email).join(', ')}\n`);

    // 2. Seed Vendors (link to vendor users)
    console.log('🏢 Seeding Vendors...');
    const vendorUsers = createdUsers.filter(u => u.role === 'vendor');
    const vendorsWithUsers = DETAILED_DATA.vendors.map((vendor, index) => ({
      ...vendor,
      user: vendorUsers[index]._id
    }));
    const createdVendors = await Vendor.insertMany(vendorsWithUsers);
    console.log(`✅ Created ${createdVendors.length} vendors`);
    console.log(`   ${createdVendors.map(v => v.businessName).join(', ')}\n`);

    // 3. Seed Trips (link to first vendor)
    console.log('✈️  Seeding Trips...');
    const tripsWithVendor = DETAILED_DATA.trips.map((trip, index) => ({
      ...trip,
      vendor: createdVendors[index % createdVendors.length].user
    }));
    const createdTrips = await Trip.insertMany(tripsWithVendor);
    console.log(`✅ Created ${createdTrips.length} trips`);
    createdTrips.forEach(trip => {
      const price = trip?.price?.amount || 'N/A';
      const currency = trip?.price?.currency || '';
      console.log(`   - ${trip.title} (${price} ${currency})`);
    });
    console.log('');

    // 4. Seed Bookings (link to customer, trip, and vendor)
    console.log('📅 Seeding Bookings...');
    const customerUsers = createdUsers.filter(u => u.role === 'customer');
    const bookingsWithReferences = DETAILED_DATA.bookings.map((booking, index) => {
      const trip = createdTrips[index % createdTrips.length];
      const vendor = createdVendors[index % createdVendors.length];
      return {
        ...booking,
        user: customerUsers[index % customerUsers.length]._id,
        trip: trip._id,
        vendor: vendor._id
      };
    });
    const createdBookings = await Booking.insertMany(bookingsWithReferences);
    console.log(`✅ Created ${createdBookings.length} bookings`);
    createdBookings.forEach(booking => {
      console.log(`   - ${booking.bookingNumber} (${booking.totalGuests} guests, ${booking.totalPrice} ${booking.currency || 'USD'})`);
    });
    console.log('');

    // 5. Seed Payments (link to bookings)
    console.log('💳 Seeding Payments...');
    const paymentsWithReferences = DETAILED_DATA.payments.map((payment, index) => ({
      ...payment,
      booking: createdBookings[index % createdBookings.length]._id,
      customer: createdBookings[index % createdBookings.length].user,
      vendor: createdVendors[index % createdVendors.length]._id
    }));
    const createdPayments = await Payment.insertMany(paymentsWithReferences);
    console.log(`✅ Created ${createdPayments.length} payments`);
    createdPayments.forEach(payment => {
      console.log(`   - ${payment.amount} ${payment.currency} (${payment.status})`);
    });
    console.log('');

    // 6. Seed Promo Codes
    console.log('🎟️  Seeding Promo Codes...');
    const promosToCreate = DETAILED_DATA.promoCodes.map(promo => ({
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minPurchaseAmount: promo.minPurchaseAmount || 0,
      usageLimit: promo.usageLimit || null,
      usagePerUser: promo.usagePerUser || 1,
      validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    }));
    const createdPromos = await PromoCode.insertMany(promosToCreate);
    console.log(`✅ Created ${createdPromos.length} promo codes`);
    createdPromos.forEach(promo => {
      console.log(`   - ${promo.code} (${promo.discountValue}${promo.discountType === 'percentage' ? '%' : '$'} off)`);
    });
    console.log('');

    // 7. Seed Reviews (link to trip and author)
    console.log('⭐ Seeding Reviews...');
    const reviewsToCreate = DETAILED_DATA.reviews.map((review, index) => ({
      title: review.title,
      body: review.body,
      rating: review.rating,
      trip: createdTrips[index % createdTrips.length]._id,
      author: customerUsers[index % customerUsers.length]._id
    }));
    const createdReviews = await Review.insertMany(reviewsToCreate);
    console.log(`✅ Created ${createdReviews.length} reviews`);
    createdReviews.forEach(review => {
      console.log(`   - "${review.title}" (${review.rating}⭐)`);
    });
    console.log('');

    // Summary
    console.log('════════════════════════════════════════\n');
    console.log('📊 SEEDING COMPLETE - DATA SUMMARY\n');
    console.log('════════════════════════════════════════');
    console.log(`   ✅ Users: ${createdUsers.length} documents`);
    console.log(`   ✅ Vendors: ${createdVendors.length} documents`);
    console.log(`   ✅ Trips: ${createdTrips.length} documents`);
    console.log(`   ✅ Bookings: ${createdBookings.length} documents`);
    console.log(`   ✅ Payments: ${createdPayments.length} documents`);
    console.log(`   ✅ Promo Codes: ${createdPromos.length} documents`);
    console.log(`   ✅ Reviews: ${createdReviews.length} documents`);
    console.log(`\n   📈 Total: ${createdUsers.length + createdVendors.length + createdTrips.length + createdBookings.length + createdPayments.length + createdPromos.length + createdReviews.length} documents\n`);

    console.log('════════════════════════════════════════\n');
    console.log('🔐 TEST CREDENTIALS\n');
    console.log('Customer: john.wilson@example.com / SecurePass123!@');
    console.log('Vendor:   raj.adventuretravel@example.com / VendorPass123!@');
    console.log('Admin:    admin@travellr.com / AdminPass123!@\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  seedDetailedData();
}

module.exports = seedDetailedData;

