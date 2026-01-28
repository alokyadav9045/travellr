export interface User {
  _id: string;
  id: string; // Add id field for consistency
  name: string;
  email: string;
  phone?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  role: 'customer' | 'vendor' | 'admin';
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  preferences: {
    currency: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  wishlist: string[];
  // Additional vendor fields
  totalEarnings?: number;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Trip {
  _id: string;
  id: string; // Add id field for consistency
  vendor: string | Vendor;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  tags: string[];
  location: string;
  images: Array<{
    url: string;
    publicId?: string;
    caption?: string;
    isPrimary: boolean;
  }>;
  videoUrl?: string;
  duration: {
    days: number;
    nights: number;
  };
  tripType: 'fixed_date' | 'flexible' | 'on_demand';
  dates: Departure[];
  price: number;
  currency: string;
  groupSize: {
    min: number;
    max: number;
  };
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  requirements: {
    minAge: number;
    maxAge?: number;
    fitnessLevel: 'easy' | 'moderate' | 'challenging' | 'difficult';
    documents: string[];
    specialRequirements: string[];
  };
  rating: {
    average: number;
    count: number;
  };
  originalPrice?: number;
  status: 'draft' | 'pending_review' | 'published' | 'paused' | 'archived';
  isFeatured: boolean;
  stats: {
    views: number;
    bookings: number;
    wishlistAdds: number;
    rating: number;
    reviewCount: number;
    bookingsCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Departure {
  _id: string;
  startDate: string;
  endDate: string;
  availableSeats: number;
  bookedSeats: number;
  price?: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: Array<{
    time: string;
    title: string;
    description: string;
    duration?: string;
    location?: string;
  }>;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  accommodation?: string;
  image?: {
    url: string;
    publicId?: string;
  };
}

export interface Vendor {
  _id: string;
  user: string | User;
  businessName: string;
  businessType: 'individual' | 'company' | 'agency';
  description?: string;
  logo?: {
    url: string;
    publicId: string;
  };
  address: {
    city: string;
    country: string;
  };
  verificationStatus: 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  stats: {
    totalTrips: number;
    activeTrips: number;
    totalBookings: number;
    totalRevenue: number;
    avgRating: number;
    totalReviews: number;
  };
}

export interface Booking {
  _id: string;
  id: string; // Add id field for compatibility
  bookingNumber: string;
  customer: string | User;
  vendor: string | Vendor;
  trip: string | Trip;
  selectedDate: string; // Add selectedDate field
  tripSnapshot: {
    title: string;
    slug: string;
    duration: { days: number; nights: number };
    location: { city: string; country: string };
    image: string;
  };
  departure: {
    departureId: string;
    startDate: string;
    endDate: string;
  };
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  totalGuests: number;
  leadGuest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  pricing: {
    basePrice: number;
    pricePerPerson: number;
    subtotal: number;
    addOnsTotal: number;
    discountAmount: number;
    taxAmount: number;
    serviceFee: number;
    totalAmount: number;
    currency: string;
  };
  payment: {
    status: 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
    method?: string;
    paidAmount: number;
    paidAt?: string;
  };
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'disputed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  tripId: string;
  departureId: string;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  leadGuest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  guestDetails?: Array<{
    type: 'adult' | 'child' | 'infant';
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  }>;
  addOns?: Array<{
    addOnId: string;
    quantity: number;
  }>;
  specialRequests?: string;
}

export interface Review {
  _id: string;
  booking: string;
  trip: string | Trip;
  vendor: string | Vendor;
  customer: string | User;
  ratings: {
    overall: number;
    value: number;
    guide: number;
    accommodation: number;
    transportation: number;
    food: number;
    safety: number;
  };
  title?: string;
  content: string;
  photos: Array<{
    url: string;
    publicId: string;
    caption?: string;
  }>;
  vendorResponse?: {
    content: string;
    respondedAt: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  helpfulVotes: {
    count: number;
  };
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface TripSearchParams {
  q?: string;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  minRating?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  meta?: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Trip filters interface
export interface TripFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  minRating?: number;
  sort?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Additional missing types
export interface TripFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  duration?: number;
  startDate?: string;
  endDate?: string;
  minRating?: number;
  sort?: string;
}

export interface BookingCreateData {
  tripId: string;
  selectedDate: string;
  guestCount: number;
  guestDetails: {
    adults: number;
    children: number;
    infants: number;
  };
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
}

// Extend PaginatedResponse to include meta field for compatibility
export interface PaginatedResponseWithMeta<T> extends PaginatedResponse<T> {
  meta?: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
