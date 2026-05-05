"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BookPreview } from "@/app/types/book";
import { useBookmarkedBooks, useBookmarkedFolders } from "@/app/services";
import { PaginatedBookGrid } from "@/app/components/Library/PaginatedBookGrid";
import { PaginatedFolderGrid } from "@/app/components/Folders/PaginatedFolderGrid";

interface ProfileBookmarksTabProps {
  pageSize: number;
  bookmarkBooksPage: number;
  setBookmarkBooksPage: (page: number) => void;
  bookmarkFoldersPage: number;
  setBookmarkFoldersPage: (page: number) => void;
  setSelectedBook: (book: BookPreview) => void;
  activeSubTab: "books" | "folders";
  setActiveSubTab: (tab: "books" | "folders") => void;
}

export const ProfileBookmarksTab: React.FC<ProfileBookmarksTabProps> = ({
  pageSize,
  bookmarkBooksPage,
  setBookmarkBooksPage,
  bookmarkFoldersPage,
  setBookmarkFoldersPage,
  setSelectedBook,
  activeSubTab,
  setActiveSubTab,
}) => {
  const router = useRouter();

  const {
    books: bookmarkedBooksItems,
    totalPages: bookmarkedBooksTotalPages,
    total: totalBooksCount,
    isFetching: isFetchingBookmarkedBooks,
  } = useBookmarkedBooks({ page: bookmarkBooksPage, limit: pageSize });

  const {
    folders: bookmarkedFoldersItems,
    totalPages: bookmarkedFoldersTotalPages,
    total: totalFoldersCount,
    isFetching: isFetchingBookmarkedFolders,
  } = useBookmarkedFolders({ page: bookmarkFoldersPage, limit: pageSize });

  const subTabs = [
    { id: "books" as const, label: "Books", count: totalBooksCount },
    { id: "folders" as const, label: "Folders", count: totalFoldersCount },
  ];

  return (
    <div className="space-y-8">
      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2">
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 shrink-0 ${
                isActive
                  ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  isActive
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                    : "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div key={activeSubTab}>
        {activeSubTab === "books" && (
          <PaginatedBookGrid
            books={bookmarkedBooksItems}
            isLoading={isFetchingBookmarkedBooks}
            totalPages={bookmarkedBooksTotalPages}
            currentPage={bookmarkBooksPage}
            onPageChange={setBookmarkBooksPage}
            onBookClick={setSelectedBook}
            pageSize={pageSize}
            emptyMessage="No books bookmarked."
          />
        )}

        {activeSubTab === "folders" && (
          <PaginatedFolderGrid
            folders={bookmarkedFoldersItems}
            isLoading={isFetchingBookmarkedFolders}
            totalPages={bookmarkedFoldersTotalPages}
            currentPage={bookmarkFoldersPage}
            onPageChange={setBookmarkFoldersPage}
            onFolderClick={(folder) =>
              router.push(`/app/folders/${folder.slug}`)
            }
            pageSize={pageSize}
            emptyMessage="No folders bookmarked."
          />
        )}
      </div>
    </div>
  );
};
