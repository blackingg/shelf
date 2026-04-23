"use client";

import React from "react";
import { SearchResultItem } from "@/app/types/search";
import { BookPreview } from "@/app/types/book";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import { FolderCard, FolderCardSkeleton } from "@/app/components/Folders/FolderCard";
import { ProfileCard, ProfileCardSkeleton } from "@/app/components/Search/ProfileCard";
import { SearchList } from "@/app/components/Search/SearchList";
import { Pagination } from "@/app/components/Library/Pagination";
import { FiSearch } from "react-icons/fi";

interface PaginatedSearchResultsProps {
  items: SearchResultItem[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  viewMode: "grid" | "list";
  onBookClick: (book: BookPreview) => void;
  onFolderClick: (slug: string) => void;
  onUserClick: (username: string) => void;
  filterType: string;
  pageSize?: number;
  className?: string;
}

export const PaginatedSearchResults: React.FC<PaginatedSearchResultsProps> = ({
  items,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  viewMode,
  onBookClick,
  onFolderClick,
  onUserClick,
  filterType,
  pageSize = 20,
  className = "",
}) => {
  const renderGridSkeleton = () => {
    if (filterType === "book") return <BookCardSkeleton count={pageSize / 2} />;
    if (filterType === "folder") return <FolderCardSkeleton count={pageSize / 2} />;
    if (filterType === "user") return <ProfileCardSkeleton count={pageSize / 2} />;

    return (
      <>
        <BookCardSkeleton count={4} />
        <FolderCardSkeleton count={3} />
        <ProfileCardSkeleton count={3} />
      </>
    );
  };

  const renderListSkeleton = () => (
    <div className="flex flex-col border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-4 px-6 border-b border-gray-50 dark:border-neutral-800/50 last:border-0"
        >
          <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700" />
          <div className="flex-1 h-4 bg-gray-100 dark:bg-neutral-800 rounded-sm" />
          <div className="hidden sm:block w-24 h-3 bg-gray-100 dark:bg-neutral-800 rounded-sm" />
        </div>
      ))}
    </div>
  );

  return (
    <div className={className}>
      {isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {renderGridSkeleton()}
          </div>
        ) : (
          renderListSkeleton()
        )
      ) : items.length > 0 ? (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
              {items.map((item, idx) => {
                if (item.type === "book") {
                  return (
                    <BookCard
                      key={`grid-book-${item.data.id}-${idx}`}
                      {...(item.data as BookPreview)}
                      onClick={() => onBookClick(item.data as BookPreview)}
                    />
                  );
                } else if (item.type === "folder") {
                  return (
                    <FolderCard
                      key={`grid-folder-${item.data.id}-${idx}`}
                      folder={item.data}
                      onClick={() => onFolderClick(item.data.slug)}
                      showActions={true}
                    />
                  );
                } else if (item.type === "user") {
                  return (
                    <ProfileCard
                      key={`grid-user-${item.data.id}-${idx}`}
                      user={item.data}
                      onClick={() => onUserClick(item.data.username)}
                    />
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden">
              <SearchList
                items={items}
                onBookClick={(item) => onBookClick(item.data as BookPreview)}
                onFolderClick={onFolderClick}
                onUserClick={onUserClick}
              />
            </div>
          )}
        </>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 dark:bg-neutral-900/40 rounded-lg border border-dashed border-gray-200 dark:border-neutral-800">
          <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-6 border border-gray-100 dark:border-neutral-800">
            <FiSearch className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Results Found</h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-sm font-medium">
            No matches were found for your search. Try adjusting your filters or search terms.
          </p>
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
