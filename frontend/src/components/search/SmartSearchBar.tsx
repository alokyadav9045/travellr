'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  SlidersHorizontal,
  Compass,
  TrendingUp,
  Clock,
  Star,
  Filter as FilterIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface QuickFilter {
  id: string;
  label: string;
  value: any;
  type: 'category' | 'price' | 'duration' | 'rating' | 'special';
  icon?: React.ReactNode;
}

interface SmartSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  activeFilters: any;
  onFilterChange: (filter: any) => void;
  onAdvancedFiltersOpen: () => void;
  suggestions?: string[];
  className?: string;
}

const quickFilters: QuickFilter[] = [
  {
    id: 'weekend',
    label: 'Weekend Trips',
    value: { duration: [1, 3] },
    type: 'duration',
    icon: <Clock className="w-3 h-3" />
  },
  {
    id: 'budget',
    label: 'Budget Friendly',
    value: { priceRange: [0, 3000] },
    type: 'price',
    icon: <TrendingUp className="w-3 h-3" />
  },
  {
    id: 'adventure',
    label: 'Adventure',
    value: { category: ['adventure'] },
    type: 'category',
    icon: <Compass className="w-3 h-3" />
  },
  {
    id: 'highly_rated',
    label: 'Top Rated',
    value: { rating: 4 },
    type: 'rating',
    icon: <Star className="w-3 h-3" />
  },
  {
    id: 'instant_book',
    label: 'Instant Book',
    value: { instantBook: true },
    type: 'special',
  },
  {
    id: 'group_friendly',
    label: 'Group Trips',
    value: { groupSize: [4, 20] },
    type: 'special',
    icon: <Users className="w-3 h-3" />
  }
];

const popularDestinations = [
  'Manali', 'Goa', 'Kerala', 'Rajasthan', 'Ladakh', 'Rishikesh',
  'Himachal Pradesh', 'Uttarakhand', 'Kashmir', 'Andaman'
];

const recentSearches = [
  'Adventure trips in Manali',
  'Beach resorts in Goa',
  'Trekking in Ladakh',
  'Wildlife safari Kerala'
];

export default function SmartSearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  activeFilters,
  onFilterChange,
  onAdvancedFiltersOpen,
  suggestions = [],
  className
}: SmartSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeFilters.location) count++;
    if (activeFilters.category?.length) count++;
    if (activeFilters.priceRange?.[0] !== 0 || activeFilters.priceRange?.[1] !== 10000) count++;
    if (activeFilters.rating && activeFilters.rating > 0) count++;
    if (activeFilters.amenities?.length) count++;
    if (activeFilters.activityType?.length) count++;
    if (activeFilters.difficulty) count++;
    if (activeFilters.startDate || activeFilters.endDate) count++;
    return count;
  }, [activeFilters]);

  const handleQuickFilter = (filter: QuickFilter) => {
    onFilterChange({ ...activeFilters, ...filter.value });
  };

  const isQuickFilterActive = (filter: QuickFilter) => {
    switch (filter.type) {
      case 'category':
        return activeFilters.category?.includes(filter.value.category[0]);
      case 'price':
        return activeFilters.priceRange?.[0] === filter.value.priceRange[0] &&
          activeFilters.priceRange?.[1] === filter.value.priceRange[1];
      case 'duration':
        return activeFilters.duration?.[0] === filter.value.duration[0] &&
          activeFilters.duration?.[1] === filter.value.duration[1];
      case 'rating':
        return activeFilters.rating === filter.value.rating;
      case 'special':
        if (filter.value.instantBook) return activeFilters.instantBook;
        if (filter.value.groupSize) {
          return activeFilters.groupSize?.[0] === filter.value.groupSize[0] &&
            activeFilters.groupSize?.[1] === filter.value.groupSize[1];
        }
        return false;
      default:
        return false;
    }
  };

  const combinedSuggestions = useMemo(() => {
    if (!searchQuery) return [...popularDestinations, ...recentSearches];

    const filtered = [...popularDestinations, ...recentSearches, ...suggestions]
      .filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 8);

    return filtered;
  }, [searchQuery, suggestions]);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Main Search Bar */}
      <div className="relative">
        <div className={cn(
          "flex items-center space-x-3 p-4 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-200",
          isFocused && "shadow-xl ring-2 ring-blue-500/20 border-blue-300"
        )}>
          {/* Search Input */}
          <div className="flex-1 flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Where do you want to go?"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearch();
                  setShowSuggestions(false);
                }
              }}
              className="border-0 bg-transparent focus:outline-none focus:ring-0 text-lg placeholder-gray-500"
            />
          </div>

          {/* Filters Button */}
          <Button
            variant="outline"
            onClick={onAdvancedFiltersOpen}
            className="flex items-center space-x-2 relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Search Button */}
          <Button onClick={onSearch} size="lg">
            Search
          </Button>
        </div>

        {/* Search Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (isFocused || combinedSuggestions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-64 overflow-y-auto z-50"
            >
              {!searchQuery && (
                <>
                  <div className="p-3 border-b border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Destinations</h4>
                    <div className="flex flex-wrap gap-1">
                      {popularDestinations.slice(0, 6).map((destination) => (
                        <button
                          key={destination}
                          className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 cursor-pointer hover:bg-blue-100 transition-colors"
                          onClick={() => {
                            onSearchChange(destination);
                            setShowSuggestions(false);
                          }}
                        >
                          <MapPin className="w-3 h-3 mr-1" />
                          {destination}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => {
                            onSearchChange(search);
                            setShowSuggestions(false);
                          }}
                        >
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{search}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {searchQuery && combinedSuggestions.length > 0 && (
                <div className="p-2">
                  {combinedSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => {
                        onSearchChange(suggestion);
                        setShowSuggestions(false);
                        onSearch();
                      }}
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter) => (
          <Button
            key={filter.id}
            variant={isQuickFilterActive(filter) ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickFilter(filter)}
            className="flex items-center space-x-1 h-8"
          >
            {filter.icon}
            <span className="text-xs">{filter.label}</span>
          </Button>
        ))}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2 items-center"
        >
          <span className="text-sm text-gray-600">Active filters:</span>
          {activeFilters.location && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{activeFilters.location}</span>
            </Badge>
          )}
          {activeFilters.category?.map((cat: string) => (
            <Badge key={cat} variant="secondary" className="capitalize">
              {cat}
            </Badge>
          ))}
          {(activeFilters.priceRange?.[0] !== 0 || activeFilters.priceRange?.[1] !== 10000) && (
            <Badge variant="secondary">
              ₹{activeFilters.priceRange?.[0]} - ₹{activeFilters.priceRange?.[1]}
            </Badge>
          )}
          {activeFilters.rating && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>{activeFilters.rating}+ rating</span>
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  );
}