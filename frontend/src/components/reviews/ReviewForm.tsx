'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Camera, 
  Upload, 
  X, 
  Plus, 
  MapPin, 
  Calendar,
  Users,
  ThumbsUp,
  MessageCircle,
  Flag,
  Edit,
  Trash2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';


function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ReviewFormProps {
  tripId: string;
  tripName: string;
  onSubmit: (review: ReviewData) => void;
  onCancel: () => void;
  existingReview?: ReviewData;
  className?: string;
}

interface ReviewData {
  id?: string;
  rating: number;
  title: string;
  content: string;
  photos: File[];
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
}

const aspectLabels = {
  experience: 'Overall Experience',
  value: 'Value for Money',
  guide: 'Guide Quality',
  accommodation: 'Accommodation',
  transportation: 'Transportation'
};

const travelTypes = [
  { value: 'solo', label: 'Solo Travel', icon: '🧳' },
  { value: 'couple', label: 'Couple', icon: '💕' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'friends', label: 'Friends', icon: '👥' },
  { value: 'business', label: 'Business', icon: '💼' }
];

const predefinedHighlights = [
  'Amazing scenery', 'Excellent guide', 'Great value', 'Well organized',
  'Perfect weather', 'Delicious food', 'Comfortable stay', 'Easy booking',
  'Responsive support', 'Safe experience', 'Cultural immersion', 'Adventure activities'
];

