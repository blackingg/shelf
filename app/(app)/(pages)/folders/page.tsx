"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/app/components/Layout/BackButton";
import { FiSearch, FiFolder } from "react-icons/fi";
import { useFolders, useSearchTypeQuery } from "@/app/services";
import { Folder } from "@/app/types/folder";
import { PaginatedFolderGrid } from "@/app/components/Folders/PaginatedFolderGrid";
import { SortFilter } from "@/app/components/Library/SortFilter";
import { FolderSortBy, SortOrder } from "@/app/types/common";
import { useResponsiveLimit } from "@/app/hooks/useResponsiveLimit";

export default function FoldersPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<FolderSortBy>("createdAt");
  const [order, setOrder] = useState<SortOrder>("desc");
  const pageSize = useResponsiveLimit({ base: 2, lg: 3, xl: 4 }, 2, 8);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isSearching = debouncedSearch.trim().length > 0;

  const {
    folders: browseFolders,
    total: browseTotal,
    totalPages: browseTotalPages,
    isFetching: isBrowseFetching,
  } = useFolders({
    page,
    limit: pageSize,
    sort_by: sortBy,
    order,
    root_only: true,
  });

  const { data: searchData, isFetching: isSearchFetching } =
    useSearchTypeQuery<Folder>(
      "folders",
      { q: debouncedSearch.trim(), page, limit: pageSize },
      { enabled: isSearching },
    );

  const folders = isSearching ? (searchData?.items ?? []) : browseFolders;
  const total = isSearching ? (searchData?.total ?? 0) : browseTotal;
  const totalPages = isSearching
    ? Math.max(
        1,
        Math.ceil((searchData?.total ?? 0) / (searchData?.pageSize || pageSize)),
      )
    : browseTotalPages;
  const isFetching = isSearching ? isSearchFetching : isBrowseFetching;

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 p-4 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-10">
            <BackButton
              label="Back to Discover"
              href="/discover"
            />
          </div>

          <div className="mb-6 md:mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between lg:gap-10">
              <div className="max-w-3xl">
                <p className="hidden lg:block text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-4">
                  Community Library
                </p>
                <h1 className="text-xl md:text-4xl lg:text-6xl font-black text-foreground mb-0 lg:mb-6 tracking-tight leading-tight text-balance">
                  Community Folders
                </h1>
                <p className="hidden lg:block text-gray-500 dark:text-neutral-500 text-lg font-medium leading-relaxed max-w-2xl">
                  Explore curated reading lists, study guides, and folders
                  shared by the community.
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-4 bg-gray-50/50 dark:bg-neutral-900/40 p-5 rounded-md lg:border border-line-subtle min-w-[200px]">
                <div className="w-12 h-12 rounded-md bg-white dark:bg-neutral-800 flex items-center justify-center border border-gray-100 dark:border-neutral-700/50 shadow-sm">
                  <FiFolder className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="block text-3xl font-black text-foreground tracking-tighter">
                    {total}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-faint tracking-widest">
                    Folders
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 mb-8 md:mb-16">
            <div className="relative w-full md:w-96 group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-background border border-line-subtle rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground transition-all text-sm font-bold tracking-tight"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <SortFilter
                value={sortBy}
                onValueChange={(val) => setSortBy(val as FolderSortBy)}
                options={[
                  { value: "createdAt", label: "Recently Added" },
                  { value: "booksCount", label: "Most Resources" },
                  { value: "bookmarksCount", label: "Most Bookmarked" },
                ]}
              />

              <button
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                className="p-3 bg-gray-50/50 dark:bg-neutral-900/40 rounded-md border border-line-subtle text-muted hover:text-primary transition-colors h-[42px] flex items-center justify-center min-w-[42px]"
                title={order === "asc" ? "Ascending" : "Descending"}
              >
                <span className="text-sm font-black">
                  {order === "asc" ? "↑" : "↓"}
                </span>
              </button>
            </div>
          </div>

          <PaginatedFolderGrid
            folders={folders}
            isLoading={isFetching}
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
            onFolderClick={(folder) => router.push(`/folders/${folder.slug}`)}
            showActions={true}
            pageSize={pageSize}
            emptyMessage="No folders found matching your search."
            className="mt-0"
          />
        </div>
      </main>
    </div>
  );
}
