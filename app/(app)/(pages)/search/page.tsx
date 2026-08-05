"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookPreview } from "@/app/types/book";
import { FiSearch, FiArrowLeft } from "react-icons/fi";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { useSearchQuery, useSearchTypeQuery } from "@/app/services";
import { SearchResultType } from "@/app/types/search";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { PaginatedSearchResults } from "@/app/components/Search/PaginatedSearchResults";
import { MobileSearchField } from "@/app/components/Search/MobileSearchField";

const sortOptions = [
  { value: "-created_at", label: "Newest" },
  { value: "created_at", label: "Oldest" },
  { value: "title", label: "Title (A-Z)" },
  { value: "-title", label: "Title (Z-A)" },
] as const;

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = (searchParams.get("type") as SearchResultType) || "all";
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [sortBy, setSortBy] = useState<string>("-created_at");

  useEffect(() => {
    setPage(1);
  }, [query, sortBy, type]);

  const isGlobal = type === "all";
  const apiType = isGlobal ? "books" : (type as "books" | "folders" | "users");

  const commonParams = {
    q: query,
    page,
    limit: pageSize,
    sort_by: sortBy.startsWith("-") ? sortBy.substring(1) : sortBy,
    order: sortBy.startsWith("-") ? ("desc" as const) : ("asc" as const),
  };

  // 1. Global Search
  const {
    data: globalData,
    isLoading: isGlobalLoading,
    isFetching: isGlobalFetching,
  } = useSearchQuery(
    { ...commonParams, types: ["books", "folders", "users"] },
    { enabled: isGlobal },
  );

  // 2. Type-specific Search
  const {
    data: typeData,
    isLoading: isTypeLoading,
    isFetching: isTypeFetching,
  } = useSearchTypeQuery<any>(apiType, commonParams, { enabled: !isGlobal });

  const isLoading = isGlobal ? isGlobalLoading : isTypeLoading;
  const isFetching = isGlobal ? isGlobalFetching : isTypeFetching;

  // Process items and pagination
  let items: any[] = [];
  let totalResults = 0;
  let totalPages = 1;

  if (isGlobal && globalData) {
    items = [
      ...globalData.books.map((b) => ({ type: "books" as const, data: b })),
      ...globalData.folders.map((f) => ({ type: "folders" as const, data: f })),
      ...globalData.users.map((u) => ({ type: "users" as const, data: u })),
    ];
    totalResults =
      globalData.total_books +
      globalData.total_folders +
      globalData.total_users;

    const maxTotal = Math.max(
      globalData.total_books,
      globalData.total_folders,
      globalData.total_users,
    );
    totalPages = Math.ceil(maxTotal / pageSize);
  } else if (!isGlobal && typeData) {
    items = (typeData.items || []).map((item) => ({
      type: type as "books" | "folders" | "users",
      data: item,
    }));
    totalResults = typeData.total;
    totalPages = Math.ceil(totalResults / pageSize);
  }

  const handleTypeChange = (newType: string) => {
    const params = new URLSearchParams(searchParams);
    if (newType === "all") {
      params.delete("type");
    } else {
      params.set("type", newType);
    }
    router.push(`/search?${params.toString()}`);
  };

  if (!query) {
    return (
      <main className="flex-1 overflow-y-auto w-full bg-background">
        <div className="p-4 md:p-8">
          <MobileSearchField />
          <div className="flex flex-col items-center justify-center min-h-[40vh] lg:min-h-[60vh] text-center px-4">
            <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-6 border border-line-subtle">
              <FiSearch className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Search Shelf
            </h2>
            <p className="text-sm text-muted max-w-sm font-medium">
              Find books, folders, and users across the Shelf.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const tabs = [
    { id: "all", label: "All" },
    { id: "books", label: "Books" },
    { id: "folders", label: "Folders" },
    { id: "users", label: "Users" },
  ];

  return (
    <>
      <main className="flex-1 w-full bg-background min-h-full">
        <div className="p-4 md:p-8">
          <MobileSearchField />
          <div className="mb-4 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.back()}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-md transition-colors text-gray-500"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-line-subtle pb-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTypeChange(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap relative ${
                    type === tab.id
                      ? "text-foreground"
                      : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                  {type === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <SortFilter
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
                options={[...sortOptions]}
                labelPrefix="Sort by:"
              />
            </div>
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
            filterType={type}
            pageSize={pageSize}
          />
        </div>
      </main>

      <BookDetailPanel
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 bg-background animate-pulse" />
      }
    >
      <SearchContent />
    </Suspense>
  );
}
