'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Flag, 
  Camera,
  Calendar,
  User,
  CheckCircle,
  MapPin,
  Filter,
  SortDesc,
  ChevronDown,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { OptimizedImage } from '@/components/ui/optimized-image';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface Review {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
    reviewCount: number;
  };
  rating: number;
  title: string;
  content: string;
  photos: string[];
  aspects: {
    experience: number;
    value: number;
    guide: number;
    accommodation: number;
    transportation: number;
  };
  travelDate: string;
  travelType: 'solo' | 'couple' | 'family' | 'friends' | 'business';
  wouldRecommend: boolean;
  highlights: string[];
  improvements: string[];
  createdAt: string;
  helpfulCount: number;
  isHelpful: boolean;
  isReported: boolean;
}

interface ReviewListProps {
  reviews: Review[];
  totalCount: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  onLoadMore?: () => void;
  onHelpful: (reviewId: string, helpful: boolean) => void;
  onReport: (reviewId: string, reason: string) => void;
  loading?: boolean;
  className?: string;
}

const aspectLabels = {
  experience: 'Experience',
  value: 'Value',
  guide: 'Guide',
  accommodation: 'Stay',
  transportation: 'Transport'
};

const travelTypeLabels = {
  solo: { label: 'Solo Travel', icon: '🧳' },
  couple: { label: 'Couple', icon: '💕' },
  family: { label: 'Family', icon: '👨‍👩‍👧‍👦' },
  friends: { label: 'Friends', icon: '👥' },
  business: { label: 'Business', icon: '💼' }
};

const sortOptions = [
  { value: 'newest', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'rating_high', label: 'Highest Rated' },
  { value: 'rating_low', label: 'Lowest Rated' },
  { value: 'helpful', label: 'Most Helpful' }
];

const filterOptions = [
  { value: 'all', label: 'All Reviews' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
  { value: 'photos', label: 'With Photos' },
  { value: 'verified', label: 'Verified Travelers' }
];

export default function ReviewList({
  reviews,
  totalCount,
  averageRating,
  ratingDistribution,
  onLoadMore,
  onHelpful,
  onReport,
  loading = false,
  className
}: ReviewListProps) {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const renderStarRating = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderRatingDistribution = () => (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-3xl font-bold">{averageRating.toFixed(1)}</span>
              {renderStarRating(Math.round(averageRating), 'md')}
            </div>
            <p className="text-sm text-gray-600">{totalCount} reviews</p>
          </div>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );

  const renderReviewCard = (review: Review) => {
    const isExpanded = expandedReviews.has(review.id);
    const shouldShowExpand = review.content.length > 200;
    const displayContent = shouldShowExpand && !isExpanded 
      ? review.content.slice(0, 200) + '...' 
      : review.content;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.user.avatar} alt={review.user.name} />
              <AvatarFallback>
                {review.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                {review.user.verified && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{review.user.reviewCount} reviews</span>
                <span>•</span>
                <span>{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" size="sm">
                <Flag className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onReport(review.id, 'spam')}>
                Report as spam
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReport(review.id, 'inappropriate')}>
                Inappropriate content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReport(review.id, 'fake')}>
                Fake review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Rating and Trip Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {renderStarRating(review.rating)}
            <Badge variant="outline" className="flex items-center space-x-1">
              {travelTypeLabels[review.travelType].icon}
              <span>{travelTypeLabels[review.travelType].label}</span>
            </Badge>
            {review.wouldRecommend && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Recommends
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Traveled {formatDate(review.travelDate)}</span>
          </div>
        </div>

        {/* Review Title */}
        {review.title && (
          <h3 className="font-semibold text-gray-900 mb-3">{review.title}</h3>
        )}

        {/* Review Content */}
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{displayContent}</p>
          
          {shouldShowExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(review.id)}
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </Button>
          )}

          {/* Highlights */}
          {review.highlights.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900">What they loved:</h5>
              <div className="flex flex-wrap gap-1">
                {review.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {review.improvements.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900">Areas for improvement:</h5>
              <div className="space-y-1">
                {review.improvements.map((improvement, index) => (
                  <p key={index} className="text-sm text-orange-700 bg-orange-50 px-2 py-1 rounded">
                    {improvement}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Aspect Ratings */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(review.aspects).map(([key, rating]) => (
              <div key={key} className="text-center">
                <div className="text-xs text-gray-600 mb-1">
                  {aspectLabels[key as keyof typeof aspectLabels]}
                </div>
                <div className="flex justify-center">
                  {renderStarRating(rating)}
                </div>
              </div>
            ))}
          </div>

          {/* Photos */}
          {review.photos.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">{review.photos.length} photos</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {review.photos.slice(0, 5).map((photo, index) => (
                  <div key={index} className="relative group">
                    <div 
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedReview(review.id)}
                    >
                      <OptimizedImage
                        src={photo}
                        alt={`Review photo ${index + 1}`}
                        width={120}
                        height={120}
                        className="aspect-square object-cover rounded-lg"
                      />
                    </div>
                    {index === 4 && review.photos.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                        +{review.photos.length - 5}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onHelpful(review.id, !review.isHelpful)}
              className={cn(
                "flex items-center space-x-2",
                review.isHelpful && "text-blue-600"
              )}
            >
              <ThumbsUp className={cn(
                "w-4 h-4",
                review.isHelpful && "fill-current"
              )} />
              <span>Helpful ({review.helpfulCount})</span>
            </Button>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>Verified stay</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Rating Overview */}
      {renderRatingDistribution()}

      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {filterOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setFilterBy(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <SortDesc className="w-4 h-4 mr-2" />
                Sort
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-sm text-gray-600">
          Showing {reviews.length} of {totalCount} reviews
        </p>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        <AnimatePresence>
          {reviews.map((review) => (
            <motion.div key={review.id} layout>
              {renderReviewCard(review)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {onLoadMore && reviews.length < totalCount && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4"
              >
                <Star className="w-4 h-4" />
              </motion.div>
            ) : (
              'Load More Reviews'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
