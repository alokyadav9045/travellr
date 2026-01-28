'use client';

import * as React from 'react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SwitchProps {
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
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
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            currentChecked ? 'bg-primary' : 'bg-input',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            className
          )}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out',
              currentChecked ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </label>
      </div>
    );
  }
);
Switch.displayName = 'Switch';

export { Switch };