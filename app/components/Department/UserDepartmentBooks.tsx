"use client";
import { useState } from "react";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import { FiBookOpen } from "react-icons/fi";
import { useGetBooksByDepartmentQuery } from "@/app/store/api/departmentsApi";
import { SortFilter } from "@/app/components/Library/SortFilter";

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
    limit: 10,
    sort_by: sortBy,
  });

  const showSkeleton = isLoading || isFetching;
  const books = booksResponse?.items || [];

  const sortOptions = [
    { value: "createdAt", label: "New Arrivals" },
    { value: "rating", label: "Top Rated" },
    { value: "title", label: "Alphabetical" },
  ];

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-6">
        <div>
          <p className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
            Quick access to your Course's resources
          </p>
        </div>

        <SortFilter
          value={sortBy}
          onValueChange={(val) => setSortBy(val as any)}
          options={sortOptions}
        />
      </div>

      {showSkeleton ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <BookCardSkeleton count={10} />
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
        <div className="min-h-144 md:min-h-176 flex flex-col items-center justify-center bg-gray-50/30 dark:bg-neutral-900/10 p-20 rounded-md text-center border border-gray-100 dark:border-neutral-800/50">
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
