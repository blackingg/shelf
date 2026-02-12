"use client";
import { useState } from "react";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import { FiFilter, FiBookOpen } from "react-icons/fi";
import { useGetBooksByDepartmentQuery } from "@/app/store/api/departmentsApi";

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
      <div className="flex items-center justify-between mb-10 flex-wrap gap-6">
        <div>
          <p className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
            Quick access to your Course's resources
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50/50 dark:bg-neutral-900/40 px-4 py-2 rounded-md border border-gray-100 dark:border-neutral-800 transition-colors">
          <FiFilter className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent border-none focus:ring-0 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-neutral-500 cursor-pointer outline-none"
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
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50/30 dark:bg-neutral-900/10 p-20 rounded-md text-center border border-gray-100 dark:border-neutral-800/50">
          <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-neutral-700/50">
            <FiBookOpen className="w-6 h-6 text-gray-300 dark:text-neutral-600" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
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
