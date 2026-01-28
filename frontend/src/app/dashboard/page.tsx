'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { bookingApi } from '@/lib/api/bookings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming generic Tabs component or standard UI
import { Calendar, MapPin, Clock, CreditCard, User, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    try {
      // API returns { bookings: [], pagination: {} }
      const data: any = await bookingApi.getUserBookings();
      if (data && data.bookings) {
        setBookings(data.bookings);
      } else if (Array.isArray(data)) { // Fallback if API changes
        setBookings(data);
      } else if (data && data.data) { // Standard PaginatedResponse fallback
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#FF6B35]">Travellr</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, {user?.name}</span>
            <div className="h-8 w-8 bg-[#FF6B35]/10 rounded-full flex items-center justify-center text-[#FF6B35] font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1 space-y-2">
            <Button variant="secondary" className="w-full justify-start bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35]/20 font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              My Bookings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Methods
            </Button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Trips</CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings yet</h3>
                    <p className="text-gray-500 mb-6">You haven't booked any trips yet.</p>
                    <Link href="/">
                      <Button>Explore Trips</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="border rounded-xl p-4 hover:border-[#FF6B35] transition-colors bg-white group">
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Trip Image */}
                          <div className="w-full sm:w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                            {booking.trip?.images?.[0]?.url && (
                              <img
                                src={booking.trip.images[0].url}
                                alt={booking.trip.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900 mb-1">{booking.trip?.title}</h3>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {booking.trip?.location?.city}, {booking.trip?.location?.country}
                                </div>
                              </div>
                              <StatusBadge status={booking.status} />
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                              <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                <Clock className="w-3 h-3 mr-1.5" />
                                {new Date(booking.selectedDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                <User className="w-3 h-3 mr-1.5" />
                                {booking.numberOfGuests} Guests
                              </div>
                              <div className="font-semibold text-gray-900 ml-auto">
                                ${booking.totalPrice?.toLocaleString()}
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t flex justify-end gap-2">
                              <Link href={`/bookings/${booking._id}`}>
                                <Button variant="outline" size="sm">View Details</Button>
                              </Link>
                              {booking.status === 'pending' && (
                                <Link href={`/bookings/${booking._id}?action=pay`}>
                                  <Button size="sm">Pay Now</Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800',
  };

  const label = status?.charAt(0).toUpperCase() + status?.slice(1);
  const style = styles[status as keyof typeof styles] || styles.draft;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}