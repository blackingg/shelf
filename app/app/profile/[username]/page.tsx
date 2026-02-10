"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  FiFolder,
  FiUploadCloud,
  FiCalendar,
  FiArrowLeft,
  FiHome,
  FiLayers,
} from "react-icons/fi";
import { BookCard } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import {
  useGetUserByUsernameQuery,
  useGetUserBooksQuery,
  useGetUserFoldersQuery,
} from "@/app/store/api/usersApi";
import ProfileSkeleton from "@/app/components/Skeletons/ProfileSkeleton";
import BookCardSkeleton from "@/app/components/Skeletons/BookCardSkeleton";
import FolderCardSkeleton from "@/app/components/Skeletons/FolderCardSkeleton";
import { Pagination } from "@/app/components/Library/Pagination";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = decodeURIComponent(params.username as string);
  const [activeTab, setActiveTab] = useState<"donated" | "folders">("donated");
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data: user, isLoading: isLoadingUser } =
    useGetUserByUsernameQuery(username);

  const {
    data: booksResponse,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useGetUserBooksQuery({ username, page, pageSize });

  const { data: folders, isLoading: isLoadingFolders } =
    useGetUserFoldersQuery(username);

  const books = booksResponse?.items || [];
  const totalPages = booksResponse?.totalPages || 1;

  if (isLoadingUser) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          User Not Found
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-6">
          The user @{username} doesn&apos;t exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/app/library")}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold transition-all hover:bg-emerald-700 shadow-md flex items-center gap-2"
        >
          <FiArrowLeft className="w-5 h-5" />
          Back to Library
        </button>
      </div>
    );
  }

  const tabs = [
    {
      id: "donated",
      label: "Donated",
      icon: FiUploadCloud,
      count: user.booksCount,
    },
    {
      id: "folders",
      label: "Folders",
      icon: FiFolder,
      count: user.foldersCount,
    },
  ];

  return (
    <>
      <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="relative h-48 bg-gradient-to-br from-emerald-950 via-emerald-900 to-gray-900">
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-5 pb-8">
          <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-32 h-32 rounded-2xl bg-white dark:bg-neutral-800 p-1 shadow-xl">
              <div className="w-full h-full rounded-xl bg-gray-100 dark:bg-neutral-900 flex items-center justify-center text-4xl font-bold text-emerald-700 dark:text-emerald-500">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex gap-3 items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.fullName}
                </h1>
              </div>
              <p className="text-gray-500 dark:text-neutral-400 font-medium">
                @{username}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400 text-sm">
                <FiCalendar className="w-4 h-4 text-emerald-600" />
                <span className="font-medium">
                  Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex gap-6 items-center whitespace-nowrap">
                {user.school && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400 text-sm">
                    <FiHome className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">
                      {user.school.name}
                      {user.school.shortName && (
                        <span className="ml-1 text-gray-400">
                          ({user.school.shortName})
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {user.department && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400 text-sm">
                    <FiLayers className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium">{user.department.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-8 items-center justify-start md:justify-end md:col-span-2">
              <div className="text-center group">
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {user.booksCount}
                </div>
                <div className="text-xs uppercase tracking-widest font-bold text-gray-400">
                  Books
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-neutral-800" />
              <div className="text-center group">
                <div className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  {user.foldersCount}
                </div>
                <div className="text-xs uppercase tracking-widest font-bold text-gray-400">
                  Folders
                </div>
              </div>
            </div>
          </div>

          <div className="flex border-b border-gray-200 dark:border-neutral-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "donated" | "folders")}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    isActive
                      ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                      : "border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
                      isActive
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400"
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
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "donated" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {isLoadingBooks || isFetchingBooks ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))
                ) : books.length > 0 ? (
                  books.map((book: any) => (
                    <BookCard
                      key={book.id}
                      {...book}
                      onClick={() => setSelectedBook(book)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <p className="text-gray-500 dark:text-neutral-400">
                      No books donated yet.
                    </p>
                  </div>
                )}
              </div>

              {books.length > 0 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  isLoading={isFetchingBooks}
                />
              )}
            </div>
          )}

          {activeTab === "folders" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {isLoadingFolders ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <FolderCardSkeleton key={i} />
                ))
              ) : folders && folders.length > 0 ? (
                folders.map((folder: any) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onClick={() => router.push(`/app/folders/${folder.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-500 dark:text-neutral-400">
                    No public folders yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />
    </>
  );
}
