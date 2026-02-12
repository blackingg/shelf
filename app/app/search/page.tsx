"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookPreview } from "@/app/types/book";
import { FiSearch, FiArrowLeft, FiGrid, FiList } from "react-icons/fi";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { useSearchQuery } from "@/app/store/api/searchApi";
import { Pagination } from "@/app/components/Library/Pagination";
import { SearchResultItem } from "@/app/types/search";
import { SearchList } from "@/app/components/Search/SearchList";
import { SearchFilters } from "@/app/components/Search/SearchFilters";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  const handleFolderClick = (slug: string) => {
    router.push(`/app/folders/${slug}`);
  };

  if (!query) {
    return (
      <main className="flex-1 overflow-y-auto w-full bg-white dark:bg-neutral-900">
        <div className="p-4 md:p-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-6 border border-gray-100 dark:border-neutral-800">
              <FiSearch className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Search Shelf
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-sm font-medium">
              Find resources, scholars, and collections across the library.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 overflow-y-auto w-full bg-white dark:bg-neutral-900">
        <div className="p-4 md:p-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.back()}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors text-gray-500"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Search Results
                </h1>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 ml-10">
                {isLoading
                  ? "Scanning..."
                  : `Located ${totalResults} ${totalResults === 1 ? "match" : "matches"} for "${query}"`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-50 dark:bg-neutral-800/50 p-1 rounded-md border border-gray-100 dark:border-neutral-800">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-neutral-700 text-emerald-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-neutral-700 text-emerald-600 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <SearchFilters
              value={filterType}
              onChange={setFilterType}
            />
          </div>

          {isLoading || isFetching ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                  : "flex flex-col border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden"
              }
            >
              {viewMode === "grid" ? (
                <BookCardSkeleton count={10} />
              ) : (
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 py-4 px-6 animate-pulse border-b border-gray-50 dark:border-neutral-800/50 last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700" />
                    <div className="flex-1 h-4 bg-gray-100 dark:bg-neutral-800 rounded-sm" />
                    <div className="hidden sm:block w-24 h-3 bg-gray-100 dark:bg-neutral-800 rounded-sm" />
                  </div>
                ))
              )}
            </div>
          ) : items.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                  {items.map((item: SearchResultItem, idx: number) => {
                    if (item.type === "book") {
                      return (
                        <BookCard
                          key={`grid-book-${item.data.id}-${idx}`}
                          {...(item.data as BookPreview)}
                          onClick={() =>
                            handleBookClick(item.data as BookPreview)
                          }
                        />
                      );
                    } else if (item.type === "folder") {
                      return (
                        <FolderCard
                          key={`grid-folder-${item.data.id}-${idx}`}
                          folder={item.data}
                          onClick={() => handleFolderClick(item.data.slug)}
                        />
                      );
                    } else {
                      // user
                      return (
                        <div
                          key={`grid-user-${item.data.id}-${idx}`}
                          onClick={() =>
                            router.push(`/app/profile/${item.data.username}`)
                          }
                          className="flex flex-col items-center p-4 rounded-md border border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                        >
                          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold mb-3">
                            {item.data.username[0].toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate w-full text-center">
                            @{item.data.username}
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden">
                  <SearchList
                    items={items}
                    onBookClick={(item: SearchResultItem) =>
                      handleBookClick(item.data as BookPreview)
                    }
                    onFolderClick={handleFolderClick}
                    onUserClick={(username) =>
                      router.push(`/app/profile/${username}`)
                    }
                  />
                </div>
              )}

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                isLoading={isFetching}
                className="mt-12"
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
              <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-6 border border-gray-100 dark:border-neutral-800">
                <FiSearch className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No results found
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-sm font-medium font-medium leading-relaxed">
                We couldn&apos;t find any matches for &quot;{query}&quot;. Try
                broadening your keywords.
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
            <div className="flex items-center gap-4 mb-6">
              <div className="w-9 h-9 bg-gray-100 dark:bg-neutral-800 rounded-md" />
              <div className="h-5 w-40 bg-gray-100 dark:bg-neutral-800 rounded" />
            </div>
            <div className="flex flex-col gap-0 border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-4 px-6 border-b border-gray-50 dark:border-neutral-800/50 last:border-0"
                >
                  <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-700" />
                  <div className="flex-1 h-4 bg-gray-100 dark:bg-neutral-800 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
