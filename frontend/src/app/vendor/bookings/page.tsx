'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { vendorApi } from '@/lib/api/vendorApi';
import { api } from '@/lib/api/axios'; // For direct booking actions if needed
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle, XCircle, Clock, MapPin, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function VendorBookingsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [vendorId, setVendorId] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== 'vendor')) {
            router.push('/login');
        }
    }, [isAuthenticated, user, authLoading, router]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!isAuthenticated || user?.role !== 'vendor') return;

            try {
                const vendorProfile = await vendorApi.getCurrentVendor();
                setVendorId(vendorProfile._id);

                const response = await vendorApi.getBookings(vendorProfile._id);
                const bookingsData = response.data || response || [];
                setBookings(Array.isArray(bookingsData) ? bookingsData : []);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchBookings();
        }
    }, [isAuthenticated, user]);

    const handleStatusUpdate = async (bookingId: string, status: string) => {
        // Requires an endpoint to update status. 
        // Assuming api.patch(`/bookings/${bookingId}`, { status }) works if user is vendor of that booking.
        // Or vendorController needs `updateBookingStatus`.
        // Let's assume standard booking update endpoint restricts to user/vendor.
        try {
            await api.patch(`/bookings/${bookingId}`, { status });
            // Refresh
            setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
            alert(`Booking ${status}`);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesFilter = filter === 'all' || booking.status === filter;
        const matchesSearch = booking.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            booking.trip?.title?.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>

                <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                    <div className="flex gap-2">
                        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(f => (
                            <Button
                                key={f}
                                variant={filter === f ? 'default' : 'outline'}
                                onClick={() => setFilter(f)}
                                className="capitalize"
                            >
                                {f}
                            </Button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search guest or trip..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <Card className="p-8 text-center text-gray-500">
                            No bookings found.
                        </Card>
                    ) : (
                        filteredBookings.map((booking) => (
                            <Card key={booking._id} className="overflow-hidden bg-white hover:shadow-md transition-shadow">
                                <div className="p-6 flex flex-col md:flex-row gap-6">
                                    {/* Left: Trip Info */}
                                    <div className="w-full md:w-1/3">
                                        <h3 className="font-bold text-lg mb-1">{booking.trip?.title}</h3>
                                        <div className="text-gray-500 text-sm flex items-center mb-1">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {booking.trip?.location?.city || 'Location'}
                                        </div>
                                        <div className="text-gray-500 text-sm flex items-center">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            {new Date(booking.selectedDate).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Middle: Guest Info */}
                                    <div className="w-full md:w-1/3 border-l pl-0 md:pl-6 border-gray-100">
                                        <div className="font-medium">{booking.user?.name}</div>
                                        <div className="text-sm text-gray-500">{booking.user?.email}</div>
                                        <div className="text-sm text-gray-500">{booking.user?.phone}</div>
                                        <div className="mt-2 text-sm bg-gray-100 inline-block px-2 py-1 rounded">
                                            {booking.numberOfGuests} Guests
                                        </div>
                                    </div>

                                    {/* Right: Status & Actions */}
                                    <div className="w-full md:w-1/3 flex flex-col items-end justify-between">
                                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            {booking.status.toUpperCase()}
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            {booking.status === 'pending' && (
                                                <>
                                                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusUpdate(booking._id, 'confirmed')}>
                                                        <CheckCircle className="w-4 h-4 mr-1" /> Confirm
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleStatusUpdate(booking._id, 'cancelled')}>
                                                        <XCircle className="w-4 h-4 mr-1" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(booking._id, 'completed')}>
                                                    Mark Complete
                                                </Button>
                                            )}
                                            <Link href={`/bookings/${booking._id}`}>
                                                <Button size="sm" variant="ghost">View Details</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
