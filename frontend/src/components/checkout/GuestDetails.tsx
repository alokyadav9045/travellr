'use client';

import React from 'react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface GuestDetailsProps {
  guestCount: number;
  onGuestCountChange: (count: number) => void;
  leadGuestDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onLeadGuestChange: (details: any) => void;
}

export default function GuestDetails({ 
  guestCount, 
  onGuestCountChange, 
  leadGuestDetails, 
  onLeadGuestChange 
}: GuestDetailsProps) {
  const handleInputChange = (field: string, value: string) => {
    onLeadGuestChange({
      ...leadGuestDetails,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest Details</h2>
      
      {/* Guest Count */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Guests
        </label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onGuestCountChange(Math.max(1, guestCount - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={guestCount <= 1}
          >
            -
          </button>
          <span className="text-lg font-semibold min-w-[2rem] text-center">
            {guestCount}
          </span>
          <button
            onClick={() => onGuestCountChange(guestCount + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* Lead Guest Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Lead Guest Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              value={leadGuestDetails?.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter first name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              value={leadGuestDetails?.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter last name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={leadGuestDetails?.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={leadGuestDetails?.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>
        </div>

        {guestCount > 1 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-700">
              Additional guest details will be collected after payment confirmation.
              You can add guest names and information in your booking management area.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}