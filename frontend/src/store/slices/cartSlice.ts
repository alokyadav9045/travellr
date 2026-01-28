import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Trip } from '@/types';

export interface CartItem {
  trip: Trip;
  selectedDate: Date;
  numberOfGuests: number;
  guestDetails: {
    leadGuest: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth?: Date;
      nationality?: string;
    };
    additionalGuests: Array<{
      firstName: string;
      lastName: string;
      dateOfBirth?: Date;
      relationship?: string;
    }>;
  };
  specialRequests?: string;
  promoCode?: string;
  pricing: {
    basePrice: number;
    platformFee: number;
    discount: number;
    totalPrice: number;
  };
}

interface CartState {
  item: CartItem | null;
  step: number; // 1: Trip details, 2: Guest info, 3: Payment
  paymentMethod: 'card' | 'paypal' | 'bank_transfer' | null;
  clientSecret: string | null;
  promoValidation: {
    isValid: boolean;
    message: string;
    discount: number;
  } | null;
  isProcessing: boolean;
  error: string | null;
}

const initialState: CartState = {
  item: null,
  step: 1,
  paymentMethod: null,
  clientSecret: null,
  promoValidation: null,
  isProcessing: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ trip: Trip; selectedDate: Date; numberOfGuests: number }>) => {
      const { trip, selectedDate, numberOfGuests } = action.payload;
      const basePrice = trip.price.amount * numberOfGuests;
      const platformFee = basePrice * 0.10; // 10% platform fee
      
      state.item = {
        trip,
        selectedDate,
        numberOfGuests,
        guestDetails: {
          leadGuest: {
            firstName: '',
            lastName: '',
            email: '',
            phone: ''
          },
          additionalGuests: Array(numberOfGuests - 1).fill(null).map(() => ({
            firstName: '',
            lastName: ''
          }))
        },
        pricing: {
          basePrice,
          platformFee,
          discount: 0,
          totalPrice: basePrice + platformFee
        }
      };
      state.step = 1;
      state.error = null;
    },
    
    updateTripDetails: (state, action: PayloadAction<{ selectedDate: Date; numberOfGuests: number }>) => {
      if (!state.item) return;
      
      const { selectedDate, numberOfGuests } = action.payload;
      state.item.selectedDate = selectedDate;
      state.item.numberOfGuests = numberOfGuests;
      
      // Recalculate pricing
      const basePrice = state.item.trip.price.amount * numberOfGuests;
      const platformFee = basePrice * 0.10;
      state.item.pricing.basePrice = basePrice;
      state.item.pricing.platformFee = platformFee;
      state.item.pricing.totalPrice = basePrice + platformFee - state.item.pricing.discount;
      
      // Update guest details array
      if (numberOfGuests > state.item.guestDetails.additionalGuests.length + 1) {
        const additionalNeeded = numberOfGuests - state.item.guestDetails.additionalGuests.length - 1;
        for (let i = 0; i < additionalNeeded; i++) {
          state.item.guestDetails.additionalGuests.push({
            firstName: '',
            lastName: ''
          });
        }
      } else if (numberOfGuests < state.item.guestDetails.additionalGuests.length + 1) {
        state.item.guestDetails.additionalGuests = state.item.guestDetails.additionalGuests.slice(
          0, numberOfGuests - 1
        );
      }
    },
    
    updateGuestDetails: (state, action: PayloadAction<CartItem['guestDetails']>) => {
      if (!state.item) return;
      state.item.guestDetails = action.payload;
    },
    
    updateLeadGuest: (state, action: PayloadAction<Partial<CartItem['guestDetails']['leadGuest']>>) => {
      if (!state.item) return;
      state.item.guestDetails.leadGuest = {
        ...state.item.guestDetails.leadGuest,
        ...action.payload
      };
    },
    
    updateAdditionalGuest: (state, action: PayloadAction<{ index: number; guest: Partial<CartItem['guestDetails']['additionalGuests'][0]> }>) => {
      if (!state.item) return;
      const { index, guest } = action.payload;
      if (state.item.guestDetails.additionalGuests[index]) {
        state.item.guestDetails.additionalGuests[index] = {
          ...state.item.guestDetails.additionalGuests[index],
          ...guest
        };
      }
    },
    
    updateSpecialRequests: (state, action: PayloadAction<string>) => {
      if (!state.item) return;
      state.item.specialRequests = action.payload;
    },
    
    applyPromoCode: (state, action: PayloadAction<{ code: string; discount: number; isValid: boolean; message: string }>) => {
      if (!state.item) return;
      const { code, discount, isValid, message } = action.payload;
      
      state.promoValidation = { isValid, message, discount };
      
      if (isValid) {
        state.item.promoCode = code;
        state.item.pricing.discount = discount;
        state.item.pricing.totalPrice = 
          state.item.pricing.basePrice + state.item.pricing.platformFee - discount;
      }
    },
    
    removePromoCode: (state) => {
      if (!state.item) return;
      state.item.promoCode = undefined;
      state.item.pricing.discount = 0;
      state.item.pricing.totalPrice = 
        state.item.pricing.basePrice + state.item.pricing.platformFee;
      state.promoValidation = null;
    },
    
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
      state.error = null;
    },
    
    nextStep: (state) => {
      if (state.step < 3) {
        state.step += 1;
      }
      state.error = null;
    },
    
    prevStep: (state) => {
      if (state.step > 1) {
        state.step -= 1;
      }
      state.error = null;
    },
    
    setPaymentMethod: (state, action: PayloadAction<CartState['paymentMethod']>) => {
      state.paymentMethod = action.payload;
    },
    
    setClientSecret: (state, action: PayloadAction<string>) => {
      state.clientSecret = action.payload;
    },
    
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearCart: (state) => {
      state.item = null;
      state.step = 1;
      state.paymentMethod = null;
      state.clientSecret = null;
      state.promoValidation = null;
      state.isProcessing = false;
      state.error = null;
    }
  }
});

export const {
  addToCart,
  updateTripDetails,
  updateGuestDetails,
  updateLeadGuest,
  updateAdditionalGuest,
  updateSpecialRequests,
  applyPromoCode,
  removePromoCode,
  setStep,
  nextStep,
  prevStep,
  setPaymentMethod,
  setClientSecret,
  setProcessing,
  setError,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;