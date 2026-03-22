"use client";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import CategorySkeleton from "@/app/components/Skeletons/CategorySkeleton";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BackButton } from "@/app/components/Layout/BackButton";
import { FiFilter, FiSearch, FiLayers } from "react-icons/fi";
import { BookPreview } from "@/app/types/book";
import { useGetBooksByCategoryQuery } from "@/app/store/api/categoriesApi";
import { Pagination } from "@/app/components/Library/Pagination";
import { SortFilter } from "@/app/components/Library/SortFilter";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.category;
  const isAllCategory = slug === "all";
  const router = useRouter();

  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("rating");
  const pageSize = 15;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const booksQueryParams = {
    slug,
    q: debouncedSearch,
    page,
    pageSize,
    sort_by: sortBy as any,
    order: "desc" as const,
  };
  const {
    data: booksResponse,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useGetBooksByCategoryQuery(booksQueryParams);

  const categoryView =
    booksResponse?.category ||
    (isAllCategory
      ? {
          name: "All Categories",
          description: "Explore our full collection across every category.",
        }
      : null);

  const isLoadingCategory = isLoadingBooks;
  const showSkeleton = isLoadingBooks || isFetchingBooks;

  const books = booksResponse?.books?.items || [];
  const totalPages = booksResponse?.books?.totalPages || 1;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <BackButton />
          </div>

          {isLoadingCategory ? (
            <div className="">
              <CategorySkeleton />
            </div>
          ) : !categoryView ? (
            <div className="text-center py-32 bg-gray-50/30 dark:bg-neutral-900/10 rounded-md border border-dashed border-gray-200 dark:border-neutral-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Category Not Found
              </h2>
              <p className="text-gray-500 dark:text-neutral-500 mb-8 max-w-md mx-auto">
                The category you&apos;re looking for doesn&apos;t exist or has
                been removed from our system.
              </p>
              <button
                onClick={() => router.push("/app/discover")}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-colors"
              >
                Explore Library
              </button>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                  <div className="max-w-3xl">
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] mb-4">
                      Community Library
                    </p>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight text-balance">
                      {categoryView.name}
                    </h1>
                    <p className="text-gray-500 dark:text-neutral-500 text-lg font-medium leading-relaxed max-w-2xl">
                      {categoryView.description ||
                        `Explore our extensive collection of community-curated resources for ${categoryView.name}.`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-neutral-900/40 p-5 rounded-md border border-gray-100 dark:border-neutral-800/50 min-w-[200px]">
                    <div className="w-12 h-12 rounded-md bg-white dark:bg-neutral-800 flex items-center justify-center border border-gray-100 dark:border-neutral-700/50 shadow-sm">
                      <FiLayers className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div>
                      <span className="block text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                        {booksResponse?.books?.total || 0}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-gray-400 dark:text-neutral-600 tracking-widest">
                        Resources
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 mb-16">
                <div className="relative w-full md:w-96 group">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white transition-all text-sm font-bold tracking-tight"
                  />
                </div>

                <SortFilter
                  value={sortBy}
                  onValueChange={setSortBy}
                  options={[
                    { value: "rating", label: "Top Rated" },
                    { value: "createdAt", label: "Recently Added" },
                    { value: "title", label: "Alphabetical" },
                  ]}
                />
              </div>

              {showSkeleton ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  <BookCardSkeleton count={pageSize} />
                </div>
              ) : books.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {books.map((book) => (
                      <BookCard
                        key={book.id}
                        {...book}
                        onClick={() => setSelectedBook(book as BookPreview)}
                      />
                    ))}
                  </div>

                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    isLoading={isLoadingBooks}
                    className="mt-20"
                  />
                </>
              ) : (
                <div className="h-[30vh] text-center py-32 bg-gray-50/30 dark:bg-neutral-900/10 rounded-md border border-dashed border-gray-200 dark:border-neutral-800">
                  <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-neutral-700/50">
                    <FiSearch className="w-6 h-6 text-gray-300 dark:text-neutral-600" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                    No resources found matching your search.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
