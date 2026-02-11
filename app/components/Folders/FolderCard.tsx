"use client";
import { FiLock, FiGlobe, FiMoreVertical, FiBook } from "react-icons/fi";
import { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import { Folder, Collaborator } from "@/app/types/folder";

interface FolderCardProps {
  folder: Folder & { collaborator?: Collaborator };
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function FolderCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
        >
          <div className="relative">
            <div className="relative z-10">
              <div className="w-full aspect-[278/194] bg-gray-200 dark:bg-neutral-700 rounded-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
          <div className="mt-2 px-1 space-y-1.5">
            <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4" />
            <div className="h-3 bg-gray-100 dark:bg-neutral-700/50 rounded w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onClick,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const user = useSelector(selectCurrentUser);
  const currentUser = user?.username || "Guest";
  const [showMenu, setShowMenu] = useState(false);
  const isPublic = folder.visibility === "PUBLIC";

  const isOwner = folder.createdBy === currentUser;
  const isEditor = folder.collaborator?.role === "EDITOR";
  const canEdit = isOwner || isEditor;
  const canDelete = isOwner;
  const hasActions = canEdit || canDelete;

  const coverImage = folder.coverImage;
  const hasCover =
    coverImage &&
    (coverImage.startsWith("/") ||
      coverImage.startsWith("http://") ||
      coverImage.startsWith("https://"));

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer relative"
    >
      {showActions && hasActions && (
        <div className="absolute top-1 right-1 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 bg-white/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors opacity-0 group-hover:opacity-100"
          >
            <FiMoreVertical className="w-3.5 h-3.5 text-gray-600 dark:text-neutral-300" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-800 py-1 z-20">
                {canEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                  >
                    Edit
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="relative">
        {hasCover && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] z-0">
            <div className="relative w-full h-16 sm:h-20 -top-2 rounded-t-md overflow-hidden border border-gray-100 dark:border-white/10">
              <Image
                src={coverImage}
                alt="Folder cover"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div
          className={`relative z-10 transition-opacity duration-200 ${
            hasCover ? "mt-4" : ""
          }`}
        >
          <Image
            src="/folder.svg"
            alt="Folder"
            width={278}
            height={194}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Folder Metadata */}
      <div className="mt-2 px-1">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-medium text-gray-900 dark:text-neutral-100 text-sm leading-tight truncate pr-2">
            {folder.name}
          </h3>
          {isPublic ? (
            <FiGlobe className="w-3.5 h-3.5 text-gray-400 dark:text-neutral-500 flex-shrink-0" />
          ) : (
            <FiLock className="w-3.5 h-3.5 text-gray-400 dark:text-neutral-500 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400">
          <div className="flex items-center space-x-1">
            <FiBook className="w-3 h-3" />
            <span>
              {folder.booksCount} {folder.booksCount === 1 ? "book" : "books"}
            </span>
          </div>
          <span className="truncate max-w-[100px]">
            {folder.user?.username || "User"}
          </span>
        </div>
      </div>
    </div>
  );
};
