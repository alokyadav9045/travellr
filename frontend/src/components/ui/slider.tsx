'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface SliderProps {
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  disabled?: boolean;
}

export function Slider({
  className,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue = [0, 100],
  onValueChange,
  onValueCommit,
  disabled,
  ...props
}: SliderProps) {
  const [localValue, setLocalValue] = React.useState<number[]>(value || defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : localValue;

  React.useEffect(() => {
    if (value) {
      setLocalValue(value);
    }
  }, [value]);

  const handleInputChange = (index: number, newValue: number) => {
    const nextValue = [...currentValue];
    nextValue[index] = Number(newValue);
    // Ensure min < max
    if (index === 0 && nextValue[0] > nextValue[1]) nextValue[0] = nextValue[1];
    if (index === 1 && nextValue[1] < nextValue[0]) nextValue[1] = nextValue[0];

    if (!isControlled) {
      setLocalValue(nextValue);
    }
    onValueChange?.(nextValue);
  };

  const handleCommit = () => {
    onValueCommit?.(currentValue);
  };

  return (
    <div className={cn('relative w-full h-6 flex items-center', className)}>
      {/* Track */}
      <div className="absolute w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {/* Fill */}
        <div
          className="absolute h-full bg-[#FF6B35]"
          style={{
            left: `${((currentValue[0] - min) / (max - min)) * 100}%`,
            width: `${((currentValue[1] - currentValue[0]) / (max - min)) * 100}%`,
          }}
        />
      </div>

      {/* Thumb 1 */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue[0]}
        onChange={(e) => handleInputChange(0, Number(e.target.value))}
        onMouseUp={handleCommit}
        onTouchEnd={handleCommit}
        disabled={disabled}
        className="absolute w-full h-2 appearance-none z-20 bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#FF6B35] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md"
      />

      {/* Thumb 2 */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue[1]}
        onChange={(e) => handleInputChange(1, Number(e.target.value))}
        onMouseUp={handleCommit}
        onTouchEnd={handleCommit}
        disabled={disabled}
        className="absolute w-full h-2 appearance-none z-20 bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#FF6B35] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-md"
      />
    </div>
  );
}