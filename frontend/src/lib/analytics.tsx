'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
    dataLayer: any[];
  }
}

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Initialize GA4
export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_TRACKING_ID || typeof window.gtag === 'undefined') return;

    const url = pathname + (searchParams ? `?${searchParams}` : '');
    
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      custom_map: {
        custom_parameter_1: 'user_type',
        custom_parameter_2: 'trip_category'
      }
    });
  }, [pathname, searchParams]);

  if (!GA_TRACKING_ID) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              // Enhanced ecommerce
              allow_enhanced_conversions: true,
              allow_google_signals: true,
              // Privacy settings
              anonymize_ip: true,
              respect_dnt: true,
              // Custom dimensions
              custom_map: {
                'custom_parameter_1': 'user_type',
                'custom_parameter_2': 'trip_category',
                'custom_parameter_3': 'booking_source'
              }
            });
          `
        }}
      />
    </>
  );
}

// Analytics helper functions
export const analytics = {
  // Page view tracking
  pageView: (url: string, title?: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
      page_title: title
    });
  },

  // Generic event tracking
  event: ({ action, category, label, value, custom_parameters }: AnalyticsEvent) => {
    if (typeof window.gtag === 'undefined') return;

    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...custom_parameters
    });
  },

  // User authentication events
  login: (method: string = 'email') => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'login', {
      method: method
    });
  },

  signup: (method: string = 'email') => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'sign_up', {
      method: method
    });
  },

  // Trip discovery events
  search: (searchTerm: string, category?: string, location?: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'search', {
      search_term: searchTerm,
      trip_category: category,
      location: location
    });
  },

  viewTrip: (tripId: string, tripName: string, category: string, price: number) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'view_item', {
      currency: 'INR',
      value: price,
      items: [{
        item_id: tripId,
        item_name: tripName,
        item_category: category,
        price: price,
        quantity: 1
      }]
    });
  },

  selectTrip: (tripId: string, tripName: string, category: string, price: number, source: string = 'search') => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'select_item', {
      currency: 'INR',
      value: price,
      content_type: 'trip',
      items: [{
        item_id: tripId,
        item_name: tripName,
        item_category: category,
        price: price,
        quantity: 1
      }],
      source: source
    });
  },

  // Wishlist events
  addToWishlist: (tripId: string, tripName: string, category: string, price: number) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'add_to_wishlist', {
      currency: 'INR',
      value: price,
      items: [{
        item_id: tripId,
        item_name: tripName,
        item_category: category,
        price: price,
        quantity: 1
      }]
    });
  },

  removeFromWishlist: (tripId: string, tripName: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'remove_from_wishlist', {
      items: [{
        item_id: tripId,
        item_name: tripName,
        quantity: 1
      }]
    });
  },

  // Booking funnel events
  beginCheckout: (tripId: string, tripName: string, category: string, price: number, participants: number) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: price * participants,
      items: [{
        item_id: tripId,
        item_name: tripName,
        item_category: category,
        price: price,
        quantity: participants
      }]
    });
  },

  addPaymentInfo: (paymentMethod: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'add_payment_info', {
      currency: 'INR',
      payment_type: paymentMethod
    });
  },

  purchase: (
    transactionId: string,
    tripId: string,
    tripName: string,
    category: string,
    price: number,
    participants: number,
    tax: number = 0,
    coupon?: string
  ) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: price * participants + tax,
      tax: tax,
      currency: 'INR',
      coupon: coupon,
      items: [{
        item_id: tripId,
        item_name: tripName,
        item_category: category,
        price: price,
        quantity: participants
      }]
    });
  },

  // Engagement events
  share: (method: string, contentType: string = 'trip', contentId: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'share', {
      method: method,
      content_type: contentType,
      content_id: contentId
    });
  },

  videoStart: (videoTitle: string, videoDuration: number) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'video_start', {
      video_title: videoTitle,
      video_duration: videoDuration
    });
  },

  videoComplete: (videoTitle: string, videoDuration: number) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'video_complete', {
      video_title: videoTitle,
      video_duration: videoDuration
    });
  },

  // Filter and search refinement
  filterApply: (filterType: string, filterValue: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'filter_apply', {
      filter_type: filterType,
      filter_value: filterValue
    });
  },

  sortApply: (sortType: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'sort_apply', {
      sort_type: sortType
    });
  },

  // Customer support events
  contactSupport: (method: string, topic?: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'contact_support', {
      contact_method: method,
      support_topic: topic
    });
  },

  // Review and rating events
  submitReview: (tripId: string, rating: number, hasPhotos: boolean = false) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'submit_review', {
      trip_id: tripId,
      rating: rating,
      has_photos: hasPhotos
    });
  },

  // Vendor events
  contactVendor: (vendorId: string, method: string = 'message') => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'contact_vendor', {
      vendor_id: vendorId,
      contact_method: method
    });
  },

  // Custom business events
  bookingModification: (bookingId: string, modificationType: 'cancel' | 'reschedule' | 'upgrade') => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'booking_modification', {
      booking_id: bookingId,
      modification_type: modificationType
    });
  },

  promocodeApply: (promoCode: string, discountAmount: number) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'promocode_apply', {
      promocode: promoCode,
      discount_amount: discountAmount,
      currency: 'INR'
    });
  },

  newsletterSignup: (source: string = 'footer') => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'newsletter_signup', {
      source: source
    });
  },

  // Error tracking
  error: (errorType: string, errorMessage: string, page: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'exception', {
      description: `${errorType}: ${errorMessage}`,
      fatal: false,
      page: page
    });
  },

  // Performance tracking
  timing: (name: string, value: number, category: string = 'performance') => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'timing_complete', {
      name: name,
      value: value,
      event_category: category
    });
  }
};

// Custom hook for analytics
export function useAnalytics() {
  return analytics;
}

// Enhanced ecommerce data layer helper
export const ecommerce = {
  viewItemList: (items: any[], listName: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'view_item_list', {
      item_list_name: listName,
      items: items
    });
  },

  selectPromotion: (promotionId: string, promotionName: string, creativeName: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'select_promotion', {
      promotion_id: promotionId,
      promotion_name: promotionName,
      creative_name: creativeName
    });
  },

  viewPromotion: (promotionId: string, promotionName: string) => {
    if (typeof window.gtag === 'undefined') return;
    
    window.gtag('event', 'view_promotion', {
      promotion_id: promotionId,
      promotion_name: promotionName
    });
  }
};

export default analytics;