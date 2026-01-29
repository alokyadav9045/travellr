'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Bell,
  Lock,
  LogOut,
  Edit,
  Camera,
  MapPin,
  TrendingUp,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <Header />
        <div className="min-h-[70vh] flex items-center justify-center">
          <Card className="max-w-md w-full border-0 shadow-xl rounded-2xl dark:bg-gray-900 dark:shadow-gray-900/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-8 h-8 text-[#FF6B35]" />
              </div>
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Sign in Required</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Please sign in to view your profile</p>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />

      {/* Hero Section with Gradient */}
      <section className="relative bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-32 pb-24">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF6B35]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00B894]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              <Avatar className="w-32 h-32 border-4 border-white/20 shadow-2xl">
                <AvatarImage src={user.avatar?.url} />
                <AvatarFallback className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] text-white text-4xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-[#FF6B35] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#E55A2B] transition-colors">
                <Camera className="w-5 h-5" />
              </button>
              {user.isEmailVerified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.name}</h1>
            <p className="text-white/70 flex items-center justify-center gap-2 mb-4">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>
            <Badge className="bg-[#FF6B35]/20 text-[#FF6B35] border-[#FF6B35]/30 capitalize px-4 py-1.5">
              {user.role}
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-12 relative z-10">
        <div className="grid gap-6">
          {/* Profile Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl rounded-2xl dark:bg-gray-900 dark:shadow-gray-900/20">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
                    <User className="w-5 h-5 text-[#FF6B35]" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                    className="rounded-xl hover:bg-[#FF6B35]/5 hover:border-[#FF6B35] hover:text-[#FF6B35] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {isEditing ? 'Cancel' : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-pointer">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="fullName"
                          name="name"
                          defaultValue={user.name}
                          className="pl-12 h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          defaultValue={user.email}
                          disabled
                          className="pl-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Email cannot be changed</p>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 cursor-pointer">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          defaultValue={user.phone || ''}
                          placeholder="Add phone number"
                          className="pl-12 h-12 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                        />
                      </div>
                    </div>
                    <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] hover:shadow-lg hover:shadow-[#FF6B35]/25 text-white">
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-5 h-5 text-[#FF6B35]" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white ml-8">{user.name}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-[#FF6B35]" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white ml-8">{user.email}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-[#FF6B35]" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white ml-8">{user.phone || 'Not provided'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-[#FF6B35]" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white ml-8">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:col-span-2">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-[#FF6B35]" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">Account Status</p>
                      </div>
                      <p className="font-semibold ml-8">
                        {user.isEmailVerified ? (
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Verified Account
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">Pending Verification</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Become a Vendor CTA */}
          {user.role === 'customer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden dark:bg-gray-900 dark:shadow-gray-900/20">
                <div className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h3 className="text-white text-xl font-bold mb-2">Become a Vendor</h3>
                      <p className="text-white/80">
                        Share your travel experiences and earn money by creating trips for travelers worldwide.
                      </p>
                    </div>
                    <Link href="/vendor/apply">
                      <Button className="bg-white text-[#FF6B35] hover:bg-gray-100 rounded-xl px-6">
                        Apply Now
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Vendor Dashboard Link */}
          {user.role === 'vendor' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden dark:bg-gray-900 dark:shadow-gray-900/20">
                <div className="bg-gradient-to-r from-[#00B894] to-[#00A187] p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h3 className="text-white text-xl font-bold mb-2">Vendor Dashboard</h3>
                      <p className="text-white/80">
                        Manage your trips, view bookings, and track your earnings.
                      </p>
                    </div>
                    <Link href="/vendor/dashboard">
                      <Button className="bg-white text-[#00B894] hover:bg-gray-100 rounded-xl px-6">
                        Go to Dashboard
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl rounded-2xl dark:bg-gray-900 dark:shadow-gray-900/20">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-xl flex items-center gap-2 text-gray-900 dark:text-white">
                  <Shield className="w-5 h-5 text-[#FF6B35]" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  <Link href="/profile/change-password" className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[#FF6B35]" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Change Password</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Update your password regularly for security</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>

                  <Link href="/profile/notifications" className="flex items-center justify-between p-5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Notification Preferences</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Manage email and push notifications</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>

                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to logout?')) {
                        logout();
                      }
                    }}
                    className="w-full flex items-center justify-between p-5 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                        <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-red-600 dark:text-red-400">Logout</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Sign out from your account</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
