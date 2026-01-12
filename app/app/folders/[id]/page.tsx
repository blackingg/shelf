"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BooksTable from "@/app/components/Folders/BooksTable";
import {
  FiFolder,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiArrowLeft,
} from "react-icons/fi";
import { useNotifications } from "@/app/context/NotificationContext";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import { useGetFolderByIdQuery } from "@/app/store/api/foldersApi";
import FolderDetailSkeleton from "@/app/components/Skeletons/FolderDetailSkeleton";

export default function FolderDetailsPage() {
  const params = useParams();
  const folderId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [showMenu, setShowMenu] = useState(false);

  const { data: folder, isLoading } = useGetFolderByIdQuery(folderId);
  const user = useSelector(selectCurrentUser);
  const currentUser = user?.username || "Guest";

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification("success", "Folder link copied to clipboard!");
    setShowMenu(false);
  };

  if (isLoading) {
    return <FolderDetailSkeleton />;
  }

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Folder Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The folder you are looking for doesn&apos;t exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/app/folders")}
          className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-semibold transition-all hover:bg-emerald-700 shadow-md"
        >
          Back to Folders
        </button>
      </div>
    );
  }

  const books = folder.books || [];

  const isOwner = folder.createdBy === currentUser;
  const isCollaborator = !!folder.collaborator;
  const isEditor = folder.collaborator?.role === "EDITOR";

  const canEdit = isOwner || isEditor;
  const canDelete = isOwner;
  const canSeeShare =
    folder.visibility === "PUBLIC" || isOwner || isCollaborator;

  const hasMenuActions = canEdit || canDelete || canSeeShare;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8 space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="space-y-6 md:space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-100 rounded-2xl flex-shrink-0 flex items-center justify-center text-emerald-600">
                <FiFolder className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {folder.name}
                </h1>
                <p className="text-gray-600 max-w-2xl mb-4 text-sm md:text-base leading-relaxed">
                  {folder.description || "No description provided."}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <span>{folder.booksCount} books</span>
                  <span className="hidden md:inline">•</span>
                  <span>Created by {folder.createdBy}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="capitalize">
                    {folder.visibility.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>

            {hasMenuActions && (
              <div className="relative self-end lg:self-start">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                >
                  <FiMoreVertical className="w-6 h-6 md:w-5 md:h-5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10">
                    {canEdit && (
                      <button
                        onClick={() =>
                          router.push(`/app/folders/${folder.id}/edit`)
                        }
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        <span>Edit Folder</span>
                      </button>
                    )}
                    {canSeeShare && (
                      <button
                        onClick={handleShare}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <FiShare2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    )}
                    {canDelete && (
                      <>
                        {(canEdit || canSeeShare) && (
                          <div className="border-t border-gray-100 my-1" />
                        )}
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
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

          <div>
            <BooksTable
              books={books}
              onBookClick={(bookId) => router.push(`/app/books/${bookId}/read`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
