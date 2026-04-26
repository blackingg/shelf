"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BooksTable from "@/app/components/Folders/BooksTable";
import { BackButton } from "@/app/components/Layout/BackButton";
import {
  FiFolder,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiBookmark,
  FiLock,
  FiArrowLeft,
  FiSearch,
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import {
  useFolderBySlug,
  useFolderActions,
  useIsFolderBookmarked,
  useBookmarkFolderActions,
} from "@/app/services";
import { useFolderPermissions } from "@/app/hooks/useFolderPermissions";
import { FolderIcon } from "@/app/components/Folders/FolderIcon";
import FolderDetailSkeleton from "@/app/components/Skeletons/FolderDetailSkeleton";
import { shareContent } from "@/app/helpers/share";

interface FolderDetailsClientProps {
  slug: string;
}

export default function FolderDetailsClient({
  slug,
}: FolderDetailsClientProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { folder, isLoading, error } = useFolderBySlug(slug);
  const { actions, isDeleting } = useFolderActions();
  const { isBookmarked } = useIsFolderBookmarked(folder?.id || "");
  const { toggleBookmark } = useBookmarkFolderActions();

  const activeUser = useSelector(selectCurrentUser);

  const {
    isOwner,
    isCollaborator,
    canEditFolder,
    canDeleteFolder,
    canAddBooks,
    canRemoveBooks,
  } = useFolderPermissions(folder);

  const canEdit = canEditFolder;
  const canDelete = canDeleteFolder;

  const isForbidden = (error as any)?.status === 403;

  const handleShare = async () => {
    if (!folder) return;

    await shareContent({
      title: folder.name,
      text: `Check out the ${folder.name} folder on Shelf.`,
      url: window.location.href,
    });
    setShowMenu(false);
  };

  const handleToggleBookmark = async () => {
    if (!folder) return;
    await toggleBookmark(folder.id, isBookmarked);
  };

  const books = folder?.items?.map((item: any) => item.book) || [];

  const canSeeShare =
    folder?.visibility === "PUBLIC" || isOwner || isCollaborator;

  const hasMenuActions = canEdit || canDelete || canSeeShare;

  const handleRemoveBook = async (bookId: string) => {
    if (!folder) return;
    await actions.removeBookFromFolder(folder.id, bookId);
  };

  const handleDeleteFolder = async () => {
    if (!folder) return;
    await actions.deleteFolder(folder.id);
    setShowDeleteModal(false);
    router.push("/app/discover/folders");
  };

  return (
    <div className="w-full min-h-full bg-white dark:bg-neutral-900">
      <div className="p-4 md:p-8 space-y-6">
        <BackButton />

        {isLoading ? (
          <FolderDetailSkeleton hideHeader />
        ) : isForbidden ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/10 rounded-full flex items-center justify-center mb-6">
              <FiLock className="w-10 h-10 text-amber-600 dark:text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Private Folder
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-8 max-w-sm leading-relaxed">
              This folder is set to private. You don&apos;t have permission to
              view its contents. If you believe this is an error, contact the
              owner.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/app/folders")}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-md text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Explore Folders
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-100 dark:border-neutral-700/50"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : !folder ? (
          <div className="border border-gray-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900 min-h-[48vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-xl text-left space-y-5">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span>404 folder missing</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-center">
                  <FiFolder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
                  Folder Not Found
                </h2>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                The folder you are looking for does not exist.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/app/folders")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-md text-sm font-medium transition-colors hover:bg-emerald-700 active:bg-emerald-800"
                >
                  <FiSearch className="w-4 h-4" />
                  Browse Folders
                </button>
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="shrink-0">
                  <FolderIcon
                    visibility={folder.visibility}
                    booksCount={folder.booksCount}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden"
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white mb-2">
                    {folder.name}
                  </h1>
                  <p className="text-gray-500 dark:text-neutral-400 max-w-2xl mb-4 text-sm md:text-base leading-relaxed">
                    {folder.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 dark:text-neutral-500">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{folder.booksCount} books</span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <FiBookmark className="w-3 h-3 text-emerald-500" />
                      <span>{folder.bookmarksCount} bookmarks</span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <Link
                      href={`/app/profile/${encodeURIComponent((folder.user?.username || "").replace(/\s+/g, ""))}`}
                      className="underline-offset-2 hover:underline"
                    >
                      Created by {folder.user?.username}
                    </Link>
                    <span className="hidden md:inline">•</span>
                    <span className="capitalize">
                      {folder.visibility.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end lg:self-start">
                <button
                  onClick={handleToggleBookmark}
                  className={`p-2 rounded-lg transition-all duration-200 border ${
                    isBookmarked
                      ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20 text-emerald-600"
                      : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  title={
                    isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
                  }
                >
                  <FiBookmark
                    className={`w-6 h-6 md:w-5 md:h-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>

                {hasMenuActions && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-gray-500 dark:text-neutral-400"
                    >
                      <FiMoreVertical className="w-6 h-6 md:w-5 md:h-5" />
                    </button>

                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-white/10 py-1 z-10">
                        {canEdit && (
                          <button
                            onClick={() =>
                              router.push(`/app/folders/${folder.slug}/edit`)
                            }
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center space-x-2"
                          >
                            <FiEdit2 className="w-4 h-4" />
                            <span>Edit Folder</span>
                          </button>
                        )}
                        {canSeeShare && (
                          <button
                            onClick={handleShare}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center space-x-2"
                          >
                            <FiShare2 className="w-4 h-4" />
                            <span>Share</span>
                          </button>
                        )}
                        {canDelete && (
                          <>
                            {(canEdit || canSeeShare) && (
                              <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                            )}
                            <button
                              onClick={() => setShowDeleteModal(true)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center space-x-2"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <BooksTable
                books={books}
                canEdit={canRemoveBooks}
                folderId={folder.id}
                onRemoveBook={handleRemoveBook}
                onBookClick={(bookId) => {
                  const book = books.find((b: any) => b.id === bookId);
                  router.push(`/app/books/${book?.slug || bookId}/read`);
                }}
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteFolder}
        title="Delete Folder?"
        message={
          folder && (
            <p className="text-gray-600 text-left">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-600 dark:text-gray-300">
                &quot;{folder.name}&quot;
              </span>
              ? This action cannot be undone.
            </p>
          )
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
