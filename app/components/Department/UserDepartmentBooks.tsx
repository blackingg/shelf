"use client";
import { useEffect, useState } from "react";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import { useBooksByDepartment } from "@/app/services";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { PaginatedBookGrid } from "@/app/components/Library/PaginatedBookGrid";
import { useDebounce, useResponsiveLimit } from "@/app/hooks";
import { FiBookOpen, FiSearch } from "react-icons/fi";

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
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [page, setPage] = useState(1);
  const pageSize = useResponsiveLimit({ base: 2, md: 3, lg: 4, xl: 5 }, 2, 10);

  const { books, totalPages, isFetching } = useBooksByDepartment(
    departmentSlug,
    {
      q: debouncedSearch,
      page,
      limit: pageSize,
      sort_by: sortBy,
      order,
    },
  );

  useEffect(() => {
    setPage(1);
  }, [sortBy, order, departmentSlug, pageSize, debouncedSearch]);

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-md shrink-0">
            <FiBookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tighter">
            {departmentName ? `Books in ${departmentName}` : "Department Books"}
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
        <div className="relative w-full md:w-96 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Search within department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/30 dark:bg-neutral-900/40 border border-transparent focus:border-emerald-500/30 rounded-md outline-none text-gray-900 dark:text-white transition-all text-sm font-medium tracking-tight"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
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
          <button
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
            className="p-3 bg-gray-50/50 dark:bg-neutral-900/40 rounded-md border border-gray-100 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-500 transition-colors h-[42px] flex items-center justify-center min-w-[42px]"
            title={order === "asc" ? "Ascending" : "Descending"}
          >
            <span className="text-sm font-bold">
              {order === "asc" ? "↑" : "↓"}
            </span>
          </button>
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
        emptyMessage="No resources found matching your search."
      />

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </div>
  );
}
