"use client";
import { useState } from "react";
import { BookCard } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import { FiFilter, FiBookOpen } from "react-icons/fi";
import { useGetBooksByDepartmentQuery } from "@/app/store/api/departmentsApi";
import BookCardSkeleton from "@/app/components/Skeletons/BookCardSkeleton";

interface UserDepartmentBooksProps {
  departmentSlug: string;
}

export default function UserDepartmentBooks({
  departmentSlug,
}: UserDepartmentBooksProps) {
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [sortBy, setSortBy] = useState<"createdAt" | "rating" | "title">(
    "createdAt",
  );
  const [page, setPage] = useState(1);

  const {
    data: booksResponse,
    isLoading,
    isFetching,
  } = useGetBooksByDepartmentQuery({
    slug: departmentSlug,
    page,
    sort_by: sortBy,
  });

  const showSkeleton = isLoading || isFetching;

  const books = booksResponse?.items || [];

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-gray-500 dark:text-neutral-400 text-sm">
            Quick access to your major's resources.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white dark:bg-neutral-800 px-4 py-2 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-700">
          <FiFilter className="w-4 h-4 text-emerald-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 dark:text-neutral-200 outline-none"
          >
            <option value="createdAt">New Arrivals</option>
            <option value="rating">Top Rated</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {showSkeleton ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <BookCardSkeleton count={5} />
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {books.map((book) => (
            <BookCard
              key={book.id}
              {...book}
              onClick={() => setSelectedBook(book as BookPreview)}
              className="hover:scale-[1.02] transition-transform"
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 p-16 rounded-[3rem] text-center border border-gray-100 dark:border-neutral-700">
          <FiBookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-neutral-400">
            No books added to your department yet.
          </p>
        </div>
      )}

      {selectedBook && (
        <BookDetailPanel
          book={selectedBook}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
