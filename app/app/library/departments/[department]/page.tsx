"use client";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookCard } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { FiArrowLeft, FiFilter, FiSearch } from "react-icons/fi";
import {
  useGetDepartmentBySlugQuery,
  useGetBooksByDepartmentQuery,
} from "@/app/store/api/departmentsApi";
import { BookPreview } from "@/app/types/book";
import BookCardSkeleton from "@/app/components/Skeletons/BookCardSkeleton";
import { Pagination } from "@/app/components/Library/Pagination";

export default function DepartmentPage({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.department;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [sortBy, setSortBy] = useState<"createdAt" | "rating" | "title">(
    "createdAt",
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: department, isLoading: isLoadingDept } =
    useGetDepartmentBySlugQuery(slug);
  const {
    data: booksResponse,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useGetBooksByDepartmentQuery({
    slug,
    page,
    sort_by: sortBy,
    order: order,
    q: debouncedSearch,
  });

  const showSkeleton = isLoadingBooks || isFetchingBooks;

  const books = booksResponse?.items || [];

  if (isLoadingDept) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-neutral-900 min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-900 min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Department Not Found
        </h2>
        <button
          onClick={() => router.back()}
          className="text-emerald-600 font-bold hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 dark:bg-neutral-900 overflow-y-auto">
      <main className="p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <button
              onClick={() => router.push("/app/library/departments")}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white mb-6 transition-all group"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-bold uppercase tracking-widest text-xs">
                All Departments
              </span>
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest mb-2 block">
                  {department.faculty || "General Faculty"}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                  {department.name}
                </h1>
                <p className="text-gray-500 dark:text-neutral-400 text-lg max-w-2xl">
                  {department.description ||
                    `Browse through our curated collection of resources for ${department.name}.`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-3xl border border-gray-100 dark:border-neutral-700 shadow-sm text-center min-w-32">
                  <span className="block text-2xl font-black text-emerald-600">
                    {booksResponse?.total || 0}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Resources
                  </span>
                </div>
                {department.school && (
                  <div className="bg-white dark:bg-neutral-800 p-4 rounded-3xl border border-gray-100 dark:border-neutral-700 shadow-sm text-center min-w-32">
                    <span className="block text-xl font-black text-gray-900 dark:text-white">
                      {department.school.shortName || "Uni"}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Institution
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search within department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center space-x-3 bg-white dark:bg-neutral-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-700">
                <FiFilter className="w-5 h-5 text-emerald-600 ml-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 dark:text-neutral-200 pr-8"
                >
                  <option value="createdAt">Recently Added</option>
                  <option value="rating">Top Rated</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>

              <button
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                className="p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-gray-100 dark:border-neutral-700 shadow-sm text-gray-600 dark:text-neutral-400 hover:text-emerald-600 transition-colors"
              >
                {order === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          {showSkeleton ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <BookCardSkeleton count={10} />
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  coverImage={book.coverImage}
                  rating={book.rating}
                  donor={book.donor}
                  onClick={() => setSelectedBook(book as BookPreview)}
                  className="transform hover:-translate-y-2 transition-transform duration-300"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white dark:bg-neutral-800 rounded-[3rem] border border-gray-100 dark:border-neutral-700">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiSearch className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-neutral-400">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={booksResponse?.totalPages || 1}
            onPageChange={setPage}
            isLoading={isLoadingBooks}
            className="mt-16"
          />
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
