"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FolderCard,
  FolderCardSkeleton,
} from "@/app/components/Folders/FolderCard";
import { BackButton } from "@/app/components/Layout/BackButton";
import { FiSearch, FiFolder } from "react-icons/fi";
import { useGetPublicFoldersQuery } from "@/app/store/api/foldersApi";
import { Pagination } from "@/app/components/Library/Pagination";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { FolderSortBy, SortOrder } from "@/app/types/common";

export default function DiscoverFoldersPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "createdAt" | "booksCount" | "bookmarksCount"
  >("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");
  const pageSize = 8;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: foldersResponse,
    isLoading,
    isFetching,
  } = useGetPublicFoldersQuery({
    page,
    pageSize,
    sort_by: sortBy as any,
    order,
    q: debouncedSearch,
  });

  const showSkeleton = isLoading || isFetching;

  const folders = foldersResponse?.items || [];
  const visibleFolders = folders.slice(0, pageSize);
  const totalPages = foldersResponse?.totalPages || 1;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <BackButton
              label="Back to Discover"
              href="/app/discover"
            />
          </div>

          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="max-w-3xl">
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] mb-4">
                  Community Library
                </p>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight text-balance">
                  Public Folders
                </h1>
                <p className="text-gray-500 dark:text-neutral-500 text-lg font-medium leading-relaxed max-w-2xl">
                  Explore curated reading lists, study guides, and collections
                  shared by the community.
                </p>
              </div>

              <div className="flex items-center gap-4 bg-gray-50/50 dark:bg-neutral-900/40 p-5 rounded-md border border-gray-100 dark:border-neutral-800/50 min-w-[200px]">
                <div className="w-12 h-12 rounded-md bg-white dark:bg-neutral-800 flex items-center justify-center border border-gray-100 dark:border-neutral-700/50 shadow-sm">
                  <FiFolder className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                  <span className="block text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {foldersResponse?.total || 0}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-gray-400 dark:text-neutral-600 tracking-widest">
                    Collections
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-16">
            <div className="relative w-full md:w-96 group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search folders..."
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
                  { value: "booksCount", label: "Most Resources" },
                  { value: "bookmarksCount", label: "Most Bookmarked" },
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

          {showSkeleton ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <FolderCardSkeleton count={pageSize} />
            </div>
          ) : visibleFolders.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {visibleFolders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onClick={() => router.push(`/app/folders/${folder.slug}`)}
                  />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                isLoading={isLoading}
                className="mt-20"
              />
            </>
          ) : (
            <div className="h-[30vh] text-center py-32 bg-gray-50/30 dark:bg-neutral-900/10 rounded-md border border-dashed border-gray-200 dark:border-neutral-800">
              <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-neutral-700/50">
                <FiSearch className="w-6 h-6 text-gray-300 dark:text-neutral-600" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                No folders found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
