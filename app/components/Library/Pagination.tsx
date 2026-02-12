"use client";

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div
      className={`flex items-center justify-center space-x-2 py-8 ${className}`}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="p-2 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-500 dark:text-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-500 hover:text-emerald-600 transition-colors duration-200"
        aria-label="Previous page"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center space-x-2">
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 hover:border-emerald-500 hover:text-emerald-600 transition-colors duration-200 text-sm font-medium"
            >
              1
            </button>
            {pages[0] > 2 && (
              <span className="text-gray-400 dark:text-neutral-600 px-1">
                ...
              </span>
            )}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            className={`w-10 h-10 rounded-md text-sm font-medium transition-colors duration-200 border ${
              currentPage === page
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 hover:border-emerald-500 hover:text-emerald-600"
            }`}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="text-gray-400 dark:text-neutral-600 px-1">
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="w-10 h-10 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 hover:border-emerald-500 hover:text-emerald-600 transition-colors duration-200 text-sm font-medium"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className="p-2 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-500 dark:text-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-500 hover:text-emerald-600 transition-colors duration-200"
        aria-label="Next page"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
