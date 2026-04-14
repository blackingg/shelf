"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { BookPreview } from "@/app/types/book";
import {
  useUser,
  useUserByUsername,
  useUserBooks,
  useUserFolders,
  useMeFolders,
  useFolderActions,
  useBookmarkedBooks,
  useBookmarkedFolders,
} from "@/app/services";
import { useNotifications } from "@/app/context/NotificationContext";
import ProfileSkeleton from "@/app/components/Skeletons/ProfileSkeleton";
import { PaginatedBookGrid } from "@/app/components/Library/PaginatedBookGrid";
import { PaginatedFolderGrid } from "@/app/components/Folders/PaginatedFolderGrid";
import { ProfileBookmarksTab } from "@/app/components/Profile/ProfileBookmarksTab";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store";
import { CreateFolderModal } from "@/app/components/Folders/CreateFolderModal";
import { FolderVisibility } from "@/app/types/folder";
import { shareContent } from "@/app/helpers/share";

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
  const [folderPage, setFolderPage] = useState(1);
  const [bookmarkBooksPage, setBookmarkBooksPage] = useState(1);
  const [bookmarkFoldersPage, setBookmarkFoldersPage] = useState(1);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const pageSize = 10;

  const currentUser = useSelector(selectCurrentUser);
  const isOwner = currentUser?.username === username;
  const { addNotification } = useNotifications();

  const { actions: userActions } = useUser();
  const { actions: folderActions } = useFolderActions();

  const { user, isLoading: isLoadingUser } = useUserByUsername(username);

  const {
    books,
    totalPages,
    total: booksTotal,
    isLoading: isLoadingBooks,
    isFetching: isFetchingBooks,
  } = useUserBooks({ username, page, limit: pageSize });

  const {
    folders: publicFolders,
    total: publicFoldersTotal,
    totalPages: publicFoldersTotalPages,
    isLoading: isLoadingPublicFolders,
    isFetching: isFetchingPublicFolders,
  } = useUserFolders({ username, page: folderPage, limit: pageSize });

  const {
    folders: ownerFolders,
    total: ownerFoldersTotal,
    totalPages: ownerFoldersTotalPages,
    isLoading: isLoadingOwnerFolders,
    isFetching: isFetchingOwnerFolders,
  } = useMeFolders({
    include_collaborated: true,
    page: folderPage,
    limit: pageSize,
  });

  const folders = isOwner ? ownerFolders : publicFolders;
  const isFetchingFoldersCount = isOwner ? isFetchingOwnerFolders : isFetchingPublicFolders;
  const foldersTotalPages = isOwner ? ownerFoldersTotalPages : publicFoldersTotalPages;


  const tabs = [
    {
      id: "donated",
      label: "Donated",
      icon: FiUploadCloud,
      count: isOwner ? booksTotal : user?.counts.donatedBooks || 0,
    },
    {
      id: "folders",
      label: "Folders",
      icon: FiFolder,
      count: isOwner ? ownerFoldersTotal : user?.counts.publicFolders || 0,
    },
    ...(isOwner
      ? [
          {
            id: "bookmarks",
            label: "Bookmarks",
            icon: FiBookmark,
            count: 0, // Simplified count for bookmarks
          },
        ]
      : []),
  ];

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await userActions.uploadAvatar(formData);
  };

  const handleCreateFolder = async (
    name: string,
    visibility: FolderVisibility,
    description?: string,
  ) => {
    await folderActions.createFolder({ name, visibility, description });
    setShowCreateFolderModal(false);
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url || !user) return;

    await shareContent({
      title: `${user.fullName} (@${user.username}) | Shelf`,
      text: `Check out ${user.fullName}'s book collections and library on Shelf.`,
      url: url,
    });
  };

  return (
    <div className="flex-1 min-h-full w-full">
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
              onClick={() => router.push("/app/discover")}
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
                        disabled={userActions.isUpdating}
                      />
                      {userActions.isUpdating ? (
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
                    {isOwner ? booksTotal : user.counts.donatedBooks}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Donations
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-gray-900 dark:text-white mb-1 tracking-tighter">
                    {isOwner ? ownerFoldersTotal : user.counts.publicFolders}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    Folders
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 shrink-0 ${
                      isActive
                        ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          isActive
                            ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                            : "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div key={activeTab}>
          {activeTab === "donated" && (
            <PaginatedBookGrid
              books={books}
              isLoading={isFetchingBooks}
              totalPages={totalPages}
              currentPage={page}
              onPageChange={setPage}
              onBookClick={(book) => setSelectedBook(book)}
              pageSize={pageSize}
              emptyMessage="No books donated yet."
              emptyAction={
                isOwner && (
                  <button
                    onClick={() => router.push("/app/books/upload")}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Upload Your First Book
                  </button>
                )
              }
            />
          )}

          {activeTab === "folders" && (
            <PaginatedFolderGrid
              folders={folders}
              isLoading={isFetchingFoldersCount}
              totalPages={foldersTotalPages}
              currentPage={folderPage}
              onPageChange={setFolderPage}
              onFolderClick={(folder) => router.push(`/app/folders/${folder.slug}`)}
              pageSize={pageSize}
              emptyMessage="No folders yet."
              emptyAction={
                isOwner && (
                  <button
                    onClick={() => setShowCreateFolderModal(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Create Your First Folder
                  </button>
                )
              }
            />
          )}

          {activeTab === "bookmarks" && isOwner && (
            <ProfileBookmarksTab
              pageSize={pageSize}
              bookmarkBooksPage={bookmarkBooksPage}
              setBookmarkBooksPage={setBookmarkBooksPage}
              bookmarkFoldersPage={bookmarkFoldersPage}
              setBookmarkFoldersPage={setBookmarkFoldersPage}
              setSelectedBook={setSelectedBook}
            />
          )}
        </div>

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
