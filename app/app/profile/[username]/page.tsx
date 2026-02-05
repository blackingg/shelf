"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Folder } from "@/app/types/folder";
import { FiFolder, FiUploadCloud, FiCalendar, FiShield } from "react-icons/fi";
import { BookCard } from "@/app/components/Library/BookCard";
import { FolderCard } from "@/app/components/Folders/FolderCard";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import {
  useGetUserByUsernameQuery,
  useGetUserBooksQuery,
} from "@/app/store/api/usersApi";
import ProfileSkeleton from "@/app/components/Skeletons/ProfileSkeleton";
import BookCardSkeleton from "@/app/components/Skeletons/BookCardSkeleton";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = decodeURIComponent(params.username as string);
  const [activeTab, setActiveTab] = useState<"donated" | "folders">("donated");
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);

  const { data: user, isLoading: isLoadingUser } =
    useGetUserByUsernameQuery(username);
  const { data: books, isLoading: isLoadingBooks } =
    useGetUserBooksQuery(username);

  const MOCK_FOLDERS: Folder[] = [
    {
      id: "f1",
      slug: "summer-reading-list",
      name: "Summer Reading List",
      description: "My list for the summer",
      booksCount: 12,
      bookmarksCount: 45,
      visibility: "PUBLIC",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdBy: user?.fullName || "User",
      createdAt: new Date().toISOString(),
    },
  ];

  if (isLoadingUser) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          User Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The user @{username} doesn&apos;t exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/app/library")}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold transition-all hover:bg-emerald-700 shadow-md"
        >
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
                {/* user.mod doesn't exist in UserPublic, so we omit or check another way */}
              </div>
              <p className="text-gray-500 dark:text-neutral-400 font-medium">
                @{username}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400 text-sm">
              <FiCalendar className="w-4 h-4" />
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <div className="flex gap-8 items-center justify-start md:justify-end">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.booksCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Books Donated
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.foldersCount}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Public Folders
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {isLoadingBooks ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))
              ) : books && books.length > 0 ? (
                books.map((book) => (
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
          )}

          {activeTab === "folders" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {MOCK_FOLDERS.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => router.push(`/app/folders/${folder.id}`)}
                />
              ))}
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
