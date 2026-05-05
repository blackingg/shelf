"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookPreview } from "@/app/types/book";
import { FiSearch, FiArrowLeft, FiGrid, FiList } from "react-icons/fi";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { useSearchQuery } from "@/app/services";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { PaginatedSearchResults } from "@/app/components/Search/PaginatedSearchResults";

const searchTypeOptions = [
  { value: "all", label: "All" },
  { value: "book", label: "Books" },
  { value: "folder", label: "Folders" },
  { value: "user", label: "Users" },
] as const;

type SearchFilterType = (typeof searchTypeOptions)[number]["value"];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [filterType, setFilterType] = useState<SearchFilterType>("all");
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
      limit: pageSize,
      type: filterType === "all" ? undefined : filterType,
    },
    { enabled: !!query },
  );

  const items = searchResponse?.items || [];
  const totalPages = searchResponse?.totalPages || 1;
  const totalResults = searchResponse?.total || 0;

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
              Find resources, scholars, and folders across the library.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="flex-1 w-full bg-white dark:bg-neutral-900 min-h-full">
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

          <div className="mb-8 flex justify-end">
            <SortFilter
              value={filterType}
              onValueChange={(value) =>
                setFilterType(value as SearchFilterType)
              }
              options={[...searchTypeOptions]}
              labelPrefix="Filter:"
            />
          </div>

          <PaginatedSearchResults
            items={items}
            isLoading={isFetching}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
            viewMode={viewMode}
            onBookClick={(book) => setSelectedBook(book)}
            onFolderClick={(slug) => router.push(`/folders/${slug}`)}
            onUserClick={(username) => router.push(`/profile/${username}`)}
            filterType={filterType}
            pageSize={pageSize}
          />
        </div>
      </main>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
