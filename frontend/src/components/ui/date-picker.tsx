'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Input } from './input';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface DatePickerProps {
  className?: string;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ className, date, onDateChange, placeholder = 'Pick a date', disabled, ...props }, ref) => {
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) {
        onDateChange?.(new Date(value));
      } else {
        onDateChange?.(undefined);
      }
    };

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <Input
          type="date"
          value={date ? date.toISOString().split('T')[0] : ''}
          onChange={handleDateChange}
          disabled={disabled}
          className="pl-10"
          placeholder={placeholder}
        />
        <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    );
  }
);
DatePicker.displayName = 'DatePicker';

export { DatePicker };