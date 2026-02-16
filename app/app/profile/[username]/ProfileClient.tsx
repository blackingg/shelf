"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  FiFolder,
  FiUploadCloud,
  FiCalendar,
  FiHome,
  FiLayers,
  FiBookmark,
  FiEdit2,
  FiPlus,
  FiCamera,
  FiShare2,
} from "react-icons/fi";
import { BackButton } from "@/app/components/Layout/BackButton";
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
  useUploadAvatarMutation,
} from "@/app/store/api/usersApi";
import {
  useGetMeFoldersQuery,
  useCreateFolderMutation,
} from "@/app/store/api/foldersApi";
import {
  useGetBookmarkedBooksQuery,
  useGetBookmarkedFoldersQuery,
} from "@/app/store/api/bookmarksApi";
import ProfileSkeleton from "@/app/components/Skeletons/ProfileSkeleton";
import { Pagination } from "@/app/components/Library/Pagination";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";
import { CreateFolderModal } from "@/app/components/Folders/CreateFolderModal";
import { FolderVisibility } from "@/app/types/folder";

interface ProfileClientProps {
  username: string;
}

export default function ProfileClient({ username }: ProfileClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "donated" | "folders" | "bookmarks"
  >("donated");
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);
  const [page, setPage] = useState(1);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const pageSize = 12;

  const currentUser = useSelector(selectCurrentUser);
  const isOwner = currentUser?.username === username;
  const { addNotification } = useNotifications();

  const [uploadAvatar, { isLoading: isUploadingAvatar }] =
    useUploadAvatarMutation();
  const [createFolder] = useCreateFolderMutation();

  const { data: user, isLoading: isLoadingUser } =
    useGetUserByUsernameQuery(username);

  const {
    data: booksResponse,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useGetUserBooksQuery({ username, page, pageSize });

  // Use getMeFolders if owner to see private ones
  const { data: publicFolders, isLoading: isLoadingPublicFolders } =
    useGetUserFoldersQuery(username, { skip: isOwner });
  const { data: ownerFoldersResponse, isLoading: isLoadingOwnerFolders } =
    useGetMeFoldersQuery(undefined, { skip: !isOwner });

  const folders = isOwner ? ownerFoldersResponse?.items : publicFolders?.items;
  const isLoadingFolders = isOwner
    ? isLoadingOwnerFolders
    : isLoadingPublicFolders;

  const { data: bookmarkedBooks, isLoading: isLoadingBookmarkedBooks } =
    useGetBookmarkedBooksQuery(undefined, {
      skip: !isOwner || activeTab !== "bookmarks",
    });
  const { data: bookmarkedFolders, isLoading: isLoadingBookmarkedFolders } =
    useGetBookmarkedFoldersQuery(undefined, {
      skip: !isOwner || activeTab !== "bookmarks",
    });

  const books = booksResponse?.items || [];
  const totalPages = booksResponse?.totalPages || 1;

  const tabs = [
    {
      id: "donated",
      label: "Donated",
      icon: FiUploadCloud,
      count: isOwner
        ? booksResponse?.total || 0
        : user?.counts.donatedBooks || 0,
    },
    {
      id: "folders",
      label: "Folders",
      icon: FiFolder,
      count: isOwner
        ? ownerFoldersResponse?.total || 0
        : user?.counts.publicFolders || 0,
    },
    ...(isOwner
      ? [
          {
            id: "bookmarks",
            label: "Bookmarks",
            icon: FiBookmark,
            count:
              (bookmarkedBooks?.total || 0) + (bookmarkedFolders?.total || 0),
          },
        ]
      : []),
  ];

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadAvatar(formData).unwrap();
      addNotification("success", "Profile picture updated successfully");
    } catch (err) {
      addNotification(
        "error",
        getErrorMessage(err, "Failed to update profile picture"),
      );
    }
  };

  const handleCreateFolder = async (
    name: string,
    visibility: FolderVisibility,
  ) => {
    try {
      await createFolder({ name, visibility }).unwrap();
      addNotification("success", "Folder created successfully!");
      setShowCreateFolderModal(false);
    } catch (err: any) {
      addNotification("error", getErrorMessage(err, "Failed to create folder"));
    }
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;

    const shareData = {
      title: `${user?.fullName} (@${user?.username}) | Shelf`,
      text: `Check out ${user?.fullName}'s book collections and library on Shelf.`,
      url: url,
    };

    const copyToClipboard = async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url);
          addNotification("success", "Profile link copied to clipboard!");
        } else {
          throw new Error("Clipboard API unavailable");
        }
      } catch (err) {
        // Fallback for non-secure contexts or failed API
        try {
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          addNotification("success", "Profile link copied to clipboard!");
        } catch (fallbackErr) {
          addNotification("error", "Failed to copy link");
        }
      }
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => copyToClipboard());
    } else {
      copyToClipboard();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900">
      <div className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800">
        <div className="relative h-48 bg-linear-to-br from-emerald-950 via-emerald-900 to-emerald-950">
          <div className="absolute inset-0 bg-black/10" />
          <div className="max-w-7xl mx-auto px-6 pt-6 relative z-10 flex justify-between items-start">
            <BackButton className="text-white/80 hover:text-white" />
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleShare();
              }}
              className="p-2 bg-black/20 hover:bg-black/40 text-white/80 hover:text-white rounded-md transition-colors backdrop-blur-xs border border-white/10 cursor-pointer flex items-center justify-center"
              title="Share Profile"
              aria-label="Share Profile"
            >
              <FiShare2 className="w-5 h-5" />
            </a>
          </div>
        </div>

        {isLoadingUser ? (
          <div className="">
            <ProfileSkeleton isOwner={isOwner} />
          </div>
        ) : !user ? (
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600 dark:text-neutral-400 mb-8 max-w-sm mx-auto">
              The user @{username} doesn&apos;t exist.
            </p>
            <button
              onClick={() => router.push("/app/library")}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md font-bold text-xs uppercase tracking-widest hover:bg-emerald-700 transition-colors"
            >
              Back to Library
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 pt-5 pb-8">
            <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="w-32 h-32 rounded-md bg-white dark:bg-neutral-900 p-1 border border-gray-100 dark:border-neutral-800">
                <div className="w-full h-full rounded-md bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-4xl font-bold text-emerald-600 dark:text-emerald-400 overflow-hidden relative border border-gray-100 dark:border-neutral-700/50 group/avatar">
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

                  {isOwner && (
                    <label className="absolute bottom-1 right-1 w-8 h-8 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-700 shadow-xs flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer z-10">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isUploadingAvatar}
                      />
                      {isUploadingAvatar ? (
                        <div className="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                      ) : (
                        <FiCamera className="w-4 h-4" />
                      )}
                    </label>
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

              {isOwner && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push("/app/settings/profile")}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-100 dark:border-neutral-700/50"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-500 dark:text-neutral-500">
                  <FiCalendar className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    suppressHydrationWarning
                  >
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
                    {isOwner
                      ? booksResponse?.total || 0
                      : user.counts.donatedBooks}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Donations
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">
                    {isOwner
                      ? ownerFoldersResponse?.total || 0
                      : user.counts.publicFolders}
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
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 pb-4 text-[11px] font-bold uppercase tracking-widest transition-all relative ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="text-[10px] opacity-60">
                        {tab.count}
                      </span>
                    )}
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
        )}
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
                  <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border border-dashed border-gray-100 dark:border-neutral-800 rounded-md">
                    <p className="text-gray-500 dark:text-neutral-400 mb-6">
                      No books donated yet.
                    </p>
                    {isOwner && (
                      <button
                        onClick={() => router.push("/app/books/upload")}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                      >
                        <FiPlus className="w-4 h-4" />
                        Upload Your First Book
                      </button>
                    )}
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
                <div className="col-span-full py-20 text-center border border-dashed border-gray-100 dark:border-neutral-800 rounded-md flex flex-col items-center justify-center">
                  <p className="text-gray-500 dark:text-neutral-400 mb-6">
                    No folders yet.
                  </p>
                  {isOwner && (
                    <button
                      onClick={() => setShowCreateFolderModal(true)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Create Your First Folder
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "bookmarks" && isOwner && (
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Bookmarked Books
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {isLoadingBookmarkedBooks ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <BookCardSkeleton key={i} />
                    ))
                  ) : bookmarkedBooks?.items?.length ? (
                    bookmarkedBooks.items.map((book: any) => (
                      <BookCard
                        key={book.id}
                        {...book}
                        onClick={() => setSelectedBook(book)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-32 text-center border border-dashed border-gray-100 dark:border-neutral-800 rounded-md flex flex-col items-center justify-center">
                      <p className="text-gray-400 text-xs">
                        No books bookmarked.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    Bookmarked Folders
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {isLoadingBookmarkedFolders ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <FolderCardSkeleton key={i} />
                    ))
                  ) : bookmarkedFolders?.items?.length ? (
                    bookmarkedFolders.items.map((folder: any) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        onClick={() =>
                          router.push(`/app/folders/${folder.slug}`)
                        }
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-32 text-center border border-dashed border-gray-100 dark:border-neutral-800 rounded-md flex flex-col items-center justify-center">
                      <p className="text-gray-400 text-xs">
                        No folders bookmarked.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </motion.div>
      </div>

      <BookDetailPanel
        book={selectedBook!}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onSubmit={handleCreateFolder}
      />
    </div>
  );
}
