'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Sparkles,
  Heart,
  Clock,
  MapPin,
  Calendar,
  Users,
  Star,
  Filter,
  RotateCcw,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { OptimizedImage, TripCardImage } from '@/components/ui/optimized-image';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface UserPreferences {
  budgetRange: [number, number];
  preferredDestinations: string[];
  travelStyle: 'adventure' | 'luxury' | 'budget' | 'culture' | 'nature' | 'city';
  groupSize: 'solo' | 'couple' | 'small_group' | 'large_group';
  duration: [number, number]; // days
  seasonPreference: 'spring' | 'summer' | 'fall' | 'winter' | 'any';
  activityTypes: string[];
  accommodationPreference: 'budget' | 'mid_range' | 'luxury' | 'unique';
  interests: string[];
}

interface PersonalizedTrip {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  originalPrice?: number;
  duration: number;
  location: string;
  rating: number;
  reviewCount: number;
  category: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  groupSize: { min: number; max: number };
  highlights: string[];
  personalizedReason: string[];
  matchScore: number;
  isRecommended: boolean;
  isOnSale: boolean;
  availability: 'high' | 'medium' | 'low';
  seasonality: string[];
  vendor: {
    id: string;
    name: string;
    verified: boolean;
  };
}

interface RecommendationEngine {
  recommendations: PersonalizedTrip[];
  preferences: UserPreferences;
  learningData: {
    viewedTrips: string[];
    bookedTrips: string[];
    wishlisted: string[];
    searchHistory: string[];
    ratingHistory: Record<string, number>;
  };
}

interface PersonalizationEngineProps {
  userId: string;
  onTripSelect?: (trip: PersonalizedTrip) => void;
  onPreferencesUpdate?: (preferences: UserPreferences) => void;
  className?: string;
}

const travelStyles = [
  { id: 'adventure', label: 'Adventure', icon: '🏔️', description: 'Thrilling experiences and outdoor activities' },
  { id: 'luxury', label: 'Luxury', icon: '✨', description: 'Premium comfort and exclusive experiences' },
  { id: 'budget', label: 'Budget', icon: '💰', description: 'Great value trips without compromising fun' },
  { id: 'culture', label: 'Culture', icon: '🎭', description: 'Local traditions and cultural immersion' },
  { id: 'nature', label: 'Nature', icon: '🌿', description: 'Natural wonders and wildlife' },
  { id: 'city', label: 'City', icon: '🏙️', description: 'Urban exploration and city life' }
];

const interests = [
  'Photography', 'Food & Cuisine', 'History', 'Architecture', 'Art', 'Music',
  'Wildlife', 'Beaches', 'Mountains', 'Festivals', 'Nightlife', 'Shopping',
  'Wellness', 'Sports', 'Local Markets', 'Museums', 'Temples', 'Gardens'
];

const destinationCategories = [
  { name: 'Popular in India', destinations: ['Goa', 'Kerala', 'Rajasthan', 'Himachal Pradesh', 'Kashmir'] },
  { name: 'International Favorites', destinations: ['Thailand', 'Dubai', 'Singapore', 'Maldives', 'Europe'] },
  { name: 'Adventure Hotspots', destinations: ['Manali', 'Rishikesh', 'Ladakh', 'Spiti', 'Andaman'] },
  { name: 'Cultural Heritage', destinations: ['Varanasi', 'Agra', 'Jaipur', 'Hampi', 'Khajuraho'] }
];

