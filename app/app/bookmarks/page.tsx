"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FiBook, FiFolder, FiBookmark } from "react-icons/fi";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import {
  FolderCard,
  FolderCardSkeleton,
} from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import {
  useGetBookmarkedBooksQuery,
  useGetBookmarkedFoldersQuery,
} from "@/app/store/api/bookmarksApi";
import { Pagination } from "@/app/components/Library/Pagination";

export default function BookmarksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"books" | "folders">("books");
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [page, setPage] = useState(1);
  const [folderPage, setFolderPage] = useState(1);
  const pageSize = 8;

  const {
    data: booksResponse,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useGetBookmarkedBooksQuery({ page, pageSize });
  const {
    data: foldersResponse,
    isLoading: isLoadingFolders,
    isFetching: isFetchingFolders,
  } = useGetBookmarkedFoldersQuery({ page: folderPage, pageSize });

  const books = booksResponse?.items || [];
  const totalBooksCount = booksResponse?.total || 0;
  const folders = foldersResponse?.items || [];
  const totalFoldersCount = foldersResponse?.total || 0;

  const showBooksSkeleton = isLoadingBooks || isFetchingBooks;
  const showFoldersSkeleton = isLoadingFolders || isFetchingFolders;

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

          <div className="flex border-b border-gray-200 dark:border-neutral-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "books" | "folders")}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors duration-200 ${
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
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {showBooksSkeleton ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))
                ) : books.length > 0 ? (
                  books.map((book) => (
                    <BookCard
                      key={book.id}
                      {...book}
                      onClick={() => setSelectedBook(book as BookPreview)}
                    />
                  ))
                ) : (
                  <div className="col-span-full min-h-[50vh] flex items-center justify-center">
                    <div className="py-20 text-center flex flex-col items-center border border-dashed border-gray-200 dark:border-neutral-800 rounded-lg w-full">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                        <FiBookmark className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        No bookmarked books
                      </h3>
                      <p className="text-gray-500 dark:text-neutral-400 font-medium">
                        Books you bookmark will appear here.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {books.length > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={booksResponse?.totalPages || 1}
                  onPageChange={setPage}
                  isLoading={showBooksSkeleton}
                />
              )}
            </div>
          )}

          {activeTab === "folders" && (
            <div className="space-y-8">
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 ${
                  showFoldersSkeleton ? "opacity-50" : ""
                }`}
              >
                {isLoadingFolders ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <FolderCardSkeleton key={i} />
                  ))
                ) : folders && folders.length > 0 ? (
                  folders.map((folder) => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      onClick={() => router.push(`/app/folders/${folder.slug}`)}
                    />
                  ))
                ) : (
                  <div className="col-span-full min-h-[50vh] flex items-center justify-center">
                    <div className="py-20 text-center flex flex-col items-center border border-dashed border-gray-200 dark:border-neutral-800 rounded-lg w-full">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                        <FiFolder className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        No bookmarked folders
                      </h3>
                      <p className="text-gray-500 dark:text-neutral-400 font-medium">
                        Folders you bookmark will appear here.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {folders.length > 0 &&
                foldersResponse &&
                foldersResponse.totalPages > 1 && (
                  <Pagination
                    currentPage={folderPage}
                    totalPages={foldersResponse.totalPages}
                    onPageChange={setFolderPage}
                    isLoading={showFoldersSkeleton}
                  />
                )}
            </div>
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
