'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface WishlistButtonProps {
  tripId: string;
  initialState?: boolean;
  onToggle?: (inWishlist: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
}

export default function WishlistButton({
  tripId,
  initialState = false,
  onToggle,
  size = 'md',
  variant = 'icon',
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check wishlist status on mount
    checkWishlistStatus();
  }, [tripId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`/api/wishlist/check/${tripId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setInWishlist(data.data.inWishlist);
      }
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    try {
      setLoading(true);
      setIsAnimating(true);

      const response = await fetch(`/api/wishlist/${tripId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setInWishlist(data.data.added);
        onToggle?.(data.data.added);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  if (variant === 'button') {
    return (
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${inWishlist
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <Heart
          className={`${iconSizes[size]} ${inWishlist ? 'fill-current' : ''}`}
        />
        <span>{inWishlist ? 'Saved' : 'Save'}</span>
      </button>
    );
  }

  return (
    <motion.button
      onClick={toggleWishlist}
      disabled={loading}
      className={`
        ${sizeClasses[size]} rounded-full bg-white shadow-lg
        flex items-center justify-center transition-all hover:scale-110
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`
            ${iconSizes[size]} transition-colors
            ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          `}
        />
      </motion.div>
    </motion.button>
  );
}
