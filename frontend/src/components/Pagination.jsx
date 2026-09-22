import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-1.5 py-8 text-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2 rounded-md border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const isActive = index === currentPage;
        return (
          <button
            key={index}
            onClick={() => onPageChange(index)}
            className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-neutral-900 text-white'
                : 'border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            {index + 1}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="p-2 rounded-md border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
