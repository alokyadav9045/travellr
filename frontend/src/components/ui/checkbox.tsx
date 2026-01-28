'use client';

import * as React from 'react';
import { Check } from 'lucide-react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface CheckboxProps {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, id, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked || false);
    const currentChecked = checked !== undefined ? checked : internalChecked;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      if (checked === undefined) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };

    return (
      <div className="relative inline-flex items-center">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          checked={currentChecked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            'flex h-4 w-4 items-center justify-center rounded-sm border border-primary ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            currentChecked ? 'bg-primary text-primary-foreground' : 'bg-background',
            disabled && 'cursor-not-allowed opacity-50',
            !disabled && 'cursor-pointer',
            className
          )}
        >
          {currentChecked && <Check className="h-3 w-3" />}
        </label>
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };