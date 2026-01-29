'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Lock,
    Bell,
    Shield,
    CreditCard,
    Settings as SettingsIcon,
    ChevronRight,
    Camera,
    Mail,
    Phone,
    Globe
} from 'lucide-react';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user } = useAuth();
    const updateProfile = async (data: any) => {
        // Mock update profile function
        console.log('Update profile:', data);
    };
    const [isLoading, setIsLoading] = useState(false);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Profile updated successfully');
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Header />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <SettingsIcon className="w-8 h-8 text-[#FF6B35]" />
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar (Desktop) */}
                    <aside className="lg:col-span-1">
                        <Card className="dark:bg-gray-900 dark:border-gray-800">
                            <CardContent className="p-2">
                                <nav className="space-y-1">
                                    {[
                                        { id: 'profile', label: 'Profile', icon: User },
                                        { id: 'account', label: 'Account Security', icon: Lock },
                                        { id: 'notifications', label: 'Notifications', icon: Bell },
                                        { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
                                        { id: 'privacy', label: 'Privacy', icon: Shield },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B35]" />
                                                {item.label}
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-300" />
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Settings Content */}
                    <div className="lg:col-span-3">
                        <Tabs defaultValue="profile" className="space-y-6">
                            <TabsList className="bg-white dark:bg-gray-900 border dark:border-gray-800 p-1 rounded-xl glass-morphism">
                                <TabsTrigger value="profile">Profile</TabsTrigger>
                                <TabsTrigger value="account">Account</TabsTrigger>
                                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            </TabsList>

                            {/* Profile Settings */}
                            <TabsContent value="profile">
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle className="text-gray-900 dark:text-white">Public Profile</CardTitle>
                                        <CardDescription className="dark:text-gray-400">Manage how others see you on Travellr</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8">
                                        <div className="flex flex-col sm:flex-row items-center gap-6">
                                            <div className="relative group">
                                                <Avatar className="w-24 h-24 border-2 border-white dark:border-gray-800 shadow-lg">
                                                    <AvatarImage src={user?.avatar?.url} />
                                                    <AvatarFallback className="text-2xl bg-[#FF6B35]/10 text-[#FF6B35] font-bold">
                                                        {user?.name?.[0] || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <button className="absolute bottom-0 right-0 p-2 bg-[#FF6B35] text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                                    <Camera className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <h3 className="font-bold text-lg dark:text-white">{user?.name}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">JPG, GIF or PNG. Max size of 2MB</p>
                                                <div className="mt-3 flex gap-2">
                                                    <Button size="sm" variant="outline" className="dark:border-gray-700 dark:text-gray-300">Upload New</Button>
                                                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</Button>
                                                </div>
                                            </div>
                                        </div>

                                        <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullName" className="dark:text-gray-300">Full Name</Label>
                                                <Input id="fullName" name="name" placeholder="Your Name" defaultValue={user?.name} className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="dark:text-gray-300">Email Address</Label>
                                                <Input id="email" name="email" type="email" placeholder="email@example.com" defaultValue={user?.email} disabled className="bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="dark:text-gray-300">Phone Number</Label>
                                                <Input id="phone" name="phone" placeholder="+91 00000 00000" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location" className="dark:text-gray-300">Location</Label>
                                                <Input id="location" name="location" placeholder="City, Country" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <Label htmlFor="bio" className="dark:text-gray-300">Bio</Label>
                                                <textarea
                                                    id="bio"
                                                    name="bio"
                                                    rows={4}
                                                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                                    placeholder="Tell us a bit about yourself..."
                                                ></textarea>
                                            </div>
                                            <div className="md:col-span-2 flex justify-end">
                                                <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white px-8" disabled={isLoading}>
                                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Account Security */}
                            <TabsContent value="account">
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle className="text-gray-900 dark:text-white">Security Settings</CardTitle>
                                        <CardDescription className="dark:text-gray-400">Manage your password and security preferences</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm dark:text-white">Change Password</h4>
                                            <div className="grid gap-4 max-w-md">
                                                <div className="space-y-2">
                                                    <Label htmlFor="currentPassword" title="Current Password" className="dark:text-gray-300">Current Password</Label>
                                                    <Input id="currentPassword" name="currentPassword" type="password" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="newPassword" title="New Password" className="dark:text-gray-300">New Password</Label>
                                                    <Input id="newPassword" name="newPassword" type="password" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirmPassword" title="Confirm Password" className="dark:text-gray-300">Confirm New Password</Label>
                                                    <Input id="confirmPassword" name="confirmPassword" type="password" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
                                                </div>
                                                <Button className="w-fit bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100">Update Password</Button>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t dark:border-gray-800 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium dark:text-white">Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                                                </div>
                                                <Switch />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Notifications */}
                            <TabsContent value="notifications">
                                <Card className="dark:bg-gray-900 dark:border-gray-800">
                                    <CardHeader>
                                        <CardTitle className="text-gray-900 dark:text-white">Notification Preferences</CardTitle>
                                        <CardDescription className="dark:text-gray-400">Choose what updates you want to receive</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-sm dark:text-white">Email Notifications</h4>
                                            {[
                                                { id: 'n1', label: 'Booking Confirmation', desc: 'Receive emails about your trip bookings and payments' },
                                                { id: 'n2', label: 'Trip Recommendations', desc: 'Get ideas for your next adventure based on your interests' },
                                                { id: 'n3', label: 'Security Alerts', desc: 'News about account security and activity' }
                                            ].map((n) => (
                                                <div key={n.id} className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium dark:text-white text-sm">{n.label}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{n.desc}</p>
                                                    </div>
                                                    <Switch defaultChecked />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t dark:border-gray-800 space-y-4">
                                            <h4 className="font-semibold text-sm dark:text-white">Push Notifications</h4>
                                            {[
                                                { id: 'p1', label: 'Message Alerts', desc: 'Notifications when a vendor sends you a message' },
                                                { id: 'p2', label: 'Price Drops', desc: 'Alerts when trips in your wishlist drop in price' }
                                            ].map((n) => (
                                                <div key={n.id} className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium dark:text-white text-sm">{n.label}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{n.desc}</p>
                                                    </div>
                                                    <Switch />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
