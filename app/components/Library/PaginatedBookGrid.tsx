"use client";

import React, { ReactNode } from "react";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import { Pagination } from "@/app/components/Library/Pagination";
import { BookPreview } from "@/app/types/book";
import { FiSearch } from "react-icons/fi";

interface PaginatedBookGridProps {
  books: BookPreview[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onBookClick: (book: BookPreview) => void;
  onBookEdit?: (book: BookPreview) => void;
  onBookDelete?: (book: BookPreview) => void;
  pageSize?: number;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  gridCols?: string;
  className?: string;
}

export const PaginatedBookGrid: React.FC<PaginatedBookGridProps> = ({
  books,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  onBookClick,
  onBookEdit,
  onBookDelete,
  pageSize = 10,
  emptyIcon,
  emptyTitle = "No results found",
  emptyMessage = "No resources found matching your criteria.",
  emptyAction,
  gridCols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  className = "",
}) => {
  return (
    <div className={className}>
      {isLoading ? (
        <div className={`grid ${gridCols} gap-6 md:gap-8`}>
          <BookCardSkeleton count={pageSize} />
        </div>
      ) : books.length > 0 ? (
        <div className={`grid ${gridCols} gap-6 md:gap-8`}>
          {books.map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onClick={() => onBookClick(book)}
              showActions={!!onBookEdit || !!onBookDelete}
              onEdit={() => onBookEdit?.(book)}
              onDelete={() => onBookDelete?.(book)}
            />
          ))}
        </div>
      ) : (
        <div className="h-[30vh] text-center py-32 bg-gray-50/30 dark:bg-neutral-900/10 rounded-md border border-dashed border-gray-200 dark:border-neutral-800 flex flex-col items-center justify-center">
          {emptyIcon || (
            <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-neutral-700/50">
              <FiSearch className="w-6 h-6 text-gray-300 dark:text-neutral-600" />
            </div>
          )}
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-1">
            {emptyTitle}
          </p>
          {emptyMessage && (
            <p className="text-xs text-gray-400 dark:text-neutral-500">
              {emptyMessage}
            </p>
          )}
          {emptyAction && <div className="mt-6">{emptyAction}</div>}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-12"
        />
      )}
    </div>
  );
};
