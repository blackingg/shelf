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
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import {
  FolderCard,
  FolderCardSkeleton,
} from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import {
  useGetUserByUsernameQuery,
  useGetUserBooksQuery,
  useGetUserFoldersQuery,
} from "@/app/store/api/usersApi";
import ProfileSkeleton from "@/app/components/Skeletons/ProfileSkeleton";
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
        <div className="max-w-7xl mx-auto px-6 pt-5 pb-8">
          <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="w-32 h-32 rounded-md bg-white dark:bg-neutral-900 p-1 border border-gray-100 dark:border-neutral-800">
              <div className="w-full h-full rounded-md bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-4xl font-bold text-emerald-600 dark:text-emerald-400 overflow-hidden relative border border-gray-100 dark:border-neutral-700/50">
                {user.avatar &&
                (user.avatar.startsWith("/") ||
                  user.avatar.startsWith("http")) ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  username.charAt(0).toUpperCase()
                )}
              </div>
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {user.fullName}
                </h1>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                  @{username}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-500 dark:text-neutral-500">
                <FiCalendar className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Joined{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="space-y-3">
                {user.school && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-neutral-300">
                    <div className="w-6 h-6 rounded-md bg-gray-50 dark:bg-neutral-800 flex items-center justify-center border border-gray-100 dark:border-neutral-700/50">
                      <FiHome className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium">
                      {user.school.name}
                      {user.school.shortName && (
                        <span className="ml-2 px-1.5 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded text-[10px] font-bold text-gray-400">
                          {user.school.shortName}
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {user.department && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-neutral-300">
                    <div className="w-6 h-6 rounded-md bg-gray-50 dark:bg-neutral-800 flex items-center justify-center border border-gray-100 dark:border-neutral-700/50">
                      <FiLayers className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium leading-tight">
                      {user.department.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex items-center justify-center md:justify-end gap-16 md:gap-24">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">
                  {user.booksCount}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Donations
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">
                  {user.foldersCount}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Folders
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-8 border-b border-gray-100 dark:border-neutral-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "donated" | "folders")}
                  className={`flex items-center gap-3 pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${
                    isActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500"
                    />
                  )}
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
                    onClick={() => router.push(`/app/folders/${folder.slug}`)}
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
