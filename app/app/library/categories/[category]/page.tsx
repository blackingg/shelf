"use client";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookCard } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiArrowLeft, FiFilter, FiSearch, FiLayers } from "react-icons/fi";
import { BookPreview } from "@/app/types/book";
import {
  useGetCategoryBySlugQuery,
  useGetBooksByCategoryQuery,
} from "@/app/store/api/categoriesApi";
import BookCardSkeleton from "@/app/components/Skeletons/BookCardSkeleton";
import { Pagination } from "@/app/components/Library/Pagination";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.category;
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

  const { data: category, isLoading: isLoadingCategory } =
    useGetCategoryBySlugQuery(slug);
  const {
    data: booksResponse,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useGetBooksByCategoryQuery({
    q: debouncedSearch,
    slug,
    page,
    pageSize,
    sort_by: sortBy,
    order: "desc",
  });

  const showSkeleton = isLoadingBooks || isFetchingBooks;

  const books = booksResponse?.items || [];
  const totalPages = booksResponse?.totalPages || 1;

  if (isLoadingCategory) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-neutral-900 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-neutral-900 overflow-y-auto">
      <main className="p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <button
              onClick={() => router.push("/app/library/categories")}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white mb-6 transition-all group"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold uppercase tracking-widest text-xs">
                All Categories
              </span>
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                  {category?.name || "Category"}
                </h1>
                <p className="text-gray-500 dark:text-neutral-400 text-lg max-w-2xl">
                  {category?.description ||
                    `Explore our extensive collection of ${category?.name || "resources"} curated by the community.`}
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-neutral-700 shadow-sm flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center">
                  <FiLayers className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="block text-2xl font-black text-gray-900 dark:text-white">
                    {booksResponse?.total || 0}
                  </span>
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">
                    Total Resources
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search in this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-neutral-800 px-4 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-700">
              <FiFilter className="text-emerald-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 dark:text-neutral-200 cursor-pointer"
              >
                <option value="createdAt">Recently Added</option>
                <option value="rating">Top Rated</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {showSkeleton ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
              <BookCardSkeleton count={pageSize} />
            </div>
          ) : books.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 transition-all duration-300">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    {...book}
                    onClick={() => setSelectedBook(book as BookPreview)}
                    className="hover:-translate-y-2 transition-transform duration-300"
                  />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                isLoading={isLoadingBooks}
                className="mt-12"
              />
            </>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-neutral-800 rounded-[3rem] border border-gray-100 dark:border-neutral-700">
              <FiSearch className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-neutral-400 text-lg">
                No resources found in this category.
              </p>
            </div>
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
