"use client";
import { useEffect, useState } from "react";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import { FiBookOpen } from "react-icons/fi";
import { useBooksByDepartment } from "@/app/services";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { PaginatedBookGrid } from "@/app/components/Library/PaginatedBookGrid";
import { useResponsiveLimit } from "@/app/hooks/useResponsiveLimit";

interface UserDepartmentBooksProps {
  departmentSlug: string;
  departmentName?: string;
}

export default function UserDepartmentBooks({
  departmentSlug,
  departmentName,
}: UserDepartmentBooksProps) {
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [sortBy, setSortBy] = useState<"createdAt" | "rating" | "title">(
    "createdAt",
  );
  const [page, setPage] = useState(1);
  const pageSize = useResponsiveLimit({ base: 2, md: 3, lg: 4, xl: 5 }, 2, 10);

  const {
    books,
    totalPages,
    isFetching,
  } = useBooksByDepartment(departmentSlug, {
    page,
    limit: pageSize,
    sort_by: sortBy,
  });

  useEffect(() => {
    setPage(1);
  }, [sortBy, departmentSlug, pageSize]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FiBookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {departmentName
              ? `Books in ${departmentName}`
              : "Department Books"}
          </h2>
        </div>
        <SortFilter
          value={sortBy}
          onValueChange={(val) =>
            setSortBy(val as "createdAt" | "rating" | "title")
          }
          options={[
            { value: "createdAt", label: "Recently Added" },
            { value: "rating", label: "Top Rated" },
            { value: "title", label: "Alphabetical" },
          ]}
        />
      </div>

      <PaginatedBookGrid
        books={books}
        isLoading={isFetching}
        totalPages={totalPages}
        currentPage={page}
        onPageChange={setPage}
        onBookClick={(book) => setSelectedBook(book)}
        pageSize={pageSize}
        emptyMessage="No books available in this department yet."
      />

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
