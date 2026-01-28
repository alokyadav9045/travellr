'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  siblingCount?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  siblingCount = 1,
  className
}: PaginationProps) {
  // Generate page numbers to display
  const generatePageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // + 2 for dots

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', lastPageIndex];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }

    return [];
  };

  const pageNumbers = generatePageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={cn('flex items-center justify-center space-x-2', className)} aria-label="Pagination">
      {/* First Page */}
      {showFirstLast && currentPage > 1 && (
        <button
          onClick={() => onPageChange(1)}
          className="hidden sm:flex items-center justify-center w-8 h-8 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          aria-label="Go to first page"
        >
          First
        </button>
      )}

      {/* Previous Page */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center justify-center w-8 h-8 text-gray-500 rounded-md transition-colors',
            currentPage === 1
              ? 'cursor-not-allowed opacity-50'
              : 'hover:text-gray-700 hover:bg-gray-50'
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center w-8 h-8 text-gray-400"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const page = pageNumber as number;
          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'flex items-center justify-center w-8 h-8 text-sm rounded-md transition-colors',
                isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              )}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Page */}
      {showPrevNext && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center justify-center w-8 h-8 text-gray-500 rounded-md transition-colors',
            currentPage === totalPages
              ? 'cursor-not-allowed opacity-50'
              : 'hover:text-gray-700 hover:bg-gray-50'
          )}
          aria-label="Go to next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Last Page */}
      {showFirstLast && currentPage < totalPages && (
        <button
          onClick={() => onPageChange(totalPages)}
          className="hidden sm:flex items-center justify-center w-8 h-8 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          aria-label="Go to last page"
        >
          Last
        </button>
      )}
    </nav>
  );
}

// Additional component for showing page info
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={cn('text-sm text-gray-600', className)}>
      Showing {startItem.toLocaleString()}-{endItem.toLocaleString()} of{' '}
      {totalItems.toLocaleString()} results
    </div>
  );
}

// Combined pagination with info
interface PaginationWithInfoProps extends PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  showInfo?: boolean;
}

export function PaginationWithInfo({
  totalItems,
  itemsPerPage,
  showInfo = true,
  className,
  ...paginationProps
}: PaginationWithInfoProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0', className)}>
      {showInfo && (
        <PaginationInfo
          currentPage={paginationProps.currentPage}
          totalPages={paginationProps.totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      )}
      <Pagination {...paginationProps} />
    </div>
  );
}