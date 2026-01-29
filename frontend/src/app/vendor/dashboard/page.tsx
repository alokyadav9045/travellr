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
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">Loading Your Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-32 pb-16 overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#00B894]/5 rounded-full blur-3xl -ml-36 -mb-36" />

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
              <Button size="lg" className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:shadow-lg hover:shadow-[#FF6B35]/25 rounded-xl border-0">
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
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden glass-morphism">
              <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">Total Lifetime Revenue</p>
                    <p className="text-white text-5xl font-bold mt-2">₹{dashboardData.totalRevenue.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-4 text-white/80 text-sm bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>Earnings from completed bookings</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Bookings */}
            <Card className="border-0 shadow-lg rounded-2xl dark:bg-gray-900 dark:border-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl dark:text-white">Recent Bookings</CardTitle>
                  <Link href="/vendor/bookings" className="text-[#FF6B35] hover:text-[#E55A2B] text-sm font-medium flex items-center gap-1 transition-colors">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {dashboardData.recentBookings.length === 0 ? (
                    <div className="p-12 text-center">
                      <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No recent bookings yet</p>
                    </div>
                  ) : (
                    dashboardData.recentBookings.map((booking: any, i: number) => (
                      <div
                        key={booking._id || i}
                        className="flex items-center justify-between p-4 px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center text-[#FF6B35]">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{booking.trip?.title || 'Trip'}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{booking.user?.name || 'Guest'} • ₹{booking.totalPrice?.toLocaleString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
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
            <Card className="border-0 shadow-lg rounded-2xl dark:bg-gray-900 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-6">
                <Link href="/vendor/trips/create" className="block">
                  <Button className="w-full justify-start gap-3 h-12 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] border-0 shadow-md hover:shadow-lg transition-all duration-300">
                    <Plus className="w-5 h-5" />
                    Create New Trip
                  </Button>
                </Link>
                <Link href="/vendor/bookings" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-50">
                    <Calendar className="w-5 h-5 text-[#FF6B35]" /> View Bookings
                  </Button>
                </Link>
                <Link href="/vendor/trips" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 hover:bg-gray-50">
                    <Eye className="w-5 h-5 text-[#FF6B35]" /> Manage Trips
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support Box */}
            <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-gray-400 text-sm mb-4">Our vendor support team is available 24/7 to assist you with your listings.</p>
              <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800 rounded-xl">
                Contact Support
              </Button>
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
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/15 transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center transition-transform group-hover:scale-110" style={{ color }}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
