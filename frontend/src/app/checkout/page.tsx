'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '@/store';
import { setStep, clearCart } from '@/store/slices/cartSlice';
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
  const { item, step, clientSecret } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (!item) {
      router.push('/trips');
    }
  }, [item, router]);

  if (!item) {
    return null;
  }

  const handleStepChange = (newStep: number) => {
    dispatch(setStep(newStep));
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <TripDetails trip={item.trip} selectedDate={item.selectedDate?.toISOString() || ''} guestCount={item.numberOfGuests} />;
      case 2:
        return <GuestDetails guestCount={item.numberOfGuests} onGuestCountChange={() => {}} leadGuestDetails={item.guestDetails?.leadGuest} onLeadGuestChange={() => {}} />;
      case 3:
        return clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentDetails amount={item.trip.price.amount * item.numberOfGuests} onPaymentSubmit={() => {}} />
          </Elements>
        ) : (
          <PaymentDetails amount={item.trip.price.amount * item.numberOfGuests} onPaymentSubmit={() => {}} />
        );
      case 4:
        return <CheckoutSuccess bookingId="BK123" trip={item.trip} guestCount={item.numberOfGuests} totalAmount={item.trip.price.amount * item.numberOfGuests} guestDetails={item.guestDetails?.leadGuest} onBackToHome={() => router.push('/trips')} />;
      default:
        return <TripDetails trip={item.trip} selectedDate={item.selectedDate?.toISOString() || ''} guestCount={item.numberOfGuests} />;
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