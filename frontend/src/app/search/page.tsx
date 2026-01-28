'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Calendar, Users, Star, X, SlidersHorizontal, Compass } from 'lucide-react';
import { RootState, AppDispatch } from '@/store';
import { fetchTrips, setFilters, searchTrips, setPage } from '@/store/slices/tripsSlice';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TripCard from '@/components/trips/TripCard';
import FilterSidebar from '@/components/trips/FilterSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SearchPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    trips,
    searchResults,
    filters,
    pagination,
    loading,
    error
  } = useSelector((state: RootState) => state.trips);

  const displayTrips = searchQuery ? searchResults : trips;
  const isLoading = loading.trips || loading.search;

  useEffect(() => {
    // Initialize from URL params
    const query = searchParams.get('q');
    const location = searchParams.get('location');
    const category = searchParams.get('category');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const rating = searchParams.get('rating');
    const page = searchParams.get('page');

    if (query) {
      setSearchQuery(query);
      dispatch(searchTrips(query));
    }

    if (location || category || priceMin || priceMax || rating) {
      dispatch(setFilters({
        location: location || '',
        category: category || '',
        minPrice: priceMin ? parseInt(priceMin) : 0,
        maxPrice: priceMax ? parseInt(priceMax) : 100000,
        minRating: rating ? parseInt(rating) : 0
      }));
    }

    if (page) {
      dispatch(setPage(parseInt(page)));
    }

    // Fetch trips with filters
    dispatch(fetchTrips({
      ...filters,
      page: page ? parseInt(page) : 1
    }));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchTrips(searchQuery));
      // Update URL
      const params = new URLSearchParams(searchParams);
      params.set('q', searchQuery);
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchTrips({ ...newFilters, page: 1 }));
    
    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.minPrice && newFilters.minPrice > 0) params.set('priceMin', newFilters.minPrice.toString());
    if (newFilters.maxPrice && newFilters.maxPrice < 100000) params.set('priceMax', newFilters.maxPrice.toString());
    if (newFilters.minRating && newFilters.minRating > 0) params.set('rating', newFilters.minRating.toString());
    
    router.push(`/search?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    dispatch(fetchTrips({ ...filters, page }));
    
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-32 pb-12">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B35]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00B894]/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Search Trips
            </h1>
            <p className="text-white/70 mb-8">
              Find your perfect adventure from hundreds of amazing trips
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search destinations, activities, or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 pr-32 py-4 h-14 w-full rounded-2xl border-0 shadow-xl text-base focus:ring-2 focus:ring-[#FF6B35]"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:shadow-lg hover:shadow-[#FF6B35]/25 rounded-xl px-6"
                >
                  Search
                </Button>
              </div>
            </form>
          </motion.div>
          
          {/* Quick Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {['Adventure', 'Cultural', 'Relaxation', 'Wildlife', 'Beach'].map((category) => (
              <button
                key={category}
                onClick={() => handleFilterChange({ ...filters, category })}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.category === category
                    ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/25'
                    : 'bg-white/10 text-white/90 hover:bg-white/20 border border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
          
          {/* Search Stats */}
          {!isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center text-white/70 text-sm"
            >
              {searchQuery ? (
                <span>
                  {searchResults.length} results found for "<span className="text-white font-medium">{searchQuery}</span>"
                </span>
              ) : (
                <span>
                  {pagination.total} trips available
                  {filters.location && <span> in <span className="text-white font-medium">{filters.location}</span></span>}
                  {filters.category && <span> • <span className="text-white font-medium">{filters.category}</span></span>}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={[
                  {
                    id: 'category',
                    title: 'Category',
                    type: 'checkbox',
                    options: [
                      { value: 'adventure', label: 'Adventure', count: 24 },
                      { value: 'cultural', label: 'Cultural', count: 18 },
                      { value: 'beach', label: 'Beach', count: 15 },
                      { value: 'wellness', label: 'Wellness', count: 12 }
                    ]
                  },
                  {
                    id: 'priceRange',
                    title: 'Price Range',
                    type: 'range',
                    range: { min: 0, max: 100000, step: 5000 }
                  },
                  {
                    id: 'rating',
                    title: 'Rating',
                    type: 'radio',
                    options: [
                      { value: '4.5', label: '4.5+ Stars', count: 45 },
                      { value: '4', label: '4+ Stars', count: 72 },
                      { value: '3.5', label: '3.5+ Stars', count: 89 }
                    ]
                  }
                ]}
                activeFilters={{
                  category: filters?.category ? [filters.category] : [],
                  priceRange: [filters?.minPrice || 0, filters?.maxPrice || 100000],
                  rating: filters?.minRating?.toString() || ''
                }}
                onFilterChange={(filterId: string, value: any) => {
                  if (filterId === 'category') {
                    dispatch(setFilters({ ...filters, category: value[0] || '' }));
                  } else if (filterId === 'priceRange') {
                    dispatch(setFilters({ ...filters, minPrice: value[0], maxPrice: value[1] }));
                  } else if (filterId === 'rating') {
                    dispatch(setFilters({ ...filters, minRating: value ? parseInt(value) : 0 }));
                  }
                }}
                onClearFilters={() => {
                  dispatch(setFilters({ location: '', category: '', minPrice: 0, maxPrice: 100000 }));
                }}
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 shadow-xl rounded-full px-6 bg-white border-gray-200"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filters
          </Button>

          {/* Mobile Filter Modal */}
          {isFilterOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween' }}
                className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFilterOpen(false)}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <FilterSidebar
                  filters={[
                    {
                      id: 'category',
                      title: 'Category',
                      type: 'checkbox',
                      options: [
                        { value: 'adventure', label: 'Adventure', count: 24 },
                        { value: 'cultural', label: 'Cultural', count: 18 },
                        { value: 'beach', label: 'Beach', count: 15 },
                        { value: 'wellness', label: 'Wellness', count: 12 }
                      ]
                    },
                    {
                      id: 'priceRange',
                      title: 'Price Range',
                      type: 'range',
                      range: { min: 0, max: 100000, step: 5000 }
                    },
                    {
                      id: 'rating',
                      title: 'Rating',
                      type: 'radio',
                      options: [
                        { value: '4.5', label: '4.5+ Stars', count: 45 },
                        { value: '4', label: '4+ Stars', count: 72 },
                        { value: '3.5', label: '3.5+ Stars', count: 89 }
                      ]
                    }
                  ]}
                  activeFilters={{
                    category: filters?.category ? [filters.category] : [],
                    priceRange: [filters?.minPrice || 0, filters?.maxPrice || 100000],
                    rating: filters?.minRating?.toString() || ''
                  }}
                  onFilterChange={(filterId: string, value: any) => {
                    if (filterId === 'category') {
                      dispatch(setFilters({ ...filters, category: value[0] || '' }));
                    } else if (filterId === 'priceRange') {
                      dispatch(setFilters({ ...filters, minPrice: value[0], maxPrice: value[1] }));
                    } else if (filterId === 'rating') {
                      dispatch(setFilters({ ...filters, minRating: value ? parseInt(value) : 0 }));
                    }
                    setIsFilterOpen(false);
                  }}
                  onClearFilters={() => {
                    dispatch(setFilters({ location: '', category: '', minPrice: 0, maxPrice: 100000 }));
                  }}
                  isOpen={isFilterOpen}
                  onClose={() => setIsFilterOpen(false)}
                />
              </motion.div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-gray-500">Searching for trips...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onClick={() => dispatch(fetchTrips(filters))}
                  className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B]"
                >
                  Try Again
                </Button>
              </div>
            ) : displayTrips.length > 0 ? (
              <>
                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {displayTrips.map((trip, index) => (
                    <motion.div
                      key={trip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TripCard trip={trip} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {!searchQuery && pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    showFirstLast={true}
                    showPrevNext={true}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Compass className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No trips found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try adjusting your search or filters.`
                    : 'No trips match your current filters. Try adjusting your criteria.'}
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    dispatch(setFilters({
                      category: '',
                      location: '',
                      minPrice: 0,
                      maxPrice: 100000,
                      duration: 0,
                      minRating: 0
                    }));
                    dispatch(fetchTrips({}));
                    router.push('/search');
                  }}
                  className="rounded-xl hover:bg-[#FF6B35]/5 hover:border-[#FF6B35] hover:text-[#FF6B35]"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}