'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Zap, 
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Tag,
  Clock,
  Star,
  ChevronRight,
  X,
  Sparkles,
  Gift,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage, TripCardImage } from '@/components/ui/optimized-image';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface TargetedOffer {
  id: string;
  type: 'discount' | 'upgrade' | 'bundle' | 'early_bird' | 'last_minute' | 'loyalty';
  title: string;
  description: string;
  value: number;
  valueType: 'percentage' | 'fixed' | 'upgrade';
  validUntil: Date;
  targetReason: string[];
  conditions?: string[];
  tripIds?: string[];
  categoryFilters?: string[];
  isPersonalized: boolean;
  urgency: 'low' | 'medium' | 'high';
  claimed: boolean;
  ctaText: string;
  iconColor: string;
  bgColor: string;
}

interface PersonalizedTrip {
  id: string;
  title: string;
  location: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  category: string;
  duration: number;
  matchScore: number;
}

interface UserBehaviorData {
  searchHistory: string[];
  viewedCategories: Record<string, number>;
  priceRange: [number, number];
  bookingHistory: Array<{
    tripId: string;
    category: string;
    price: number;
    rating: number;
    bookedAt: Date;
  }>;
  wishlisted: string[];
  abandonedCarts: Array<{
    tripId: string;
    abandonedAt: Date;
    stage: 'product_view' | 'checkout' | 'payment';
  }>;
  loyaltyScore: number;
  lastActiveDate: Date;
}

interface SmartOfferEngineProps {
  userId: string;
  userBehavior: UserBehaviorData;
  onOfferClaim?: (offer: TargetedOffer) => void;
  onOfferDismiss?: (offerId: string) => void;
  className?: string;
}

const offerTypes = {
  discount: { icon: Percent, label: 'Discount', color: 'text-red-600', bg: 'bg-red-50' },
  upgrade: { icon: TrendingUp, label: 'Upgrade', color: 'text-purple-600', bg: 'bg-purple-50' },
  bundle: { icon: Gift, label: 'Bundle', color: 'text-green-600', bg: 'bg-green-50' },
  early_bird: { icon: Clock, label: 'Early Bird', color: 'text-blue-600', bg: 'bg-blue-50' },
  last_minute: { icon: Zap, label: 'Last Minute', color: 'text-orange-600', bg: 'bg-orange-50' },
  loyalty: { icon: Star, label: 'Loyalty Reward', color: 'text-yellow-600', bg: 'bg-yellow-50' }
};

