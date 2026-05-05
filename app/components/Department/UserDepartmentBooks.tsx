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
  departmentSlug: string | null;
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

  const { books, totalPages, isFetching } = useBooksByDepartment(
    departmentSlug,
    {
      page,
      limit: pageSize,
      sort_by: sortBy,
    },
  );

  useEffect(() => {
    setPage(1);
  }, [sortBy, departmentSlug, pageSize]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <FiBookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {departmentName ? `Books in ${departmentName}` : "Department Books"}
          </h2>
        </div>
        <div className="w-full lg:w-auto">
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
            className="w-full lg:w-auto"
          />
        </div>
      </div>

      <PaginatedBookGrid
        books={books}
        isLoading={isFetching || !departmentSlug}
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
