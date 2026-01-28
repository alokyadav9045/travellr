'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api/axios';

interface Booking {
  _id: string;
  trip: {
    title: string;
    slug: string;
    images: string[];
    duration: number;
  };
  startDate: string;
  totalPrice: number;
  guests: {
    adults: number;
    children: number;
  };
  status: string;
  paymentStatus: string;
  guestDetails: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: string;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && params.id) {
      fetchBooking();
    }
  }, [isAuthenticated, params.id]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${params.id}`);
      const data = response.data;
      
      if (data.success || data.data) {
        setBooking(data.data || data);
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setCancelling(true);
    try {
      await api.delete(`/bookings/${params.id}`);
      alert('Booking cancelled successfully');
      router.push('/bookings');
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handleRequestRefund = async () => {
    try {
      await api.post(`/bookings/${params.id}/request-refund`);
      alert('Refund request submitted successfully');
      fetchBooking();
    } catch (error) {
      console.error('Failed to request refund:', error);
      alert('Failed to request refund');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
          <Button onClick={() => router.push('/bookings')}>
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const paymentColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">Booking Details</h1>
            <p className="text-gray-600 mt-1">Booking ID: {booking._id}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status as keyof typeof statusColors]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentColors[booking.paymentStatus as keyof typeof paymentColors]}`}>
              {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Trip Info */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Trip Information</h2>
          <div className="flex gap-6">
            {booking.trip.images && booking.trip.images[0] && (
              <div className="w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={booking.trip.images[0]}
                  alt={booking.trip.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{booking.trip.title}</h3>
              <div className="space-y-1 text-gray-600">
                <p><strong>Duration:</strong> {booking.trip.duration} days</p>
                <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
                <p><strong>Guests:</strong> {booking.guests.adults} Adults, {booking.guests.children} Children</p>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push(`/trips/${booking.trip.slug}`)}
              >
                View Trip Details
              </Button>
            </div>
          </div>
        </Card>

        {/* Guest Details */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Guest Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Name</div>
              <div className="font-medium">{booking.guestDetails.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-medium">{booking.guestDetails.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Phone</div>
              <div className="font-medium">{booking.guestDetails.phone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Booked On</div>
              <div className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </Card>

        {/* Payment Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-semibold text-lg">${booking.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentColors[booking.paymentStatus as keyof typeof paymentColors]}`}>
                {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </Card>

        {/* Actions */}
        {booking.status !== 'cancelled' && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex gap-4">
              {booking.paymentStatus === 'paid' && (
                <Button
                  variant="outline"
                  onClick={handleRequestRefund}
                >
                  Request Refund
                </Button>
              )}
              <Button
                variant="outline"
                className="text-red-600 hover:bg-red-50"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </Button>
            </div>
          </Card>
        )}

        {booking.status === 'cancelled' && (
          <Card className="p-6 bg-red-50">
            <p className="text-red-800">
              This booking has been cancelled. If you have paid, your refund will be processed within 5-7 business days.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
