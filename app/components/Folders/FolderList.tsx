"use client";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import { Folder, Collaborator } from "@/app/types/folder";
import {
  FiFolder,
  FiLock,
  FiGlobe,
  FiMoreVertical,
  FiBook,
  FiUser,
} from "react-icons/fi";
import FolderListSkeleton from "@/app/components/Skeletons/FolderListSkeleton";

interface FolderListProps {
  folders: (Folder & { collaborator?: Collaborator })[];
  onFolderClick: (folder: Folder) => void;
  onFolderEdit?: (folder: Folder) => void;
  onFolderDelete?: (folder: Folder) => void;
  showActions?: boolean;
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonCount?: number;
}

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  onFolderClick,
  onFolderEdit,
  onFolderDelete,
  showActions = false,
  emptyMessage = "No folders yet",
  isLoading = false,
  skeletonCount = 5,
}) => {
  const user = useSelector(selectCurrentUser);
  const currentUser = user?.username || "Guest";
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null);

  if (isLoading) {
    return <FolderListSkeleton count={skeletonCount} />;
  }

  if (folders.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiFolder className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-neutral-800/50 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Folder Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Books
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created By
              </th>
              {showActions && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {folders.map((folder) => {
              const isOwner = folder.createdBy === currentUser;
              const isEditor = folder.collaborator?.role === "EDITOR";
              const canEdit = isOwner || isEditor;
              const canDelete = isOwner;
              const hasActions = canEdit || canDelete;

              return (
                <tr
                  key={folder.id}
                  onClick={() => onFolderClick(folder)}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                          folder.visibility === "PUBLIC"
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <FiFolder className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {folder.name}
                        </div>
                        {folder.coverImages &&
                          folder.coverImages.length > 0 && (
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                              Includes recent additions
                            </div>
                          )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FiBook className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                      {folder.booksCount}{" "}
                      {folder.booksCount === 1 ? "book" : "books"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {folder.visibility === "PUBLIC" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                          <FiGlobe className="w-3 h-3 mr-1" />
                          Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                          <FiLock className="w-3 h-3 mr-1" />
                          Private
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FiUser className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                      {folder.createdBy || "Guest"}
                    </div>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      {hasActions && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(
                                activeMenuId === folder.id ? null : folder.id
                              );
                            }}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                          >
                            <FiMoreVertical className="w-5 h-5" />
                          </button>
                          {activeMenuId === folder.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(null);
                                }}
                              />
                              <div className="absolute right-8 top-8 w-40 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-20">
                                {canEdit && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onFolderEdit?.(folder);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
                                  >
                                    Edit Folder
                                  </button>
                                )}
                                {canDelete && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onFolderDelete?.(folder);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center"
                                  >
                                    Delete Folder
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
