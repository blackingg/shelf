"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookPreview } from "@/app/types/book";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { useGetBooksQuery } from "@/app/services";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { PaginatedSearchResults } from "@/app/components/Search/PaginatedSearchResults";

const sortOptions = [
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "title", label: "Title (A-Z)" },
  { value: "-title", label: "Title (Z-A)" },
] as const;

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortBy, setSortBy] = useState<string>("-created_at");

  useEffect(() => {
    setPage(1);
  }, [query, sortBy]);

  const {
    data: booksResponse,
    isLoading,
    isFetching,
  } = useGetBooksQuery({ query, page, limit: pageSize, ordering: sortBy });

  const items = (booksResponse?.items || []).map((book: any) => ({
    type: "book" as const,
    data: book,
  }));
  const totalPages = booksResponse?.totalPages || 1;
  const totalResults = booksResponse?.total || 0;

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
              Find books across the Shelf.
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
                  ? "Searching library..."
                  : `Located ${totalResults} ${totalResults === 1 ? "match" : "matches"} for "${query}"`}
              </p>
            </div>
          </div>

          <div className="mb-8 flex justify-end">
            <SortFilter
              value={sortBy}
              onValueChange={(value) => setSortBy(value)}
              options={[...sortOptions]}
              labelPrefix="Sort by:"
            />
          </div>

          <PaginatedSearchResults
            items={items}
            isLoading={isFetching}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
            onBookClick={(book) => setSelectedBook(book)}
            onFolderClick={(slug) => router.push(`/folders/${slug}`)}
            onUserClick={(username) => router.push(`/profile/${username}`)}
            filterType="book"
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
