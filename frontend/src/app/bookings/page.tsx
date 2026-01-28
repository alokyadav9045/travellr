'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { bookingApi } from '@/lib/api/bookings';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, MapPin, Clock, CreditCard, Hash, Eye, XCircle, Compass } from 'lucide-react';

export default function MyBookingsPage() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => bookingApi.getMyBookings(),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <Card className="max-w-md w-full border-0 shadow-xl rounded-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Sign in Required</h2>
              <p className="text-gray-600 mb-6">Please sign in to view your bookings</p>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#E55A2B]">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Gradient */}
      <section className="relative bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-32 pb-16">
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
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              My Bookings
            </h1>
            <p className="text-white/70 mt-2">
              Track and manage all your travel bookings
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        ) : !data?.data || data.data.length === 0 ? (
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
              <p className="text-gray-600 mb-6">Start exploring amazing trips and create unforgettable memories!</p>
              <Link href="/trips">
                <Button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:shadow-lg hover:shadow-[#FF6B35]/25">
                  Explore Trips
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {data.data.map((booking: any, index: number) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Trip Image */}
                      <div className="w-full md:w-56 h-48 md:h-auto bg-gray-200 flex-shrink-0">
                        {booking.trip?.images?.[0]?.url ? (
                          <img
                            src={booking.trip.images[0].url}
                            alt={booking.trip.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/20">
                            <MapPin className="w-12 h-12 text-[#FF6B35]/50" />
                          </div>
                        )}
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{booking.trip?.title}</h3>
                            <p className="text-gray-600 flex items-center gap-1.5 mt-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.selectedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusStyles(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                              <Users className="w-4 h-4" />
                              Guests
                            </div>
                            <p className="font-semibold">{booking.numberOfGuests}</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                              <CreditCard className="w-4 h-4" />
                              Total
                            </div>
                            <p className="font-semibold text-[#FF6B35]">₹{booking.totalPrice?.toLocaleString()}</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                              <Clock className="w-4 h-4" />
                              Payment
                            </div>
                            <p className="font-semibold capitalize">{booking.paymentStatus}</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                              <Hash className="w-4 h-4" />
                              Booking ID
                            </div>
                            <p className="font-semibold text-xs">#{booking._id.slice(-8)}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Link href={`/bookings/${booking._id}`}>
                            <Button variant="outline" size="sm" className="rounded-xl hover:bg-[#FF6B35]/5 hover:border-[#FF6B35] hover:text-[#FF6B35]">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                          {booking.status === 'confirmed' && (
                            <Button variant="outline" size="sm" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  );
}
