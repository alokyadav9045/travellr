'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { tripApi } from '@/lib/api/trips';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MapPin, Star, Clock, Filter, Search, ChevronDown, Heart, SlidersHorizontal, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet';
import { Badge } from '@/components/ui/badge';
import { Trip } from '@/types';

// Trip categories for filtering
const categories = [
  { name: 'All', slug: 'all' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Beach', slug: 'beach' },
  { name: 'Cultural', slug: 'cultural' },
  { name: 'Trekking', slug: 'trekking' },
  { name: 'Wildlife', slug: 'wildlife' },
  { name: 'Romantic', slug: 'romantic' },
  { name: 'Wellness', slug: 'wellness' },
];

const durations = [
  { label: '1-3 Days', min: 1, max: 3 },
  { label: '4-7 Days', min: 4, max: 7 },
  { label: '8-14 Days', min: 8, max: 14 },
  { label: '15+ Days', min: 15, max: 30 },
];

// Gradient colors for trip cards
const gradients = [
  'from-orange-500 to-red-600',
  'from-blue-400 to-cyan-500',
  'from-purple-500 to-indigo-600',
  'from-green-500 to-emerald-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-yellow-600',
];

export default function TripsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Params
  const queryQ = searchParams.get('q') || '';
  const queryCategory = searchParams.get('category') || 'all';
  const queryMinPrice = searchParams.get('minPrice');
  const queryMaxPrice = searchParams.get('maxPrice');
  const queryMinDuration = searchParams.get('minDuration');
  const queryMaxDuration = searchParams.get('maxDuration');
  const querySort = searchParams.get('sort') || 'newest';

  // Local State
  const [searchQuery, setSearchQuery] = useState(queryQ);
  const [priceRange, setPriceRange] = useState([
    queryMinPrice ? parseInt(queryMinPrice) : 0,
    queryMaxPrice ? parseInt(queryMaxPrice) : 50000
  ]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(querySort);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state with URL
  useEffect(() => {
    setSearchQuery(queryQ);
  }, [queryQ]);

  const updateFilters = (newParams: any) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    // Reset page on filter change
    params.set('page', '1');
    router.push(`/trips?${params.toString()}`);
  };

  const handleSearch = () => {
    updateFilters({ q: searchQuery });
  };

  const clearFilters = () => {
    router.push('/trips');
    setPriceRange([0, 50000]);
    setSelectedDurations([]);
    setSearchQuery('');
  };

  // Queries
  const { data, isLoading, error } = useQuery({
    queryKey: ['trips', queryCategory, queryQ, queryMinPrice, queryMaxPrice, queryMinDuration, queryMaxDuration, querySort],
    queryFn: () => tripApi.getTrips({
      page: 1,
      limit: 12,
      category: queryCategory === 'all' ? undefined : queryCategory,
      q: queryQ || undefined,
      minPrice: queryMinPrice || undefined,
      maxPrice: queryMaxPrice || undefined,
      minDuration: queryMinDuration || undefined,
      maxDuration: queryMaxDuration || undefined,
      sortBy: querySort || undefined,
    }),
  });

  const trips = (data as any)?.data || [];
  const totalTrips = (data as any)?.pagination?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />

      {/* Search Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 pt-24 pb-8 sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {queryCategory !== 'all' ? `${queryCategory.charAt(0).toUpperCase() + queryCategory.slice(1)} Trips` : 'All Trips'}
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">({totalTrips} results)</span>
            </h1>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] transition-colors"
                />
              </div>

              <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[540px] overflow-y-auto dark:bg-gray-900 dark:border-gray-800">
                  <SheetHeader>
                    <SheetTitle className="dark:text-white">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    {/* Reusing FilterContent logic here would be ideal, referencing simplified version */}
                    <div className="space-y-6">
                      {/* Mobile Categories */}
                      <div>
                        <h3 className="font-semibold mb-3 dark:text-white">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => (
                            <button
                              key={cat.slug}
                              onClick={() => {
                                updateFilters({ category: cat.slug });
                                setIsMobileFiltersOpen(false);
                              }}
                              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${queryCategory === cat.slug
                                ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mobile Price */}
                      <div>
                        <h3 className="font-semibold mb-3 dark:text-white">Price Range</h3>
                        <Slider
                          defaultValue={[0, 50000]}
                          value={priceRange}
                          min={0}
                          max={50000}
                          step={1000}
                          onValueChange={(val) => setPriceRange(val)}
                          onValueCommit={(val) => updateFilters({ minPrice: val[0], maxPrice: val[1] })}
                          className="my-6"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>₹{priceRange[0].toLocaleString()}</span>
                          <span>₹{priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    updateFilters({ sort: e.target.value });
                  }}
                  className="border-none bg-transparent font-medium text-gray-900 dark:text-gray-100 focus:ring-0 cursor-pointer dark:bg-gray-900"
                >
                  <option value="newest" className="dark:bg-gray-800">Newest</option>
                  <option value="price-asc" className="dark:bg-gray-800">Price: Low to High</option>
                  <option value="price-desc" className="dark:bg-gray-800">Price: High to Low</option>
                  <option value="rating" className="dark:bg-gray-800">Top Rated</option>
                  <option value="popular" className="dark:bg-gray-800">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Categories</h3>
                {queryCategory !== 'all' && (
                  <button
                    onClick={() => updateFilters({ category: 'all' })}
                    className="text-xs text-[#FF6B35] hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => updateFilters({ category: cat.slug })}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${queryCategory === cat.slug
                      ? 'bg-[#FF6B35]/10 dark:bg-[#FF6B35]/20 text-[#FF6B35] font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <span>{cat.name}</span>
                    {queryCategory === cat.slug && <CheckIcon className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Price Range</h3>
              </div>
              <Slider
                defaultValue={[0, 50000]}
                value={priceRange}
                min={0}
                max={50000}
                step={1000}
                onValueChange={(val) => setPriceRange(val)}
                onValueCommit={(val) => updateFilters({ minPrice: val[0], maxPrice: val[1] })}
                className="my-6"
              />
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Duration</h3>
              <div className="space-y-3">
                {durations.map((duration) => (
                  <div key={duration.label} className="flex items-center gap-2">
                    <Checkbox
                      id={duration.label}
                      checked={
                        queryMinDuration === String(duration.min) &&
                        queryMaxDuration === String(duration.max)
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateFilters({ minDuration: duration.min, maxDuration: duration.max });
                        } else {
                          updateFilters({ minDuration: null, maxDuration: null });
                        }
                      }}
                      className="dark:border-gray-600 dark:data-[state=checked]:bg-[#FF6B35] dark:data-[state=checked]:border-[#FF6B35]"
                    />
                    <label
                      htmlFor={duration.label}
                      className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none"
                    >
                      {duration.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {(queryMinPrice || queryMinDuration || queryCategory !== 'all' || queryQ) && (
              <Button
                variant="outline"
                className="w-full dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            )}
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap gap-2">
              {/* Active Filters Badges */}
              {queryQ && (
                <Badge variant="secondary" className="flex items-center gap-1 dark:bg-gray-800 dark:text-white">
                  Search: {queryQ}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ q: '' })} />
                </Badge>
              )}
              {queryMinPrice && (
                <Badge variant="secondary" className="flex items-center gap-1 dark:bg-gray-800 dark:text-white">
                  Price: ₹{queryMinPrice} - ₹{queryMaxPrice}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilters({ minPrice: null, maxPrice: null })} />
                </Badge>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm animate-pulse h-[350px]">
                    <div className="h-48 bg-gray-200 dark:bg-gray-800" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : trips.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No trips found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline" className="dark:border-gray-700 dark:text-gray-300">Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {trips.map((trip: Trip, index: number) => (
                    <motion.div
                      key={trip._id || trip.id || index}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TripCard trip={trip} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination Logic (Simplified) */}
            {trips.length > 0 && <div className="mt-12 flex justify-center"><p className="text-sm text-gray-500 dark:text-gray-400">Showing {trips.length} of {totalTrips}</p></div>}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Subcomponents
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function TripCard({ trip, index }: { trip: Trip; index: number }) {
  // Reusing the trip card styles
  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-gray-900/20 transition-all duration-300 h-full flex flex-col border border-transparent dark:border-gray-800">
      <div className={`relative h-52 bg-gradient-to-br ${gradients[index % gradients.length]}`}>
        {trip.images && trip.images[0] ? (
          <Image
            src={trip.images[0].url}
            alt={trip.title}
            fill
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
        )}

        <Link href={`/trips/${trip.slug || trip.id}`} className="absolute inset-0" />

        <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 dark:bg-gray-900/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-900 z-10">
          <Heart className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500" />
        </button>

        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {trip.duration?.days}D / {trip.duration?.nights}N
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <MapPin className="h-4 w-4 text-[#FF6B35]" />
          <span>{typeof trip.location === 'object' ? `${trip.location.city}${trip.location.country ? `, ${trip.location.country}` : ''}` : trip.location}</span>
        </div>

        <Link href={`/trips/${trip.slug || trip.id}`} className="block mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#FF6B35] dark:group-hover:text-[#FF6B35] transition-colors line-clamp-2">
            {trip.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col">
            <span className="text-sm text-gray-400">From</span>
            <span className="text-xl font-bold text-[#FF6B35]">
              ₹{typeof trip.price === 'object' ? trip.price.amount.toLocaleString() : (trip.price as number)?.toLocaleString()}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-sm text-gray-900 dark:text-white">{trip.stats?.rating?.toFixed(1) || 'NEW'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
