"use client";
import { useEffect, useState } from "react";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import { useBooksByDepartment } from "@/app/services";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { PaginatedBookGrid } from "@/app/components/Library/PaginatedBookGrid";
import { useDebounce, useResponsiveLimit } from "@/app/hooks";
import { FiSearch } from "react-icons/fi";
import { FaBuilding } from "react-icons/fa6";
import { useDepartmentColor } from "@/app/helpers/colors";

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
  const departmentIconColor = useDepartmentColor(departmentSlug);

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
          <div className="w-8 h-8 shrink-0 rounded-md border border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800/70 flex items-center justify-center">
            <FaBuilding className={`w-3.5 h-3.5 ${departmentIconColor}`} />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
            {departmentName ? `Books in ${departmentName}` : "Department Books"}
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
        <div className="relative w-full md:w-96 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search within department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/30 dark:bg-neutral-900/40 border border-transparent focus:border-primary/30 rounded-md outline-none text-gray-900 dark:text-white transition-all text-sm font-medium tracking-tight"
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
            className="p-3 bg-gray-50/50 dark:bg-neutral-900/40 rounded-md border border-gray-100 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 hover:text-primary transition-colors h-[42px] flex items-center justify-center min-w-[42px]"
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
