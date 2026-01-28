'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, ThumbsUp, Flag, ChevronDown, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Review } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

interface TripReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

const ratingCategories = [
  { key: 'value', label: 'Value' },
  { key: 'guide', label: 'Guide' },
  { key: 'accommodation', label: 'Accommodation' },
  { key: 'transportation', label: 'Transportation' },
  { key: 'food', label: 'Food' },
  { key: 'safety', label: 'Safety' },
] as const;

export function TripReviews({
  reviews,
  averageRating,
  totalReviews,
  onLoadMore,
  hasMore,
  isLoading,
}: TripReviewsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);

  const toggleReviewExpand = (reviewId: string) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.round(r.ratings.overall) === rating).length,
    percentage: Math.round(
      (reviews.filter((r) => Math.round(r.ratings.overall) === rating).length / totalReviews) * 100
    ) || 0,
  }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
      </div>

      {/* Rating Summary */}
      <div className="p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overall Rating */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className="text-5xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
              <Star className="h-10 w-10 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-gray-500 mt-1">
              Based on {totalReviews} reviews
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-10">{count}</span>
              </div>
            ))}
          </div>

          {/* Category Ratings */}
          <div className="grid grid-cols-2 gap-3">
            {ratingCategories.map(({ key, label }) => {
              const avg =
                reviews.reduce((sum, r) => sum + r.ratings[key], 0) / reviews.length || 0;
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{label}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-900">
                      {avg.toFixed(1)}
                    </span>
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {reviews.length} of {totalReviews} reviews
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-gray-100">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.includes(review._id);
          const contentIsLong = review.content.length > 300;

          return (
            <div key={review._id} className="p-6">
              {/* Review Header */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium shrink-0 overflow-hidden">
                  {typeof review.customer === 'object' && review.customer.avatar ? (
                    <Image
                      src={review.customer.avatar.url}
                      alt={review.customer.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    typeof review.customer === 'object' 
                      ? review.customer.name?.charAt(0).toUpperCase()
                      : 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">
                      {typeof review.customer === 'object' 
                        ? review.customer.name 
                        : 'Anonymous'
                      }
                    </h4>
                    {review.isVerifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-4 w-4',
                            i < review.ratings.overall
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(parseISO(review.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Title */}
              {review.title && (
                <h5 className="font-medium text-gray-900 mt-4">{review.title}</h5>
              )}

              {/* Review Content */}
              <div className="mt-3">
                <p className={cn(
                  'text-gray-600',
                  !isExpanded && contentIsLong && 'line-clamp-4'
                )}>
                  {review.content}
                </p>
                {contentIsLong && (
                  <button
                    onClick={() => toggleReviewExpand(review._id)}
                    className="text-[#FF6B35] text-sm font-medium mt-2 hover:underline"
                  >
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>

              {/* Review Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {review.photos.map((photo, index) => (
                    <div
                      key={photo.publicId || index}
                      className="w-20 h-20 rounded-lg overflow-hidden shrink-0"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.caption || `Review photo ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Vendor Response */}
              {review.vendorResponse && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">Response from vendor</span>
                    <span className="text-xs text-gray-500">
                      {format(parseISO(review.vendorResponse.respondedAt), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{review.vendorResponse.content}</p>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpfulVotes.count})
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <Flag className="h-4 w-4" />
                  Report
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}
    </div>
  );
}