export default function SmartOfferEngine({
  userId,
  userBehavior,
  onOfferClaim,
  onOfferDismiss,
  className
}: SmartOfferEngineProps) {
  const [offers, setOffers] = useState<TargetedOffer[]>([]);
  const [recommendedTrips, setRecommendedTrips] = useState<PersonalizedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<TargetedOffer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate smart offers based on user behavior
  const generateSmartOffers = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an AI/ML service call
      // const response = await fetch('/api/offers/generate', {
      //   method: 'POST',
      //   body: JSON.stringify({ userId, userBehavior })
      // });
      
      // Mock offer generation based on behavior analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedOffers: TargetedOffer[] = [];

      // Analyze user behavior patterns
      const avgPrice = (userBehavior.priceRange[0] + userBehavior.priceRange[1]) / 2;
      const topCategory = Object.entries(userBehavior.viewedCategories)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'adventure';
      
      // Abandoned cart recovery
      if (userBehavior.abandonedCarts.length > 0) {
        const recentAbandon = userBehavior.abandonedCarts[0];
        const daysSinceAbandon = Math.floor(
          (new Date().getTime() - recentAbandon.abandonedAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (daysSinceAbandon <= 3) {
          generatedOffers.push({
            id: 'abandon-recovery-1',
            type: 'discount',
            title: 'Complete Your Booking!',
            description: 'Get 15% off the trip you were viewing. Limited time offer!',
            value: 15,
            valueType: 'percentage',
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            targetReason: ['You left a trip in your cart', 'Special recovery discount'],
            tripIds: [recentAbandon.tripId],
            isPersonalized: true,
            urgency: 'high',
            claimed: false,
            ctaText: 'Claim 15% Off',
            iconColor: 'text-red-600',
            bgColor: 'bg-red-50'
          });
        }
      }

      // Loyalty rewards
      if (userBehavior.loyaltyScore > 50) {
        generatedOffers.push({
          id: 'loyalty-reward-1',
          type: 'loyalty',
          title: 'Loyal Traveler Bonus',
          description: 'You\'ve been amazing! Here\'s a special upgrade just for you.',
          value: 1,
          valueType: 'upgrade',
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          targetReason: ['Loyal customer reward', `${userBehavior.bookingHistory.length} trips completed`],
          isPersonalized: true,
          urgency: 'medium',
          claimed: false,
          ctaText: 'Claim Upgrade',
          iconColor: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        });
      }

      // Category-specific offers
      generatedOffers.push({
        id: `category-${topCategory}`,
        type: 'discount',
        title: `${topCategory.charAt(0).toUpperCase() + topCategory.slice(1)} Lover's Deal`,
        description: `20% off all ${topCategory} trips. Perfect match for your interests!`,
        value: 20,
        valueType: 'percentage',
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        targetReason: [`You love ${topCategory} trips`, 'Based on your browsing history'],
        categoryFilters: [topCategory],
        isPersonalized: true,
        urgency: 'medium',
        claimed: false,
        ctaText: 'Get 20% Off',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50'
      });

      // Price-sensitive user offer
      if (avgPrice < 15000) {
        generatedOffers.push({
          id: 'budget-friendly',
          type: 'bundle',
          title: 'Budget Explorer Bundle',
          description: 'Book 2 trips and save ₹3000 total. Great value for smart travelers!',
          value: 3000,
          valueType: 'fixed',
          validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          targetReason: ['Perfect for your budget', 'Multi-trip savings'],
          conditions: ['Book 2 or more trips', 'Minimum ₹8000 per trip'],
          isPersonalized: true,
          urgency: 'low',
          claimed: false,
          ctaText: 'Save ₹3000',
          iconColor: 'text-green-600',
          bgColor: 'bg-green-50'
        });
      }

      // Last minute deals for spontaneous users
      if (userBehavior.bookingHistory.some(booking => {
        const bookingGap = new Date(booking.bookedAt).getTime() - new Date().getTime();
        return Math.abs(bookingGap) < 7 * 24 * 60 * 60 * 1000; // Booked within 7 days
      })) {
        generatedOffers.push({
          id: 'last-minute',
          type: 'last_minute',
          title: 'Spontaneous Traveler Special',
          description: 'Flash sale! 25% off trips departing in the next 2 weeks.',
          value: 25,
          valueType: 'percentage',
          validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
          targetReason: ['You love spontaneous trips', 'Limited time flash sale'],
          conditions: ['Departing within 14 days'],
          isPersonalized: true,
          urgency: 'high',
          claimed: false,
          ctaText: 'Flash Sale!',
          iconColor: 'text-orange-600',
          bgColor: 'bg-orange-50'
        });
      }

      setOffers(generatedOffers);
      
      // Also generate recommended trips
      const mockTrips: PersonalizedTrip[] = [
        {
          id: '1',
          title: 'Manali Adventure Weekend',
          location: 'Himachal Pradesh',
          price: 8500,
          originalPrice: 10000,
          images: ['/images/trips/manali1.jpg'],
          rating: 4.8,
          category: 'adventure',
          duration: 3,
          matchScore: 0.92
        },
        {
          id: '2',
          title: 'Kerala Backwaters',
          location: 'Kerala',
          price: 12000,
          images: ['/images/trips/kerala1.jpg'],
          rating: 4.9,
          category: 'nature',
          duration: 4,
          matchScore: 0.88
        }
      ];
      
      setRecommendedTrips(mockTrips);
      
    } catch (error) {
      console.error('Failed to generate offers:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [userId, userBehavior]);

  // Initialize offers
  useEffect(() => {
    const initializeOffers = async () => {
      setLoading(true);
      await generateSmartOffers();
      setLoading(false);
    };
    
    initializeOffers();
  }, [generateSmartOffers]);

  // Format time remaining
  const formatTimeRemaining = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} minute${minutes > 1 ? 's' : ''} left`;
  };

  // Get urgency color
  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Handle offer claim
  const handleOfferClaim = (offer: TargetedOffer) => {
    setOffers(prev => prev.map(o => 
      o.id === offer.id ? { ...o, claimed: true } : o
    ));
    onOfferClaim?.(offer);
  };

  // Handle offer dismiss
  const handleOfferDismiss = (offerId: string) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
    onOfferDismiss?.(offerId);
  };

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-12", className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 text-blue-600"
        >
          <Target className="w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Target className="w-6 h-6" />
            <span>Smart Offers</span>
          </h2>
          <p className="text-gray-600">Personalized deals crafted just for you</p>
        </div>
        
        {isGenerating && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">Generating...</span>
          </motion.div>
        )}
      </div>

      {/* Active Offers */}
      {offers.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Exclusive Offers</h3>
          <div className="grid gap-4">
            {offers.map((offer) => {
              const OfferIcon = offerTypes[offer.type].icon;
              
              return (
                <motion.div
                  key={offer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group"
                >
                  <Card className={cn(
                    "overflow-hidden border-2 transition-all duration-300",
                    offer.urgency === 'high' ? "border-red-200 bg-red-50/50" :
                    offer.urgency === 'medium' ? "border-orange-200 bg-orange-50/50" :
                    "border-green-200 bg-green-50/50",
                    offer.claimed && "opacity-60"
                  )}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Offer Icon */}
                          <div className={cn("p-3 rounded-full", offer.bgColor)}>
                            <OfferIcon className={cn("w-6 h-6", offer.iconColor)} />
                          </div>
                          
                          {/* Offer Details */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {offer.title}
                              </h4>
                              <Badge 
                                variant="outline" 
                                className={cn("text-xs", getUrgencyColor(offer.urgency))}
                              >
                                {offer.urgency} priority
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600">{offer.description}</p>
                            
                            {/* Value Display */}
                            <div className="flex items-center space-x-4">
                              <div className={cn("text-2xl font-bold", offer.iconColor)}>
                                {offer.valueType === 'percentage' ? `${offer.value}% OFF` :
                                 offer.valueType === 'fixed' ? `₹${offer.value} OFF` :
                                 'FREE UPGRADE'}
                              </div>
                              <div className="text-sm text-gray-500">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {formatTimeRemaining(offer.validUntil)}
                              </div>
                            </div>
                            
                            {/* Personalization Reasons */}
                            <div className="flex flex-wrap gap-1">
                              {offer.targetReason.map((reason, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                            
                            {/* Conditions */}
                            {offer.conditions && (
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Conditions: </span>
                                {offer.conditions.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-start space-x-2 ml-4">
                          {!offer.claimed ? (
                            <>
                              <Button 
                                onClick={() => handleOfferClaim(offer)}
                                className="whitespace-nowrap"
                              >
                                {offer.ctaText}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOfferDismiss(offer.id)}
                                className="p-2"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Badge className="bg-green-600 text-white">
                              Claimed!
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <Card className="text-center p-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No offers available right now
          </h3>
          <p className="text-gray-600 mb-4">
            Browse some trips to get personalized offers tailored just for you.
          </p>
          <Button onClick={generateSmartOffers} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Get My Offers'}
          </Button>
        </Card>
      )}

      {/* Recommended Trips with Offers */}
      {recommendedTrips.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Trips Perfect for Your Offers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedTrips.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <TripCardImage
                      src={trip.images[0] || '/images/placeholder-trip.jpg'}
                      alt={trip.title}
                      width={300}
                      height={200}
                    />
                    
                    {/* Match Score */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-blue-600 text-white flex items-center space-x-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{Math.round(trip.matchScore * 100)}% match</span>
                      </Badge>
                    </div>

                    {/* Applicable Offers */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600 text-white">
                        {offers.filter(o => !o.claimed).length} offers available
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {trip.title}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {trip.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{trip.rating}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{trip.duration} days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{trip.price.toLocaleString()}
                          </span>
                          {trip.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{trip.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">per person</p>
                      </div>
                      
                      <Button size="sm" className="flex items-center space-x-1">
                        <span>Apply Offers</span>
                        <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Offer Details Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedOffer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{selectedOffer.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOffer(null)}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600">{selectedOffer.description}</p>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Valid until:</span>
                    <span className="text-gray-600">
                      {selectedOffer.validUntil.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => {
                      handleOfferClaim(selectedOffer);
                      setSelectedOffer(null);
                    }}
                    className="flex-1"
                  >
                    Claim Offer
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedOffer(null)}
                  >
                    Later
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}