'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { tripApi } from '@/lib/api/trips';
import { bookingApi } from '@/lib/api/bookings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  specialRequests: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

function NewBookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tripId = searchParams.get('trip');
  const selectedDate = searchParams.get('date');
  const guests = parseInt(searchParams.get('guests') || '1');

  const [step, setStep] = useState(1);

  const { data: trip, isLoading } = useQuery({
    queryKey: ['trip-booking', tripId],
    queryFn: () => tripApi.getTripById(tripId!),
    enabled: !!tripId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: any) => bookingApi.createBooking(data),
    onSuccess: (response) => {
      router.push(`/bookings/${response._id}`);
    },
    onError: (error: any) => {
      // alert(error.response?.data?.message || 'Booking failed');
      // Using a simple alert for now, could be replaced with toast
      console.error(error);
      alert('Booking failed. Please try again.');
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Sign in Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to make a booking</p>
            <Link href={`/login?redirect=/bookings/new?trip=${tripId}&date=${selectedDate}&guests=${guests}`}>
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const totalPrice = (trip.price?.amount || 0) * guests;

  const onSubmit = (data: BookingFormData & { paymentMethod?: string }) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    createBookingMutation.mutate({
      trip: tripId,
      numberOfGuests: guests,
      selectedDate,
      guestDetails: data,
      paymentMethod: data.paymentMethod || 'card',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-orange-600">
            Travellr
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center mb-8">
              <div className={`flex items-center ${step >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${step >= 1 ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-300'
                  }`}>
                  1
                </div>
                <span className="ml-2 font-medium">Guest Details</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
              <div className={`flex items-center ${step >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${step >= 2 ? 'border-orange-600 bg-orange-600 text-white' : 'border-gray-300'
                  }`}>
                  2
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Guest Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <Input {...register('firstName')} />
                        {errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <Input {...register('lastName')} />
                        {errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <Input type="email" {...register('email')} />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <Input type="tel" {...register('phone')} />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                      <textarea
                        {...register('specialRequests')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={4}
                        placeholder="Any special requirements or requests..."
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Secure Checkout:</strong> Choose your preferred payment method below.
                        'Pay at Venue' reserves your spot without immediate charge.
                      </p>
                    </div>

                    <div className="space-y-4 opacity-50 pointer-events-none">
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Number</label>
                        <Input placeholder="1234 5678 9012 3456" disabled />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Expiry</label>
                          <Input placeholder="MM/YY" disabled />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVC</label>
                          <Input placeholder="123" disabled />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex-1 bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                        disabled={createBookingMutation.isPending}
                        onClick={handleSubmit((data) => onSubmit({ ...data, paymentMethod: 'pay_at_venue' }))}
                      >
                        {createBookingMutation.isPending ? 'Processing...' : 'Pay at Venue'}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#FF6B35] hover:bg-[#e55a2b]"
                        disabled={createBookingMutation.isPending}
                        onClick={handleSubmit((data) => onSubmit({ ...data, paymentMethod: 'card' }))}
                      >
                        {createBookingMutation.isPending ? 'Processing...' : 'Pay Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {trip.images?.[0]?.url && (
                    <img src={trip.images[0].url} alt={trip.title} className="w-full h-full object-cover" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{trip.title}</h3>
                  <p className="text-gray-600 text-sm">{trip.location?.city}, {trip.location?.country}</p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Date</span>
                    <span>{new Date(selectedDate!).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Guests</span>
                    <span>{guests}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>${trip.price?.amount} × {guests}</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>}>
      <NewBookingContent />
    </Suspense>
  );
}