export default function ReviewForm({
  tripId,
  tripName,
  onSubmit,
  onCancel,
  existingReview,
  className
}: ReviewFormProps) {
  const [review, setReview] = useState<ReviewData>({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    content: existingReview?.content || '',
    photos: [],
    aspects: existingReview?.aspects || {
      experience: 0,
      value: 0,
      guide: 0,
      accommodation: 0,
      transportation: 0
    },
    travelDate: existingReview?.travelDate || '',
    travelType: existingReview?.travelType || 'solo',
    wouldRecommend: existingReview?.wouldRecommend ?? true,
    highlights: existingReview?.highlights || [],
    improvements: existingReview?.improvements || []
  });

  const [newHighlight, setNewHighlight] = useState('');
  const [newImprovement, setNewImprovement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'rating' | 'details' | 'photos' | 'review'>('rating');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRatingClick = (rating: number, aspect?: keyof typeof aspectLabels) => {
    if (aspect) {
      setReview(prev => ({
        ...prev,
        aspects: { ...prev.aspects, [aspect]: rating }
      }));
    } else {
      setReview(prev => ({ ...prev, rating }));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024; // 10MB limit
      if (!isValid) {
        toast.error(`${file.name} is not a valid image or exceeds 10MB limit`);
      }
      return isValid;
    });

    if (review.photos.length + validFiles.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }

    setReview(prev => ({
      ...prev,
      photos: [...prev.photos, ...validFiles]
    }));
  };

  const removePhoto = (index: number) => {
    setReview(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const addHighlight = (highlight: string) => {
    if (highlight && !review.highlights.includes(highlight)) {
      setReview(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlight]
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (index: number) => {
    setReview(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const addImprovement = () => {
    if (newImprovement && !review.improvements.includes(newImprovement)) {
      setReview(prev => ({
        ...prev,
        improvements: [...prev.improvements, newImprovement]
      }));
      setNewImprovement('');
    }
  };

  const removeImprovement = (index: number) => {
    setReview(prev => ({
      ...prev,
      improvements: prev.improvements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (review.rating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    if (!review.title.trim()) {
      toast.error('Please provide a review title');
      return;
    }

    if (!review.content.trim()) {
      toast.error('Please write your review');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(review);
      toast.success(existingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (
    rating: number, 
    onRate: (rating: number) => void, 
    size: 'sm' | 'md' | 'lg' = 'md',
    readonly: boolean = false
  ) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRate(star)}
            disabled={readonly}
            className={cn(
              "transition-colors duration-200",
              !readonly && "hover:scale-110 active:scale-95",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  const renderRatingStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Rate Your Experience
        </h3>
        <p className="text-gray-600">
          How was your trip to {tripName}?
        </p>
      </div>

      {/* Overall Rating */}
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          {renderStarRating(review.rating, (rating) => handleRatingClick(rating), 'lg')}
        </div>
        <p className="text-sm text-gray-600">
          {review.rating === 0 && "Click to rate your overall experience"}
          {review.rating === 1 && "Poor - Major issues"}
          {review.rating === 2 && "Fair - Some issues"}
          {review.rating === 3 && "Good - As expected"}
          {review.rating === 4 && "Very Good - Better than expected"}
          {review.rating === 5 && "Excellent - Exceeded expectations"}
        </p>
      </div>

      {/* Aspect Ratings */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Rate specific aspects:</h4>
        {Object.entries(aspectLabels).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{label}</span>
            {renderStarRating(
              review.aspects[key as keyof typeof aspectLabels],
              (rating) => handleRatingClick(rating, key as keyof typeof aspectLabels),
              'sm'
            )}
          </div>
        ))}
      </div>

      <Button
        onClick={() => setStep('details')}
        disabled={review.rating === 0}
        className="w-full"
      >
        Continue
      </Button>
    </motion.div>
  );

  const renderDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Trip Details
        </h3>
        <p className="text-gray-600">
          Tell us more about your trip
        </p>
      </div>

      {/* Travel Date */}
      <div className="space-y-2">
        <Label htmlFor="travelDate">Travel Date</Label>
        <input
          id="travelDate"
          type="month"
          value={review.travelDate}
          onChange={(e) => setReview(prev => ({ ...prev, travelDate: e.target.value }))}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Travel Type */}
      <div className="space-y-2">
        <Label>Travel Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {travelTypes.map((type) => (
            <Button
              key={type.value}
              type="button"
              variant={review.travelType === type.value ? "default" : "outline"}
              onClick={() => setReview(prev => ({ ...prev, travelType: type.value as any }))}
              className="flex items-center space-x-2 h-auto py-3"
            >
              <span>{type.icon}</span>
              <span className="text-sm">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Would Recommend */}
      <div className="space-y-2">
        <Label>Would you recommend this trip?</Label>
        <div className="flex space-x-3">
          <Button
            type="button"
            variant={review.wouldRecommend ? "default" : "outline"}
            onClick={() => setReview(prev => ({ ...prev, wouldRecommend: true }))}
            className="flex-1"
          >
            👍 Yes
          </Button>
          <Button
            type="button"
            variant={!review.wouldRecommend ? "default" : "outline"}
            onClick={() => setReview(prev => ({ ...prev, wouldRecommend: false }))}
            className="flex-1"
          >
            👎 No
          </Button>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep('rating')} className="flex-1">
          Back
        </Button>
        <Button onClick={() => setStep('photos')} className="flex-1">
          Continue
        </Button>
      </div>
    </motion.div>
  );

  const renderPhotosStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Add Photos
        </h3>
        <p className="text-gray-600">
          Share your memories (optional, max 10 photos)
        </p>
      </div>

      {/* Photo Upload Area */}
      <div className="space-y-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Click to upload photos or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            JPG, PNG up to 10MB each
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        {/* Photo Preview Grid */}
        {review.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {review.photos.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
          Back
        </Button>
        <Button onClick={() => setStep('review')} className="flex-1">
          Continue
        </Button>
      </div>
    </motion.div>
  );

  const renderReviewStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Write Your Review
        </h3>
        <p className="text-gray-600">
          Share your experience with other travelers
        </p>
      </div>

      {/* Review Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Review Title *</Label>
        <input
          id="title"
          type="text"
          placeholder="Summarize your experience..."
          value={review.title}
          onChange={(e) => setReview(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-3 border rounded-lg"
          maxLength={100}
        />
        <p className="text-xs text-gray-500">{review.title.length}/100 characters</p>
      </div>

      {/* Review Content */}
      <div className="space-y-2">
        <Label htmlFor="content">Your Review *</Label>
        <Textarea
          id="content"
          placeholder="Tell other travelers about your experience..."
          value={review.content}
          onChange={(e) => setReview(prev => ({ ...prev, content: e.target.value }))}
          className="min-h-32"
          maxLength={2000}
        />
        <p className="text-xs text-gray-500">{review.content.length}/2000 characters</p>
      </div>

      {/* Highlights */}
      <div className="space-y-3">
        <Label>What did you love? (optional)</Label>
        <div className="flex flex-wrap gap-2">
          {predefinedHighlights.map((highlight) => (
            <button
              key={highlight}
              className={cn(
                "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors",
                review.highlights.includes(highlight) 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
              )}
              onClick={() => {
                if (review.highlights.includes(highlight)) {
                  removeHighlight(review.highlights.indexOf(highlight));
                } else {
                  addHighlight(highlight);
                }
              }}
            >
              {highlight}
            </button>
          ))}
        </div>
        
        {/* Custom highlight input */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Add your own highlight..."
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHighlight(newHighlight)}
            className="flex-1 p-2 border rounded text-sm"
          />
          <Button size="sm" onClick={() => addHighlight(newHighlight)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {review.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {review.highlights.map((highlight, index) => (
              <Badge key={index} variant="secondary" className="pr-1">
                {highlight}
                <button
                  onClick={() => removeHighlight(index)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Improvements */}
      <div className="space-y-3">
        <Label>Areas for improvement (optional)</Label>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="What could be better..."
            value={newImprovement}
            onChange={(e) => setNewImprovement(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addImprovement()}
            className="flex-1 p-2 border rounded text-sm"
          />
          <Button size="sm" onClick={addImprovement}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {review.improvements.length > 0 && (
          <div className="space-y-1">
            {review.improvements.map((improvement, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{improvement}</span>
                <button
                  onClick={() => removeImprovement(index)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setStep('photos')} className="flex-1">
          Back
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || !review.title.trim() || !review.content.trim()}
          className="flex-1"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2"
              >
                <Check className="w-4 h-4" />
              </motion.div>
              Submitting...
            </>
          ) : (
            existingReview ? 'Update Review' : 'Submit Review'
          )}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className={cn("bg-white rounded-xl shadow-lg p-6", className)}>
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['rating', 'details', 'photos', 'review'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                step === stepName || ['rating', 'details', 'photos', 'review'].indexOf(step) > index
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {index + 1}
            </div>
            {index < 3 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-2",
                  ['rating', 'details', 'photos', 'review'].indexOf(step) > index
                    ? "bg-blue-600"
                    : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {step === 'rating' && renderRatingStep()}
        {step === 'details' && renderDetailsStep()}
        {step === 'photos' && renderPhotosStep()}
        {step === 'review' && renderReviewStep()}
      </AnimatePresence>
    </div>
  );
}