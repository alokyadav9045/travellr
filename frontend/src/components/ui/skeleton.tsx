import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  width = '100%',
  height = '20px'
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
    />
  );
}

interface SkeletonItemProps {
  count?: number;
  className?: string;
}

export function SkeletonItem({ count = 3, className = '' }: SkeletonItemProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} height="20px" />
      ))}
    </div>
  );
}
