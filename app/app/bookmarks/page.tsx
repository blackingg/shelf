"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiBook, FiFolder, FiBookmark } from "react-icons/fi";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import {
  useBookmarkedBooks,
  useBookmarkedFolders,
} from "@/app/services";
import { PaginatedBookGrid } from "@/app/components/Library/PaginatedBookGrid";
import { PaginatedFolderGrid } from "@/app/components/Folders/PaginatedFolderGrid";
import { useResponsiveLimit } from "@/app/hooks/useResponsiveLimit";

export default function BookmarksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"books" | "folders">("books");
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [page, setPage] = useState(1);
  const [folderPage, setFolderPage] = useState(1);

  const booksLimit = useResponsiveLimit({ base: 2, md: 4, lg: 5 }, 2, 10);
  const foldersLimit = useResponsiveLimit({ base: 2, lg: 3, xl: 4 }, 2, 8);

  React.useEffect(() => {
    setPage(1);
  }, [booksLimit]);

  React.useEffect(() => {
    setFolderPage(1);
  }, [foldersLimit]);

  const {
    books,
    total: totalBooksCount,
    totalPages: booksTotalPages,
    isFetching: isFetchingBooks,
  } = useBookmarkedBooks({ page, limit: booksLimit });

  const {
    folders,
    total: totalFoldersCount,
    totalPages: foldersTotalPages,
    isFetching: isFetchingFolders,
  } = useBookmarkedFolders({ page: folderPage, limit: foldersLimit });

  const tabs = [
    {
      id: "books",
      label: "Books",
      icon: FiBook,
      count: totalBooksCount,
    },
    {
      id: "folders",
      label: "Folders",
      icon: FiFolder,
      count: totalFoldersCount,
    },
  ];

  return (
    <>
      <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 pb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
              <FiBookmark className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              My Bookmarks
            </h1>
          </div>

          <div className="flex border-b border-gray-200 dark:border-neutral-800 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "books" | "folders")}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors duration-200 shrink-0 ${
                    isActive
                      ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                      : "border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div key={activeTab}>
          {activeTab === "books" && (
            <PaginatedBookGrid
              books={books}
              isLoading={isFetchingBooks}
              totalPages={booksTotalPages}
              currentPage={page}
              onPageChange={setPage}
              onBookClick={(book) => setSelectedBook(book)}
              pageSize={booksLimit}
              emptyTitle="No bookmarked books"
              emptyMessage="Books you bookmark will appear here."
              emptyIcon={
                <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                  <FiBookmark className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                </div>
              }
            />
          )}

          {activeTab === "folders" && (
            <PaginatedFolderGrid
              folders={folders}
              isLoading={isFetchingFolders}
              totalPages={foldersTotalPages}
              currentPage={folderPage}
              onPageChange={setFolderPage}
              onFolderClick={(folder) => router.push(`/app/folders/${folder.slug}`)}
              pageSize={foldersLimit}
              emptyTitle="No bookmarked folders"
              emptyMessage="Folders you bookmark will appear here."
              emptyIcon={
                <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                  <FiFolder className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                </div>
              }
            />
          )}
        </div>
      </div>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
