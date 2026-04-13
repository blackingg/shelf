"use client";

import React, { ReactNode } from "react";
import {
  FolderCard,
  FolderCardSkeleton,
} from "@/app/components/Folders/FolderCard";
import { Pagination } from "@/app/components/Library/Pagination";
import { Folder, Collaborator } from "@/app/types/folder";
import { FiSearch } from "react-icons/fi";

interface PaginatedFolderGridProps {
  folders: (Folder & { collaborator?: Collaborator })[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onFolderClick: (folder: Folder) => void;
  onFolderEdit?: (folder: Folder) => void;
  onFolderDelete?: (folder: Folder) => void;
  showActions?: boolean;
  pageSize?: number;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  gridCols?: string;
  className?: string;
}

export const PaginatedFolderGrid: React.FC<PaginatedFolderGridProps> = ({
  folders,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  onFolderClick,
  onFolderEdit,
  onFolderDelete,
  showActions = false,
  pageSize = 8,
  emptyIcon,
  emptyTitle = "No folders found",
  emptyMessage = "No folders found matching your criteria.",
  emptyAction,
  gridCols = "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  className = "",
}) => {
  return (
    <div className={className}>
      {isLoading ? (
        <div className={`grid ${gridCols} gap-4 md:gap-6`}>
          <FolderCardSkeleton count={pageSize} />
        </div>
      ) : folders.length > 0 ? (
        <div className={`grid ${gridCols} gap-4 md:gap-6`}>
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => onFolderClick(folder)}
              onEdit={() => onFolderEdit?.(folder)}
              onDelete={() => onFolderDelete?.(folder)}
              showActions={showActions}
            />
          ))}
        </div>
      ) : (
        <div className="h-[30vh] text-center py-32 bg-gray-50/30 dark:bg-neutral-900/10 rounded-md border border-dashed border-gray-200 dark:border-neutral-800 flex flex-col items-center justify-center">
          {emptyIcon || (
            <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-neutral-700/50">
              <FiSearch className="w-6 h-6 text-gray-300 dark:text-neutral-600" />
            </div>
          )}
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 mb-1">
            {emptyTitle}
          </p>
          {emptyMessage && (
            <p className="text-xs text-gray-400 dark:text-neutral-500">
              {emptyMessage}
            </p>
          )}
          {emptyAction && <div className="mt-6">{emptyAction}</div>}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-12"
        />
      )}
    </div>
  );
};
