"use client";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import DepartmentSkeleton from "@/app/components/Skeletons/DepartmentSkeleton";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BackButton } from "@/app/components/Layout/BackButton";
import { FiSearch } from "react-icons/fi";
import { useBooksByDepartment, useDepartmentBySlug } from "@/app/services";
import { BookPreview } from "@/app/types/book";
import { PaginatedBookGrid } from "@/app/components/Library/PaginatedBookGrid";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { useResponsiveLimit } from "@/app/hooks/useResponsiveLimit";

export default function DepartmentClient({
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
  const pageSize = useResponsiveLimit({ base: 2, md: 4, lg: 5 }, 3, 15);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [sortBy, order, slug]);

  const { department, isLoading: isLoadingDept } = useDepartmentBySlug(slug);
  const {
    books,
    totalPages,
    total: totalBooks,
    isFetching: isFetchingBooks,
  } = useBooksByDepartment(slug, {
    page,
    limit: pageSize,
    sort_by: sortBy,
    order: order,
    q: debouncedSearch,
  });

  return (
    <div className="flex-1 flex flex-col">
      <main className="p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <BackButton />
          </div>

          {isLoadingDept ? (
            <div className="">
              <DepartmentSkeleton />
            </div>
          ) : !department ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50/30 dark:bg-neutral-900/10 rounded-md border border-dashed border-gray-200 dark:border-neutral-800 text-center p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Department Not Found
              </h2>
              <p className="text-gray-500 dark:text-neutral-500 mb-8 max-w-md mx-auto">
                The department you&apos;re looking for doesn&apos;t exist or has
                been removed from our system.
              </p>
              <button
                onClick={() => router.push("/app/library/departments")}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-colors"
              >
                Browse Departments
              </button>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                  <div className="max-w-3xl">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">
                      {department.faculty}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight text-balance">
                      {department.name}
                    </h1>
                    <p className="text-gray-500 dark:text-neutral-500 text-lg font-medium leading-relaxed max-w-2xl">
                      {department.description ||
                        `Browse through our curated collection of resources for ${department.name}.`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-gray-50/50 dark:bg-neutral-900/40 p-5 rounded-md border border-gray-100 dark:border-neutral-800/50 text-center min-w-32">
                      <span className="block text-3xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter">
                        {totalBooks || 0}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-600 uppercase tracking-widest">
                        Resources
                      </span>
                    </div>
                    {department.school && (
                      <div className="bg-gray-50/50 dark:bg-neutral-900/40 p-5 rounded-md border border-gray-100 dark:border-neutral-800/50 text-center min-w-32">
                        <span className="block text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                          {department.school.shortName}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-neutral-600 uppercase tracking-widest">
                          Institution
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                <div className="relative w-full md:w-96 group">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search within department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white transition-all text-sm font-bold tracking-tight"
                  />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <SortFilter
                    value={sortBy}
                    onValueChange={(val) => setSortBy(val as any)}
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
                    <span className="text-sm font-black">
                      {order === "asc" ? "↑" : "↓"}
                    </span>
                  </button>
                </div>
              </div>

              <PaginatedBookGrid
                books={books}
                isLoading={isFetchingBooks}
                totalPages={totalPages}
                currentPage={page}
                onPageChange={setPage}
                onBookClick={(book) => setSelectedBook(book)}
                pageSize={pageSize}
                emptyMessage="No resources found matching your search."
              />
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
