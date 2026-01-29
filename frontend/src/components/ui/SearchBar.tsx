'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Calendar, Users, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '@/lib/utils/formatters';

interface SearchSuggestion {
  _id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  image?: string;
}

interface Props {
  defaultValue?: string;
  defaultLocation?: string;
  defaultCategory?: string;
  onSearch?: (params: any) => void;
  variant?: 'hero' | 'navbar';
}

export default function SearchBar({
  defaultValue = '',
  defaultLocation = '',
  defaultCategory = '',
  onSearch,
  variant = 'hero'
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [location, setLocation] = useState(defaultLocation);
  const [category, setCategory] = useState(defaultCategory);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.length >= 2) {
      // Debounce API call
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        fetchSuggestions();
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ query });
      if (location) params.append('location', location);
      if (category) params.append('category', category);

      const response = await fetch(`/api/search/suggestions?${params}`);
      const data = await response.json();

      if (data.success) {
        setSuggestions(data.data.suggestions || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();

    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    if (category) params.append('category', category);

    if (onSearch) {
      onSearch({ query, location, category });
    } else {
      router.push(`/trips?${params.toString()}`);
    }

    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    router.push(`/trips/${suggestion._id}`);
  };

  const isHero = variant === 'hero';

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSearch}>
        <div className={`
          flex items-center gap-2 bg-white rounded-xl shadow-lg overflow-hidden
          ${isHero ? 'p-4 md:p-6' : 'p-2 md:p-3'}
        `}>
          {/* Main Search Input */}
          <div className="flex-1 flex items-center gap-3 border-r pr-4">
            <Search className={`text-gray-400 ${isHero ? 'w-6 h-6' : 'w-5 h-5'}`} />
            <div className="flex-1">
              <label htmlFor={`searchQuery-${variant}`} className="text-xs text-gray-500 font-medium hidden md:block cursor-pointer">
                What are you looking for?
              </label>
              <input
                id={`searchQuery-${variant}`}
                name="q"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search destinations, adventures..."
                className={`
                  w-full outline-none text-gray-800 placeholder-gray-400
                  ${isHero ? 'text-lg' : 'text-sm'}
                `}
              />
            </div>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Filter */}
          {isHero && (
            <div className="hidden md:flex items-center gap-3 border-r pr-4">
              <MapPin className="w-6 h-6 text-gray-400" />
              <div className="flex-1">
                <label htmlFor={`location-${variant}`} className="text-xs text-gray-500 font-medium cursor-pointer">Location</label>
                <input
                  id={`location-${variant}`}
                  name="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where to?"
                  className="w-full outline-none text-gray-800 placeholder-gray-400 text-lg"
                />
              </div>
            </div>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              bg-gradient-to-r from-blue-600 to-purple-600 text-white
              rounded-lg font-semibold hover:shadow-xl transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
              ${isHero ? 'px-8 py-4' : 'px-4 py-2 md:px-6 md:py-3'}
            `}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className={isHero ? 'w-5 h-5' : 'w-4 h-4'} />
                <span className={isHero ? 'text-lg' : 'text-sm'}>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion._id}
                onClick={() => selectSuggestion(suggestion)}
                className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center gap-4 border-b last:border-b-0"
              >
                {suggestion.image && (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={suggestion.image}
                      alt={suggestion.title}
                      fill
                      className="object-cover rounded-lg"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {suggestion.location}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {suggestion.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{formatCurrency(suggestion.price)}</p>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
