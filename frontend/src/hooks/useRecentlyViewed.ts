'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'travellr_recent_trips';
const MAX_RECENT = 10;

interface RecentTrip {
  _id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  viewedAt: string;
}

export function useRecentlyViewed() {
  const [recentTrips, setRecentTrips] = useState<RecentTrip[]>([]);

  useEffect(() => {
    loadRecentTrips();
  }, []);

  const loadRecentTrips = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const trips = JSON.parse(stored);
        setRecentTrips(trips);
      }
    } catch (error) {
      console.error('Failed to load recent trips:', error);
    }
  };

  const addTrip = (trip: Omit<RecentTrip, 'viewedAt'>) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let trips: RecentTrip[] = stored ? JSON.parse(stored) : [];

      // Remove if already exists
      trips = trips.filter(t => t._id !== trip._id);

      // Add to beginning
      trips.unshift({
        ...trip,
        viewedAt: new Date().toISOString(),
      });

      // Keep only MAX_RECENT items
      trips = trips.slice(0, MAX_RECENT);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
      setRecentTrips(trips);
    } catch (error) {
      console.error('Failed to save recent trip:', error);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentTrips([]);
  };

  const removeTrip = (tripId: string) => {
    try {
      const updated = recentTrips.filter(t => t._id !== tripId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentTrips(updated);
    } catch (error) {
      console.error('Failed to remove trip:', error);
    }
  };

  return {
    recentTrips,
    addTrip,
    clearHistory,
    removeTrip,
  };
}
