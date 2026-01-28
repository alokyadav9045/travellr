'use client';

import React from 'react';
import { Check } from 'lucide-react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface CheckoutStepsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { number: 1, title: 'Trip Details', description: 'Review your trip' },
  { number: 2, title: 'Guest Details', description: 'Enter guest information' },
  { number: 3, title: 'Payment', description: 'Complete payment' },
  { number: 4, title: 'Confirmation', description: 'Booking confirmed' }
];

export default function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <button
                onClick={() => onStepClick?.(step.number)}
                disabled={step.number > currentStep}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold',
                  step.number === currentStep
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : step.number < currentStep
                    ? 'border-green-600 bg-green-600 text-white'
                    : 'border-gray-300 bg-white text-gray-500',
                  onStepClick && step.number <= currentStep && 'cursor-pointer hover:opacity-80',
                  !onStepClick || step.number > currentStep ? 'cursor-not-allowed' : ''
                )}
              >
                {step.number < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </button>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    'text-sm font-medium',
                    step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4 -mt-5',
                  step.number < currentStep ? 'bg-green-600' : 'bg-gray-300'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}