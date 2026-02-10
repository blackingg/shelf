"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BookCard } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { useRouter } from "next/navigation";
import { BookPreview } from "@/app/types/book";
import { FiSearch, FiArrowLeft, FiFilter } from "react-icons/fi";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { useSearchQuery } from "@/app/store/api/searchApi";
import { Pagination } from "@/app/components/Library/Pagination";
import BookCardSkeleton from "@/app/components/Skeletons/BookCardSkeleton";
import FolderCardSkeleton from "@/app/components/Skeletons/FolderCardSkeleton";
import { SearchResultItem } from "@/app/types/search";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filterType, setFilterType] = useState<"all" | "book" | "folder">(
    "all",
  );

  useEffect(() => {
    setPage(1);
  }, [query, filterType]);

  const {
    data: searchResponse,
    isLoading,
    isFetching,
  } = useSearchQuery(
    {
      q: query,
      page,
      pageSize,
      type: filterType === "all" ? undefined : filterType,
    },
    { skip: !query },
  );

  const items = searchResponse?.items || [];
  const totalPages = searchResponse?.totalPages || 1;
  const totalResults = searchResponse?.total || 0;

  const handleBookClick = (book: BookPreview) => {
    setSelectedBook(book);
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/app/folders/${folderId}`);
  };

  if (!query) {
    return (
      <main className="flex-1 overflow-y-auto w-full bg-white dark:bg-neutral-900">
        <div className="p-4 md:p-8 pb-0">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-600 dark:text-neutral-400"
              title="Go back"
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Search
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
            <FiSearch className="w-12 h-12 text-gray-400 dark:text-neutral-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Search Shelf
          </h2>
          <p className="text-gray-500 dark:text-neutral-400 max-w-sm">
            Enter a search term to find books, authors, and folders on Shelf.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto w-full bg-white dark:bg-neutral-900">
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-600 dark:text-neutral-400"
                title="Go back"
              >
                <FiArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Search Results
              </h1>
            </div>
            <p className="text-gray-500 dark:text-neutral-400 ml-10">
              {isLoading
                ? "Searching..."
                : `Found ${totalResults} ${totalResults === 1 ? "result" : "results"} for "${query}"`}
            </p>
          </div>

          {/* Filter Bar */}
          {!isLoading && !isFetching && items.length > 0 && (
            <div className="flex justify-end mb-6">
              <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-neutral-700">
                <FiFilter className="text-gray-500 dark:text-neutral-400 w-4 h-4" />
                <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                  Type
                </span>
                <select
                  value={filterType}
                  onChange={(e) =>
                    setFilterType(e.target.value as "all" | "book" | "folder")
                  }
                  className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 dark:text-neutral-200 cursor-pointer pr-8"
                >
                  <option value="all">All</option>
                  <option value="book">Books</option>
                  <option value="folder">Folders</option>
                </select>
              </div>
            </div>
          )}

          {isLoading || isFetching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              <div className="contents">
                <BookCardSkeleton count={5} />
                <FolderCardSkeleton count={5} />
              </div>
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {items.map((item: SearchResultItem, idx: number) => {
                  if (item.type === "book") {
                    return (
                      <BookCard
                        key={`book-${item.data.id}-${idx}`}
                        {...item.data}
                        onClick={() =>
                          handleBookClick(item.data as BookPreview)
                        }
                      />
                    );
                  } else if (item.type === "folder") {
                    return (
                      <FolderCard
                        key={`folder-${item.data.id}-${idx}`}
                        folder={item.data}
                        onClick={() => handleFolderClick(item.data.id)}
                      />
                    );
                  }
                  return null;
                })}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                isLoading={isFetching}
                className="mt-8"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
              <div className="w-24 h-24 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                <FiSearch className="w-12 h-12 text-gray-400 dark:text-neutral-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No results found
              </h2>
              <p className="text-gray-500 dark:text-neutral-400 max-w-sm">
                We couldn&apos;t find any results for &quot;{query}&quot;. Try
                checking for typos or searching for something else.
              </p>
            </div>
          )}
        </div>
      </main>

      {selectedBook && (
        <BookDetailPanel
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 overflow-y-auto w-full bg-white dark:bg-neutral-900">
          <div className="p-4 md:p-8 animate-pulse">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-800 rounded-full" />
              <div className="h-8 w-64 bg-gray-200 dark:bg-neutral-800 rounded" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              <BookCardSkeleton count={6} />
            </div>
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
