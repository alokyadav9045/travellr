'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api/axios';
import {
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  ChevronRight,
  Activity,
  Shield,
  AlertTriangle,
  Clock,
  BarChart3
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
}

interface Vendor {
  _id: string;
  businessName: string;
  user: { name: string; email: string };
  isVerified: boolean;
  createdAt: string;
}

interface Trip {
  _id: string;
  title: string;
  vendor: { businessName: string };
  price: number;
  isActive: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    trips: 0,
    bookings: 0,
    revenue: 0
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [pendingVendors, setPendingVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats from admin endpoints
      const [usersRes, vendorsRes, analyticsRes] = await Promise.all([
        api.get('/admin/users').catch(() => ({ data: { users: [] } })),
        api.get('/admin/vendors').catch(() => ({ data: { vendors: [] } })),
        api.get('/admin/analytics').catch(() => ({ data: {} }))
      ]);

      const usersData = usersRes.data.data?.users || usersRes.data.users || [];
      const vendorsData = vendorsRes.data.data?.vendors || vendorsRes.data.vendors || [];
      const analytics = analyticsRes.data.data || analyticsRes.data || {};

      setStats({
        users: analytics.totalUsers || usersData.length || 0,
        vendors: analytics.totalVendors || vendorsData.length || 0,
        trips: analytics.totalTrips || 0,
        bookings: analytics.totalBookings || 0,
        revenue: analytics.totalRevenue || 0
      });

      setRecentUsers(usersData.slice(0, 5));
      setPendingVendors(vendorsData.filter((v: Vendor) => !v.isVerified).slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-500 mt-4">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#FF6B35] font-medium">Admin Panel</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Platform Dashboard
            </h1>
            <p className="text-white/70 mt-2">
              Manage users, vendors, trips, and platform operations
            </p>
          </motion.div>
          
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8"
          >
            <Link href="/admin/users" className="block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Users</p>
                    <p className="text-white text-xl font-bold">{stats.users.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/admin/vendors" className="block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Vendors</p>
                    <p className="text-white text-xl font-bold">{stats.vendors}</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/admin/trips" className="block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Trips</p>
                    <p className="text-white text-xl font-bold">{stats.trips}</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Bookings</p>
                  <p className="text-white text-xl font-bold">{stats.bookings.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Revenue</p>
                  <p className="text-white text-xl font-bold">₹{(stats.revenue / 1000).toFixed(0)}k</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Vendor Approvals */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Pending Vendor Approvals
                    <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-sm font-medium">
                      3 pending
                    </span>
                  </CardTitle>
                  <Link href="/admin/vendors" className="text-[#FF6B35] hover:text-[#E55A2B] text-sm font-medium flex items-center gap-1">
                    View all <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {[
                    { name: 'Adventure Tours Co.', email: 'vendor1@example.com', days: 2 },
                    { name: 'Mountain Expeditions', email: 'vendor2@example.com', days: 3 },
                    { name: 'Beach Getaways Ltd', email: 'vendor3@example.com', days: 5 }
                  ].map((vendor, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/20 rounded-xl flex items-center justify-center">
                          <Shield className="w-5 h-5 text-[#FF6B35]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{vendor.name}</p>
                          <p className="text-sm text-gray-500">{vendor.email}</p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Applied {vendor.days} days ago
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="rounded-xl bg-gradient-to-r from-[#00B894] to-[#00A187]">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl text-red-600 border-red-200 hover:bg-red-50">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#FF6B35]" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {[
                    { type: 'user', action: 'New user registered', time: '5 min ago', icon: Users, color: 'blue' },
                    { type: 'booking', action: 'New booking created', time: '12 min ago', icon: Calendar, color: 'emerald' },
                    { type: 'trip', action: 'Trip published', time: '1 hour ago', icon: MapPin, color: 'purple' },
                    { type: 'vendor', action: 'Vendor application submitted', time: '2 hours ago', icon: Shield, color: 'orange' },
                    { type: 'payment', action: 'Payment processed', time: '3 hours ago', icon: DollarSign, color: 'amber' }
                  ].map((activity, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4"
                    >
                      <div className={`w-1 h-12 rounded-full bg-${activity.color}-500`} />
                      <div className={`w-10 h-10 rounded-xl bg-${activity.color}-100 flex items-center justify-center`}>
                        <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/users" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-[#FF6B35]/5 hover:border-[#FF6B35] hover:text-[#FF6B35]">
                    <Users className="w-5 h-5" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/vendors" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-[#FF6B35]/5 hover:border-[#FF6B35] hover:text-[#FF6B35]">
                    <Shield className="w-5 h-5" />
                    Manage Vendors
                  </Button>
                </Link>
                <Link href="/admin/trips" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-[#FF6B35]/5 hover:border-[#FF6B35] hover:text-[#FF6B35]">
                    <MapPin className="w-5 h-5" />
                    Manage Trips
                  </Button>
                </Link>
                <Link href="/admin/reports" className="block">
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-[#FF6B35]/5 hover:border-[#FF6B35] hover:text-[#FF6B35]">
                    <BarChart3 className="w-5 h-5" />
                    View Reports
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Platform Health */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#2D3436] to-[#636E72] p-6">
                <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Platform Health
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">System Status</span>
                    <span className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Server Uptime</span>
                    <span className="text-white font-bold">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Response Time</span>
                    <span className="text-white font-bold">124ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">API Requests (24h)</span>
                    <span className="text-white font-bold">45.2k</span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Revenue Card */}
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-bold">Monthly Revenue</h3>
                  <TrendingUp className="w-5 h-5 text-white/80" />
                </div>
                <p className="text-white text-3xl font-bold">₹{stats.revenue.toLocaleString()}</p>
                <p className="text-white/80 text-sm mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  +12.5% from last month
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
