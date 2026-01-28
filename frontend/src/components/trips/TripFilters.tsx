'use client';

import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, X, ChevronDown, 
  MapPin, Calendar, DollarSign, Star, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/cn';

export interface FilterState {
  search: string;
  category: string;
  location: string;
  priceRange: [number, number];
  duration: string;
  rating: number;
  sortBy: string;
  startDate: string;
  tripType: string;
}

interface TripFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults?: number;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'beach', label: 'Beach & Island' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'wildlife', label: 'Wildlife' },
  { value: 'trekking', label: 'Trekking' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'family', label: 'Family' },
];

const durations = [
  { value: '', label: 'Any Duration' },
  { value: '1-3', label: '1-3 Days' },
  { value: '4-7', label: '4-7 Days' },
  { value: '8-14', label: '1-2 Weeks' },
  { value: '15+', label: '2+ Weeks' },
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
];

const priceRanges = [
  { min: 0, max: 10000, label: 'Under ₹10,000' },
  { min: 10000, max: 25000, label: '₹10,000 - ₹25,000' },
  { min: 25000, max: 50000, label: '₹25,000 - ₹50,000' },
  { min: 50000, max: 100000, label: '₹50,000 - ₹1,00,000' },
  { min: 100000, max: Infinity, label: 'Above ₹1,00,000' },
];

export function TripFilters({ 
  filters, 
  onFilterChange, 
  onReset,
  totalResults 
}: TripFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('category');

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFilterCount = [
    filters.category,
    filters.location,
    filters.duration,
    filters.rating > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 500000,
    filters.startDate,
    filters.tripType,
  ].filter(Boolean).length;

  const FilterSection = ({ 
    title, 
    id, 
    children 
  }: { 
    title: string; 
    id: string; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDown 
          className={cn(
            'h-5 w-5 text-gray-500 transition-transform',
            expandedSection === id && 'rotate-180'
          )} 
        />
      </button>
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const FiltersContent = () => (
    <div className="space-y-0">
      {/* Category Filter */}
      <FilterSection title="Category" id="category">
        <div className="space-y-2">
          {categories.map((cat) => (
            <label 
              key={cat.value} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={filters.category === cat.value}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-4 h-4 text-[#FF6B35] border-gray-300 focus:ring-[#FF6B35]"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range" id="price">
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label 
              key={index} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="priceRange"
                checked={
                  filters.priceRange[0] === range.min && 
                  filters.priceRange[1] === range.max
                }
                onChange={() => updateFilter('priceRange', [range.min, range.max])}
                className="w-4 h-4 text-[#FF6B35] border-gray-300 focus:ring-[#FF6B35]"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Duration Filter */}
      <FilterSection title="Duration" id="duration">
        <div className="space-y-2">
          {durations.map((dur) => (
            <label 
              key={dur.value} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="duration"
                value={dur.value}
                checked={filters.duration === dur.value}
                onChange={(e) => updateFilter('duration', e.target.value)}
                className="w-4 h-4 text-[#FF6B35] border-gray-300 focus:ring-[#FF6B35]"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {dur.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="Rating" id="rating">
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label 
              key={rating} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={filters.rating === rating}
                onChange={() => updateFilter('rating', rating)}
                className="w-4 h-4 text-[#FF6B35] border-gray-300 focus:ring-[#FF6B35]"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    )}
                  />
                ))}
                <span className="text-sm text-gray-700 ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Reset Button */}
      <div className="pt-4">
        <Button
          variant="outline"
          onClick={onReset}
          className="w-full"
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-[#FF6B35] text-white text-xs font-medium rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <FiltersContent />
        </div>
      </aside>

      {/* Mobile Filters Header */}
      <div className="lg:hidden sticky top-16 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search trips..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(true)}
            className="shrink-0 relative"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF6B35] text-white text-xs font-medium rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="hidden sm:block px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        {totalResults !== undefined && (
          <p className="text-sm text-gray-500 mt-2">
            {totalResults} trips found
          </p>
        )}
      </div>

      {/* Mobile Filters Panel */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                <FiltersContent />
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                <Button
                  variant="outline"
                  onClick={onReset}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
