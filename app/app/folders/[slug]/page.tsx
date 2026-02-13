"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BooksTable from "@/app/components/Folders/BooksTable";
import { BackButton } from "@/app/components/Layout/BackButton";
import {
  FiFolder,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiCamera,
  FiBookmark,
} from "react-icons/fi";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import {
  useGetFolderBySlugQuery,
  useUploadFolderCoverMutation,
} from "@/app/store/api/foldersApi";
import {
  useBookmarkFolderMutation,
  useUnbookmarkFolderMutation,
  useGetIsFolderBookmarkedQuery,
} from "@/app/store/api/bookmarksApi";
import FolderDetailSkeleton from "@/app/components/Skeletons/FolderDetailSkeleton";

export default function FolderDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [showMenu, setShowMenu] = useState(false);
  const [uploadFolderCover, { isLoading: isUploadingCover }] =
    useUploadFolderCoverMutation();

  const { data: folder, isLoading } = useGetFolderBySlugQuery(slug);
  const user = useSelector(selectCurrentUser);
  const currentUser = user?.username || "Guest";

  const { data: bookmarkData } = useGetIsFolderBookmarkedQuery(
    folder?.id || "",
    {
      skip: !folder?.id,
    },
  );
  const isBookmarked = bookmarkData?.bookmarked || false;

  const [bookmarkFolder] = useBookmarkFolderMutation();
  const [unbookmarkFolder] = useUnbookmarkFolderMutation();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification("success", "Folder link copied to clipboard!");
    setShowMenu(false);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !folder) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      await uploadFolderCover({ id: folder.id, data: formData }).unwrap();
      addNotification("success", "Folder cover updated successfully");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update folder cover"),
      );
    }
  };

  const handleToggleBookmark = async () => {
    if (!folder) return;

    try {
      if (isBookmarked) {
        await unbookmarkFolder(folder.id).unwrap();
        addNotification("success", "Removed from bookmarks");
      } else {
        await bookmarkFolder(folder.id).unwrap();
        addNotification("success", "Added to bookmarks");
      }
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update bookmark"),
      );
    }
  };

  const books = folder?.items?.map((item) => item.book) || [];

  const isOwner = folder?.user?.username === currentUser;
  const isCollaborator = !!folder?.collaborators?.some(
    (c) => c.user.username === currentUser,
  );
  const userCollaborator = folder?.collaborators?.find(
    (c) => c.user.username === currentUser,
  );
  const isEditor = userCollaborator?.role === "EDITOR";

  const canEdit = isOwner || isEditor;
  const canDelete = isOwner;
  const canSeeShare =
    folder?.visibility === "PUBLIC" || isOwner || isCollaborator;

  const hasMenuActions = canEdit || canDelete || canSeeShare;

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900">
      <div className="p-4 md:p-8 space-y-6">
        <BackButton />

        {isLoading ? (
          <FolderDetailSkeleton hideHeader />
        ) : !folder ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
            <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Folder Not Found
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6 max-w-sm">
              The folder you are looking for doesn&apos;t exist or has been
              removed from our system.
            </p>
            <button
              onClick={() => router.push("/app/folders")}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md font-medium transition-colors hover:bg-emerald-700 active:bg-emerald-800"
            >
              Back to Folders
            </button>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="relative group/cover">
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden border transition-all duration-300 ${
                      folder.visibility === "PUBLIC"
                        ? "bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border-gray-100 dark:border-white/5"
                        : "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-500 border-gray-200 dark:border-neutral-700/50 grayscale-[50%] opacity-90"
                    }`}
                  >
                    {folder.coverImage ? (
                      <img
                        src={folder.coverImage}
                        alt={folder.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiFolder className="w-10 h-10" />
                    )}
                  </div>
                  {canEdit && (
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md opacity-0 group-hover/cover:opacity-100 transition-opacity cursor-pointer text-white">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={isUploadingCover}
                      />
                      {isUploadingCover ? (
                        <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiCamera className="w-6 h-6" />
                      )}
                    </label>
                  )}
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
                    <span>Created by {folder.user?.username || "Unknown"}</span>
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
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center space-x-2">
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
                onBookClick={(bookId) => {
                  const book = books.find((b) => b.id === bookId);
                  router.push(`/app/books/${book?.slug || bookId}/read`);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
