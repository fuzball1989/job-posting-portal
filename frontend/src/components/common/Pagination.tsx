import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNext,
  hasPrev,
  maxVisiblePages = 7,
}) => {
  // Generate array of page numbers to display
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      const startPage = Math.max(2, currentPage - 2);
      const endPage = Math.min(totalPages - 1, currentPage + 2);
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  const PageButton: React.FC<{
    page: number | string;
    isActive?: boolean;
    disabled?: boolean;
    onClick?: () => void;
  }> = ({ page, isActive = false, disabled = false, onClick }) => {
    const baseClasses = "relative inline-flex items-center px-4 py-2 text-sm font-medium transition-colors";
    const activeClasses = "z-10 bg-blue-600 text-white focus:z-20";
    const inactiveClasses = "bg-white text-gray-500 hover:bg-gray-50 focus:z-20";
    const disabledClasses = "bg-white text-gray-300 cursor-not-allowed";
    
    const classes = `${baseClasses} ${
      isActive ? activeClasses : disabled ? disabledClasses : inactiveClasses
    } border border-gray-300`;
    
    if (typeof page === 'string') {
      return (
        <span className={`${baseClasses} bg-white text-gray-500 border border-gray-300 cursor-default`}>
          {page}
        </span>
      );
    }
    
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={classes}
        aria-current={isActive ? 'page' : undefined}
      >
        {page}
      </button>
    );
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      {/* Mobile pagination info */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      
      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page{' '}
            <span className="font-medium">{currentPage}</span>{' '}
            of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* Previous button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!hasPrev}
              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {/* Page numbers */}
            {visiblePages.map((page, index) => (
              <PageButton
                key={index}
                page={page}
                isActive={page === currentPage}
                onClick={typeof page === 'number' ? () => onPageChange(page) : undefined}
              />
            ))}
            
            {/* Next button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!hasNext}
              className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-gray-400 hover:bg-gray-50 focus:z-20 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;