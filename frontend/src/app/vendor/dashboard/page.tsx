'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vendorApi } from '@/lib/api/vendorApi';
import {
  MapPin,
  Calendar,
  TrendingUp,
  Star,
  Plus,
  Eye,
  Edit,
  ChevronRight,
  Wallet,
  BarChart3
} from 'lucide-react';

export default function VendorDashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!isAuthenticated || user?.role !== 'vendor') return;

      try {
        // First get vendor profile ID
        const vendorProfile = await vendorApi.getCurrentVendor();
        setVendorId(vendorProfile._id);

        // Then get dashboard data
        const data = await vendorApi.getDashboard(vendorProfile._id);
        const stats = data.data?.stats || data.stats || data;

        setDashboardData({
          totalTrips: stats.totalTrips || 0,
          totalBookings: stats.totalBookings || 0,
          activeTrips: stats.activeTrips || 0, // Backend might need to provide this, or derived
          totalRevenue: stats.totalEarnings || 0,
          pendingPayouts: 0, // Not implemented in backend yet
          pendingBookings: 0, // Derived from recent bookings if not in stats
          avgRating: stats.avgRating || 0,
          totalReviews: stats.totalReviews || 0,
          recentBookings: data.data?.recentBookings || data.recentBookings || []
        });
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchDashboard();
    }
  }, [isAuthenticated, user, authLoading]);

  if (!user || user.role !== 'vendor') {
    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Vendor Access Required</h2>
          <Link href="/"><Button>Go Home</Button></Link>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-32 pb-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Vendor Dashboard
              </h1>
              <p className="text-white/70 mt-2">
                Manage your trips, track bookings, and grow your business
              </p>
            </div>
            <Link href="/vendor/trips/create">
              <Button size="lg" className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:shadow-lg hover:shadow-[#FF6B35]/25 rounded-xl">
                <Plus className="w-5 h-5 mr-2" />
                Create New Trip
              </Button>
            </Link>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
          >
            <StatsCard icon={MapPin} label="Total Trips" value={dashboardData.totalTrips} color="#FF6B35" />
            <StatsCard icon={Calendar} label="Total Bookings" value={dashboardData.totalBookings} color="#10B981" />
            <StatsCard icon={Wallet} label="Revenue" value={`₹${(dashboardData.totalRevenue).toLocaleString()}`} color="#3B82F6" />
            <StatsCard icon={Star} label="Rating" value={`${dashboardData.avgRating.toFixed(1)} ★`} color="#F59E0B" />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Card */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Total Revenue</p>
                    <p className="text-white text-4xl font-bold mt-2">₹{dashboardData.totalRevenue.toLocaleString()}</p>
                    <p className="text-white/80 text-sm mt-2">
                      Lifecycle earnings from completed bookings
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Bookings */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Recent Bookings</CardTitle>
                  <Link href="/vendor/bookings" className="text-[#FF6B35] hover:text-[#E55A2B] text-sm font-medium flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {dashboardData.recentBookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No recent bookings</div>
                  ) : (
                    dashboardData.recentBookings.map((booking: any, i: number) => (
                      <div
                        key={booking._id || i}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-full flex items-center justify-center text-[#FF6B35]">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{booking.trip?.title || 'Trip'}</p>
                            <p className="text-sm text-gray-500">{booking.user?.name || 'Guest'} • {booking.totalPrice?.toLocaleString()} INR</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/vendor/trips/create" className="block">
                  <Button className="w-full justify-start gap-3 h-12 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E55A2B]">
                    <Plus className="w-5 h-5" />
                    Create New Trip
                  </Button>
                </Link>
                <Link href="/vendor/bookings" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl">
                    <Calendar className="w-5 h-5" /> View Bookings
                  </Button>
                </Link>
                <Link href="/vendor/trips" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl">
                    <Eye className="w-5 h-5" /> Manage Trips
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatsCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center" style={{ color }}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-white/60 text-sm">{label}</p>
          <p className="text-white text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
