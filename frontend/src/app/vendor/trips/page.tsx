'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api/axios';
import { vendorApi } from '@/lib/api/vendorApi';

interface Trip {
  _id: string;
  title: string;
  slug: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  images: string[];
  category: string;
  isActive: boolean;
  createdAt: string;
}

export default function VendorTripsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'vendor')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'vendor') {
      fetchTrips();
    }
  }, [isAuthenticated, user]);

  const fetchTrips = async () => {
    try {
      // Use vendorApi to fetch trips for the current user (who is the vendor)
      const data = await vendorApi.getVendorTrips(user?._id!);
      const tripsData = data.data || data || [];

      setTrips(tripsData);
      const active = tripsData.filter((t: Trip) => t.isActive).length;
      setStats({
        total: tripsData.length,
        active,
        inactive: tripsData.length - active,
      });
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      await api.delete(`/trips/${id}`);
      fetchTrips();
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  const toggleStatus = async (trip: Trip) => {
    try {
      await api.put(`/trips/${trip._id}`, { isActive: !trip.isActive });
      fetchTrips();
    } catch (error) {
      console.error('Failed to update trip:', error);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'vendor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Trips</h1>
            <p className="text-gray-600 mt-2">Manage your travel packages</p>
          </div>
          <Link href="/vendor/trips/create">
            <Button>+ Create New Trip</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600">Total Trips</div>
            <div className="text-3xl font-bold mt-2">{stats.total}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Active</div>
            <div className="text-3xl font-bold mt-2 text-green-600">{stats.active}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Inactive</div>
            <div className="text-3xl font-bold mt-2 text-gray-400">{stats.inactive}</div>
          </Card>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {trips.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-600 mb-4">No trips yet</p>
              <Link href="/vendor/trips/create">
                <Button>Create Your First Trip</Button>
              </Link>
            </Card>
          ) : (
            trips.map((trip) => (
              <Card key={trip._id} className="p-6">
                <div className="flex gap-6">
                  {/* Image */}
                  <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {trip.images && trip.images[0] ? (
                      <img
                        src={trip.images[0]}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{trip.duration} days</span>
                          <span>Max {trip.maxGroupSize} people</span>
                          <span className="font-semibold text-orange-600">${trip.price}</span>
                        </div>
                        <div className="mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {trip.category}
                          </span>
                          <span
                            className={`ml-2 px-2 py-1 text-xs rounded ${trip.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {trip.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link href={`/trips/${trip.slug}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/vendor/trips/${trip._id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(trip)}
                      >
                        {trip.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(trip._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