export default function PersonalizationEngine({
  userId,
  onTripSelect,
  onPreferencesUpdate,
  className
}: PersonalizationEngineProps) {
  const [engine, setEngine] = useState<RecommendationEngine | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'preferences' | 'insights'>('recommendations');
  const [preferences, setPreferences] = useState<UserPreferences>({
    budgetRange: [5000, 50000],
    preferredDestinations: [],
    travelStyle: 'adventure',
    groupSize: 'couple',
    duration: [3, 7],
    seasonPreference: 'any',
    activityTypes: [],
    accommodationPreference: 'mid_range',
    interests: []
  });
  const [isLearning, setIsLearning] = useState(false);

  // Initialize personalization engine
  useEffect(() => {
    initializeEngine();
  }, [userId]);

  const initializeEngine = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your personalization API
      // const response = await fetch(`/api/personalization/${userId}`);
      // const data = await response.json();
      
      // Mock personalization engine initialization
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockEngine: RecommendationEngine = {
        preferences: preferences,
        recommendations: generatePersonalizedRecommendations(),
        learningData: {
          viewedTrips: ['trip1', 'trip2', 'trip3'],
          bookedTrips: ['trip4'],
          wishlisted: ['trip5', 'trip6'],
          searchHistory: ['Manali adventure', 'Kerala backwaters', 'Goa beaches'],
          ratingHistory: { trip1: 5, trip2: 4, trip4: 5 }
        }
      };
      
      setEngine(mockEngine);
    } catch (error) {
      console.error('Failed to initialize personalization engine:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate personalized trip recommendations
  const generatePersonalizedRecommendations = (): PersonalizedTrip[] => {
    const baseTrips: Omit<PersonalizedTrip, 'personalizedReason' | 'matchScore' | 'isRecommended'>[] = [
      {
        id: '1',
        title: 'Manali Adventure Weekend',
        slug: 'manali-adventure-weekend',
        description: 'Perfect blend of adventure and scenic beauty in the Himalayas',
        images: ['/images/trips/manali1.jpg', '/images/trips/manali2.jpg'],
        price: 8500,
        originalPrice: 10000,
        duration: 3,
        location: 'Manali, Himachal Pradesh',
        rating: 4.8,
        reviewCount: 156,
        category: 'adventure',
        difficulty: 'moderate',
        groupSize: { min: 2, max: 8 },
        highlights: ['River rafting', 'Trekking', 'Paragliding', 'Local cuisine'],
        isOnSale: true,
        availability: 'medium',
        seasonality: ['spring', 'summer', 'fall'],
        vendor: { id: 'v1', name: 'Mountain Adventures', verified: true }
      },
      {
        id: '2',
        title: 'Kerala Backwater Serenity',
        slug: 'kerala-backwater-serenity',
        description: 'Peaceful houseboat journey through scenic backwaters',
        images: ['/images/trips/kerala1.jpg', '/images/trips/kerala2.jpg'],
        price: 12000,
        duration: 4,
        location: 'Alleppey, Kerala',
        rating: 4.9,
        reviewCount: 243,
        category: 'nature',
        difficulty: 'easy',
        groupSize: { min: 2, max: 6 },
        highlights: ['Houseboat stay', 'Backwater cruise', 'Local fishing', 'Ayurvedic spa'],
        isOnSale: false,
        availability: 'high',
        seasonality: ['winter', 'spring'],
        vendor: { id: 'v2', name: 'Kerala Holidays', verified: true }
      },
      {
        id: '3',
        title: 'Rajasthan Royal Heritage',
        slug: 'rajasthan-royal-heritage',
        description: 'Immerse in royal culture and magnificent architecture',
        images: ['/images/trips/rajasthan1.jpg', '/images/trips/rajasthan2.jpg'],
        price: 15000,
        duration: 5,
        location: 'Jaipur-Udaipur, Rajasthan',
        rating: 4.7,
        reviewCount: 189,
        category: 'culture',
        difficulty: 'easy',
        groupSize: { min: 2, max: 10 },
        highlights: ['Palace tours', 'Camel safari', 'Cultural shows', 'Heritage hotels'],
        isOnSale: false,
        availability: 'medium',
        seasonality: ['fall', 'winter', 'spring'],
        vendor: { id: 'v3', name: 'Royal Rajasthan Tours', verified: true }
      }
    ];

    // Apply personalization logic
    return baseTrips.map(trip => {
      const matchScore = calculateMatchScore(trip, preferences);
      const personalizedReasons = generatePersonalizationReasons(trip, preferences);
      
      return {
        ...trip,
        matchScore,
        personalizedReason: personalizedReasons,
        isRecommended: matchScore > 0.7
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  // Calculate how well a trip matches user preferences
  const calculateMatchScore = (trip: any, prefs: UserPreferences): number => {
    let score = 0;
    let factors = 0;

    // Budget match
    if (trip.price >= prefs.budgetRange[0] && trip.price <= prefs.budgetRange[1]) {
      score += 0.3;
    }
    factors += 0.3;

    // Travel style match
    if (trip.category === prefs.travelStyle) {
      score += 0.25;
    }
    factors += 0.25;

    // Duration match
    if (trip.duration >= prefs.duration[0] && trip.duration <= prefs.duration[1]) {
      score += 0.2;
    }
    factors += 0.2;

    // Interest overlap
    const interestMatch = trip.highlights.some((highlight: string) => 
      prefs.interests.some(interest => 
        highlight.toLowerCase().includes(interest.toLowerCase())
      )
    );
    if (interestMatch) {
      score += 0.15;
    }
    factors += 0.15;

    // Destination preference
    const destinationMatch = prefs.preferredDestinations.some(dest =>
      trip.location.toLowerCase().includes(dest.toLowerCase())
    );
    if (destinationMatch) {
      score += 0.1;
    }
    factors += 0.1;

    return score / factors;
  };

  // Generate personalized reasons for recommendation
  const generatePersonalizationReasons = (trip: any, prefs: UserPreferences): string[] => {
    const reasons: string[] = [];

    if (trip.price >= prefs.budgetRange[0] && trip.price <= prefs.budgetRange[1]) {
      reasons.push('Fits your budget perfectly');
    }

    if (trip.category === prefs.travelStyle) {
      reasons.push(`Perfect for ${prefs.travelStyle} lovers`);
    }

    if (trip.duration >= prefs.duration[0] && trip.duration <= prefs.duration[1]) {
      reasons.push('Ideal duration for your schedule');
    }

    if (trip.rating >= 4.5) {
      reasons.push('Highly rated by travelers like you');
    }

    if (trip.isOnSale) {
      reasons.push('Special offer just for you');
    }

    const interestMatch = trip.highlights.filter((highlight: string) => 
      prefs.interests.some(interest => 
        highlight.toLowerCase().includes(interest.toLowerCase())
      )
    );
    
    if (interestMatch.length > 0) {
      reasons.push(`Includes ${interestMatch[0]} which you love`);
    }

    return reasons.slice(0, 2); // Show max 2 reasons
  };

  // Update user preferences
  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    onPreferencesUpdate?.(updated);
    
    // Regenerate recommendations with new preferences
    if (engine) {
      const newRecommendations = generatePersonalizedRecommendations();
      setEngine({
        ...engine,
        preferences: updated,
        recommendations: newRecommendations
      });
    }
  };

  // Learn from user behavior
  const learnFromInteraction = async (tripId: string, action: 'view' | 'wishlist' | 'book' | 'rate', value?: any) => {
    setIsLearning(true);
    
    try {
      // In a real app, send this to your ML backend
      // await fetch('/api/personalization/learn', {
      //   method: 'POST',
      //   body: JSON.stringify({ userId, tripId, action, value })
      // });
      
      // Mock learning delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local learning data
      if (engine) {
        const newLearningData = { ...engine.learningData };
        
        switch (action) {
          case 'view':
            newLearningData.viewedTrips = [...newLearningData.viewedTrips, tripId];
            break;
          case 'wishlist':
            newLearningData.wishlisted = [...newLearningData.wishlisted, tripId];
            break;
          case 'book':
            newLearningData.bookedTrips = [...newLearningData.bookedTrips, tripId];
            break;
          case 'rate':
            newLearningData.ratingHistory[tripId] = value;
            break;
        }
        
        setEngine({ ...engine, learningData: newLearningData });
      }
    } catch (error) {
      console.error('Failed to learn from interaction:', error);
    } finally {
      setIsLearning(false);
    }
  };

  const renderRecommendationCard = (trip: PersonalizedTrip) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer"
      onClick={() => {
        onTripSelect?.(trip);
        learnFromInteraction(trip.id, 'view');
      }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative">
          <TripCardImage
            src={trip.images[0] || '/images/placeholder-trip.jpg'}
            alt={trip.title}
            width={400}
            height={240}
          />
          
          {/* Match Score Badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-600 text-white flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>{Math.round(trip.matchScore * 100)}% match</span>
            </Badge>
          </div>

          {/* Sale Badge */}
          {trip.isOnSale && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-red-500 text-white">
                Save ₹{(trip.originalPrice || 0) - trip.price}
              </Badge>
            </div>
          )}

          {/* Recommended Badge */}
          {trip.isRecommended && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-green-600 text-white flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>Recommended</span>
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Title and Location */}
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {trip.title}
              </h3>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {trip.location}
              </p>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{trip.rating}</span>
                </div>
                <span className="text-xs text-gray-500">({trip.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-3 h-3" />
                <span>{trip.duration} days</span>
              </div>
            </div>

            {/* Personalized Reasons */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1 text-xs text-blue-600">
                <Brain className="w-3 h-3" />
                <span>Why this is perfect for you:</span>
              </div>
              <div className="space-y-1">
                {trip.personalizedReason.map((reason, index) => (
                  <p key={index} className="text-xs text-gray-700 bg-blue-50 px-2 py-1 rounded">
                    {reason}
                  </p>
                ))}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">₹{trip.price.toLocaleString()}</span>
                  {trip.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{trip.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600">per person</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    learnFromInteraction(trip.id, 'wishlist');
                  }}
                  className="p-2"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="sm">
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* Budget Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Budget Range</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={preferences.budgetRange}
            onValueChange={(value: number[]) => updatePreferences({ budgetRange: value as [number, number] })}
            max={100000}
            min={1000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{preferences.budgetRange[0].toLocaleString()}</span>
            <span>₹{preferences.budgetRange[1].toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Travel Style */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Travel Style</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {travelStyles.map((style) => (
              <Button
                key={style.id}
                variant={preferences.travelStyle === style.id ? "default" : "outline"}
                onClick={() => updatePreferences({ travelStyle: style.id as any })}
                className="flex flex-col items-center space-y-2 h-auto py-4"
              >
                <span className="text-2xl">{style.icon}</span>
                <div className="text-center">
                  <div className="font-medium">{style.label}</div>
                  <div className="text-xs text-gray-600">{style.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <button
                key={interest}
                className={cn(
                  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors",
                  preferences.interests.includes(interest)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                )}
                onClick={() => {
                  const newInterests = preferences.interests.includes(interest)
                    ? preferences.interests.filter(i => i !== interest)
                    : [...preferences.interests, interest];
                  updatePreferences({ interests: newInterests });
                }}
              >
                {interest}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferred Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferred Destinations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {destinationCategories.map((category) => (
            <div key={category.name} className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">{category.name}</h4>
              <div className="flex flex-wrap gap-2">
                {category.destinations.map((destination) => (
                  <button
                    key={destination}
                    className={cn(
                      "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors",
                      preferences.preferredDestinations.includes(destination)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                    )}
                    onClick={() => {
                      const newDestinations = preferences.preferredDestinations.includes(destination)
                        ? preferences.preferredDestinations.filter(d => d !== destination)
                        : [...preferences.preferredDestinations, destination];
                      updatePreferences({ preferredDestinations: newDestinations });
                    }}
                  >
                    {destination}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Your Travel Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {engine?.learningData.bookedTrips.length || 0}
              </div>
              <div className="text-sm text-blue-800">Trips Booked</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {engine?.learningData.wishlisted.length || 0}
              </div>
              <div className="text-sm text-green-800">Trips Saved</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {preferences.travelStyle}
              </div>
              <div className="text-sm text-orange-800 capitalize">Preferred Style</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ₹{Math.round((preferences.budgetRange[0] + preferences.budgetRange[1]) / 2).toLocaleString()}
              </div>
              <div className="text-sm text-purple-800">Avg Budget</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Recent Search History</h4>
            <div className="space-y-2">
              {engine?.learningData.searchHistory.map((search, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{search}</span>
                  <Badge variant="outline">Recent</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommendation Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Personalization Accuracy</span>
                <span className="text-sm font-medium">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Learning Progress</span>
                <span className="text-sm font-medium">64%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '64%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center p-12", className)}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 text-blue-600"
        >
          <Brain className="w-8 h-8" />
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
            <Brain className="w-6 h-6" />
            <span>AI-Powered Recommendations</span>
          </h2>
          <p className="text-gray-600">Trips curated just for you based on your preferences</p>
        </div>
        
        {isLearning && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-full"
          >
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">Learning...</span>
          </motion.div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-gray-200">
        {[
          { id: 'recommendations', label: 'For You', icon: Target },
          { id: 'preferences', label: 'Preferences', icon: Settings },
          { id: 'insights', label: 'Insights', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'recommendations' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {engine?.recommendations && engine.recommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {engine.recommendations.map((trip) => (
                  <div key={trip.id}>
                    {renderRecommendationCard(trip)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Building your recommendations...
                </h3>
                <p className="text-gray-600">
                  Browse some trips to help us understand your preferences better.
                </p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'preferences' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderPreferencesTab()}
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderInsightsTab()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}