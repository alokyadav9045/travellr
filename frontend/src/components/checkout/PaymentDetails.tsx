'use client';

import React, { useState } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface PaymentDetailsProps {
  amount: number;
  onPaymentSubmit: (paymentData: any) => void;
  isLoading?: boolean;
  error?: string;
}

export default function PaymentDetails({ amount, onPaymentSubmit, isLoading = false, error }: PaymentDetailsProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'stripe'>('card');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      value = formatExpiryDate(value);
    } else if (field === 'cvv') {
      value = value.replace(/[^0-9]/g, '').substring(0, 4);
    }

    if (field.startsWith('billing.')) {
      const billingField = field.replace('billing.', '');
      setPaymentData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [billingField]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPaymentSubmit({
      ...paymentData,
      paymentMethod,
      amount
    });
  };

  const isFormValid = () => {
    if (paymentMethod === 'card') {
      return paymentData.cardNumber.replace(/\s/g, '').length >= 13 &&
             paymentData.expiryDate.length === 5 &&
             paymentData.cvv.length >= 3 &&
             paymentData.cardholderName.trim() !== '';
    }
    return true;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Payment Amount */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(amount)}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={cn(
              'p-4 border rounded-lg text-center transition-colors',
              paymentMethod === 'card' 
                ? 'border-blue-600 bg-blue-50 text-blue-700' 
                : 'border-gray-300 hover:bg-gray-50'
            )}
          >
            <CreditCard className="w-6 h-6 mx-auto mb-2" />
            Credit/Debit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={cn(
              'p-4 border rounded-lg text-center transition-colors',
              paymentMethod === 'paypal' 
                ? 'border-blue-600 bg-blue-50 text-blue-700' 
                : 'border-gray-300 hover:bg-gray-50'
            )}
          >
            PayPal
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('stripe')}
            className={cn(
              'p-4 border rounded-lg text-center transition-colors',
              paymentMethod === 'stripe' 
                ? 'border-blue-600 bg-blue-50 text-blue-700' 
                : 'border-gray-300 hover:bg-gray-50'
            )}
          >
            Stripe
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {paymentMethod === 'card' && (
          <>
            {/* Card Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={paymentData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input
                  type="text"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name *
              </label>
              <input
                type="text"
                value={paymentData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Billing Address */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={paymentData.billingAddress.street}
                    onChange={(e) => handleInputChange('billing.street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={paymentData.billingAddress.city}
                      onChange={(e) => handleInputChange('billing.city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={paymentData.billingAddress.zipCode}
                      onChange={(e) => handleInputChange('billing.zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {paymentMethod === 'paypal' && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
          </div>
        )}

        {paymentMethod === 'stripe' && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Stripe payment integration would be implemented here.</p>
          </div>
        )}

        {/* Security Notice */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 py-4">
          <Lock className="w-4 h-4" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isFormValid()}
          className={cn(
            'w-full py-3 px-4 rounded-md font-medium transition-colors',
            isLoading || !isFormValid()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {isLoading ? 'Processing...' : `Pay ${formatPrice(amount)}`}
        </button>
      </form>
    </div>
  );
}