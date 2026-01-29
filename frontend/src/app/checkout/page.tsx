'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '@/store';
import { setStep, clearCart, nextStep, updateTripDetails, updateLeadGuest, setProcessing, setError, setClientSecret } from '@/store/slices/cartSlice';
import { bookingApi } from '@/lib/api/bookings';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import TripDetails from '@/components/checkout/TripDetails';
import GuestDetails from '@/components/checkout/GuestDetails';
import PaymentDetails from '@/components/checkout/PaymentDetails';
import OrderSummary from '@/components/checkout/OrderSummary';
import CheckoutSuccess from '@/components/checkout/CheckoutSuccess';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Lock, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { item, step, clientSecret, isProcessing, error } = useSelector((state: RootState) => state.cart);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (!item) {
      router.push('/trips');
    }
  }, [item, router]);

  // Recalculate price when dependencies change
  useEffect(() => {
    if (item && step === 1) {
      const fetchRealPrice = async () => {
        try {
          const pricing = await bookingApi.calculatePrice({
            tripId: item.trip.id,
            departureId: '', // Should be from trip data if available
            guests: {
              adults: item.numberOfGuests,
              children: 0,
              infants: 0
            }
          });
          // Update Redux pricing if needed (optional since we show it in OrderSummary)
          console.log('Real-time pricing:', pricing);
        } catch (err) {
          console.error('Failed to calculate real-time price', err);
        }
      };
      fetchRealPrice();
    }
  }, [item?.numberOfGuests, item?.selectedDate, step]);

  if (!item) {
    return null;
  }

  const handleStepChange = (newStep: number) => {
    if (newStep < step) {
      dispatch(setStep(newStep));
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      dispatch(setStep(step - 1));
    }
  };

  const handleCancel = () => {
    dispatch(clearCart());
    router.push('/trips');
  };

  const handleContinueToPayment = async () => {
    try {
      dispatch(setProcessing(true));

      // Find matching departure ID if possible
      const departure = item.trip.dates.find(d =>
        new Date(d.startDate).toDateString() === new Date(item.selectedDate).toDateString()
      );

      // Create actual booking record in backend
      const bookingData = {
        tripId: item.trip.id || item.trip._id,
        departureId: departure?._id || '',
        guests: {
          adults: item.numberOfGuests,
          children: 0,
          infants: 0
        },
        leadGuest: {
          firstName: item.guestDetails.leadGuest.firstName,
          lastName: item.guestDetails.leadGuest.lastName,
          email: item.guestDetails.leadGuest.email,
          phone: item.guestDetails.leadGuest.phone
        },
        specialRequests: item.specialRequests
      };

      const response = await bookingApi.createBooking(bookingData as any);

      if (response._id || response.id) {
        setBookingId(response._id || response.id);
        if ((response as any).clientSecret) {
          dispatch(setClientSecret((response as any).clientSecret));
        }
        dispatch(nextStep());
      }
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to initiate booking'));
    } finally {
      dispatch(setProcessing(false));
    }
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      dispatch(setProcessing(true));

      // If we have a booking ID, confirm payment
      if (bookingId) {
        // If it was a manual card form (not Stripe Elements)
        // In a real app with Stripe Elements, we'd use stripe.confirmPayment
        // For this demo, we'll notify backend of payment status
        await bookingApi.updateBooking(bookingId, {
          status: 'confirmed',
          // paymentMetadata: paymentData 
        });

        dispatch(setStep(4));
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setProcessing(false));
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <TripDetails trip={item.trip} selectedDate={item.selectedDate?.toISOString() || ''} guestCount={item.numberOfGuests} />
            <div className="mt-6 flex justify-end">
              <Button onClick={() => dispatch(nextStep())} className="px-8 bg-[#FF6B35] hover:bg-[#E55A2B]">
                Continue to Guest Details
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <GuestDetails
              guestCount={item.numberOfGuests}
              onGuestCountChange={(count) => dispatch(updateTripDetails({
                selectedDate: item.selectedDate,
                numberOfGuests: count
              }))}
              leadGuestDetails={item.guestDetails?.leadGuest}
              onLeadGuestChange={(details) => dispatch(updateLeadGuest(details))}
            />
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleContinueToPayment}
                disabled={!item.guestDetails?.leadGuest?.firstName || !item.guestDetails?.leadGuest?.email || isProcessing}
                className="px-8 bg-[#FF6B35] hover:bg-[#E55A2B]"
              >
                {isProcessing ? 'Processing...' : 'Continue to Payment'}
              </Button>
            </div>
          </>
        );
      case 3:
        return clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentDetails
              amount={item.pricing.totalPrice}
              onPaymentSubmit={handlePaymentSubmit}
              isLoading={isProcessing}
              error={error || undefined}
            />
          </Elements>
        ) : (
          <PaymentDetails
            amount={item.pricing.totalPrice}
            onPaymentSubmit={handlePaymentSubmit}
            isLoading={isProcessing}
            error={error || undefined}
          />
        );
      case 4:
        return <CheckoutSuccess bookingId={bookingId || 'TRV-SUCCESS'} trip={item.trip} guestCount={item.numberOfGuests} totalAmount={item.pricing.totalPrice} guestDetails={item.guestDetails?.leadGuest} onBackToHome={() => router.push('/')} />;
      default:
        return null;
    }
  };

  if (step === 4) {
    return <CheckoutSuccess bookingId="BK123" trip={item.trip} guestCount={item.numberOfGuests} totalAmount={item.trip.price.amount * item.numberOfGuests} guestDetails={item.guestDetails?.leadGuest} onBackToHome={() => router.push('/trips')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2D3436] via-[#636E72] to-[#2D3436] pt-32 pb-12">
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
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Complete your booking
                </h1>
                <p className="text-white/70 mt-1">
                  {item.trip.title}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel Booking
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 mt-6"
          >
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Safe Payment</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Checkout Steps */}
      <section className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <CheckoutSteps
            currentStep={step}
            onStepClick={handleStepChange}
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border-0 p-6 md:p-8">
              {renderStepContent()}
            </div>
          </motion.div>

          {/* Order Summary Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="sticky top-8">
              <OrderSummary trip={item.trip} selectedDate={item.selectedDate?.toISOString()} guestCount={item.numberOfGuests} />
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}