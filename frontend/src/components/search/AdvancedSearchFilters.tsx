'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  DollarSign,
  Clock,
  Tag,
  Mountain,
  Waves,
  TreePine,
  Building2,
  Car,
  Plane,
  Ship
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SearchFilters {
  location?: string;
  category?: string[];
  priceRange?: [number, number];
  duration?: [number, number];
  rating?: number;
  amenities?: string[];
  activityType?: string[];
  difficulty?: string;
  groupSize?: [number, number];
  startDate?: string;
  endDate?: string;
  sortBy?: string;
}

interface AdvancedSearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const categoryIcons = {
  'adventure': Mountain,
  'beach': Waves,
  'nature': TreePine,
  'city': Building2,
  'culture': Building2,
  'wildlife': TreePine,
  'spiritual': Building2,
  'luxury': Star
};

const amenitiesOptions = [
  'WiFi',
  'Breakfast Included',
  'Transportation',
  'Guide Included',
  'Photography',
  'Equipment Rental',
  'Insurance',
  'Meals',
  'Accommodation',
  'Airport Pickup'
];

const activityTypes = [
  'Trekking',
  'Sightseeing',
  'Adventure Sports',
  'Cultural Tours',
  'Photography',
  'Wildlife Safari',
  'Water Sports',
  'Camping',
  'City Tours',
  'Food Tours'
];

const difficultyLevels = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-800' },
  { value: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'challenging', label: 'Challenging', color: 'bg-orange-100 text-orange-800' },
  { value: 'extreme', label: 'Extreme', color: 'bg-red-100 text-red-800' }
];

const sortOptions = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'duration', label: 'Shortest Duration' },
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' }
];

export default function AdvancedSearchFilters({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters
}: AdvancedSearchFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.location) count++;
    if (localFilters.category?.length) count++;
    if (localFilters.priceRange?.[0] !== 0 || localFilters.priceRange?.[1] !== 10000) count++;
    if (localFilters.rating && localFilters.rating > 0) count++;
    if (localFilters.amenities?.length) count++;
    if (localFilters.activityType?.length) count++;
    if (localFilters.difficulty) count++;
    if (localFilters.startDate || localFilters.endDate) count++;
    return count;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Filters</h2>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-4 space-y-6">
              {/* Location */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </Label>
                <Input
                  placeholder="Search destination..."
                  value={localFilters.location || ''}
                  onChange={(e) => updateFilter('location', e.target.value)}
                />
              </div>

              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Price Range (₹)
                </Label>
                <div className="space-y-3">
                  <Slider
                    value={localFilters.priceRange || [0, 10000]}
                    onValueChange={(value: number[]) => updateFilter('priceRange', value)}
                    max={10000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{localFilters.priceRange?.[0] || 0}</span>
                    <span>₹{localFilters.priceRange?.[1] || 10000}+</span>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Duration (Days)
                </Label>
                <div className="space-y-3">
                  <Slider
                    value={localFilters.duration || [1, 15]}
                    onValueChange={(value: number[]) => updateFilter('duration', value)}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{localFilters.duration?.[0] || 1} day</span>
                    <span>{localFilters.duration?.[1] || 15} days</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Minimum Rating
                </Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant={localFilters.rating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter('rating', rating)}
                      className="flex items-center space-x-1"
                    >
                      <Star className={cn(
                        "w-3 h-3",
                        localFilters.rating === rating ? "fill-current" : ""
                      )} />
                      <span>{rating}+</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Categories
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(categoryIcons).map(([category, Icon]) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={localFilters.category?.includes(category)}
                        onCheckedChange={(checked: boolean) => {
                          const currentCategories = localFilters.category || [];
                          if (checked) {
                            updateFilter('category', [...currentCategories, category]);
                          } else {
                            updateFilter('category', currentCategories.filter(c => c !== category));
                          }
                        }}
                      />
                      <Label htmlFor={category} className="flex items-center space-x-1 cursor-pointer">
                        <Icon className="w-3 h-3" />
                        <span className="text-sm capitalize">{category}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Types */}
              <div>
                <Label className="text-sm font-medium mb-3">Activity Types</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {activityTypes.map((activity) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox
                        id={activity}
                        checked={localFilters.activityType?.includes(activity)}
                        onCheckedChange={(checked: boolean) => {
                          const currentTypes = localFilters.activityType || [];
                          if (checked) {
                            updateFilter('activityType', [...currentTypes, activity]);
                          } else {
                            updateFilter('activityType', currentTypes.filter(t => t !== activity));
                          }
                        }}
                      />
                      <Label htmlFor={activity} className="text-sm cursor-pointer">{activity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <Label className="text-sm font-medium mb-3">Difficulty Level</Label>
                <RadioGroup
                  value={localFilters.difficulty || ''}
                  onValueChange={(value: string) => updateFilter('difficulty', value)}
                >
                  {difficultyLevels.map((level) => (
                    <div key={level.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={level.value} id={level.value} />
                      <Label htmlFor={level.value} className="cursor-pointer">
                        <Badge className={level.color}>{level.label}</Badge>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Amenities */}
              <div>
                <Label className="text-sm font-medium mb-3">Amenities</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {amenitiesOptions.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={localFilters.amenities?.includes(amenity)}
                        onCheckedChange={(checked: boolean) => {
                          const currentAmenities = localFilters.amenities || [];
                          if (checked) {
                            updateFilter('amenities', [...currentAmenities, amenity]);
                          } else {
                            updateFilter('amenities', currentAmenities.filter(a => a !== amenity));
                          }
                        }}
                      />
                      <Label htmlFor={amenity} className="text-sm cursor-pointer">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <Label className="text-sm font-medium mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Travel Dates
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startDate" className="text-xs text-gray-500">From</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={localFilters.startDate || ''}
                      onChange={(e) => updateFilter('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-xs text-gray-500">To</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={localFilters.endDate || ''}
                      onChange={(e) => updateFilter('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div>
                <Label className="text-sm font-medium mb-3">Sort By</Label>
                <RadioGroup
                  value={localFilters.sortBy || 'relevance'}
                  onValueChange={(value: string) => updateFilter('sortBy', value)}
                >
                  {sortOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="text-sm cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1"
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}