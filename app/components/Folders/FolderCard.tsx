"use client";
import {
  FiLock,
  FiGlobe,
  FiMoreVertical,
  FiBook,
  FiBookmark,
  FiShare2,
} from "react-icons/fi";
import { useState } from "react";
import Image from "next/image";
import { Folder, Collaborator } from "@/app/types/folder";
import { FolderIcon } from "./FolderIcon";
import { shareContent } from "@/app/helpers/share";
import {
  useIsFolderBookmarked,
  useBookmarkFolderActions,
} from "@/app/services";
import { useGetMeQuery } from "@/app/services";
import { useFolderPermissions } from "@/app/hooks";

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
        <div key={i} className="animate-pulse">
          <div className="relative">
            <div className="relative z-10">
              <div className="w-full aspect-[278/194] bg-gray-200 dark:bg-neutral-700 rounded-sm overflow-hidden" />
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
  const { data: activeUser } = useGetMeQuery();
  const isAuthenticated = !!activeUser;
  const [showMenu, setShowMenu] = useState(false);
  const isPublic = folder.visibility === "PUBLIC";

  const { canEditFolder, canDeleteFolder } = useFolderPermissions(folder);
  const hasMoreActions = canEditFolder || canDeleteFolder;

  const { isBookmarked } = useIsFolderBookmarked(folder.id, {
    enabled: isAuthenticated,
  });
  const { toggleBookmark } = useBookmarkFolderActions();

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleBookmark(folder.id, isBookmarked);
  };

  return (
    <div onClick={onClick} className="group cursor-pointer relative">
      <div className="absolute top-1.5 right-1.5 z-20 flex items-center space-x-1.5">
        {isAuthenticated && (
          <button
            onClick={handleBookmark}
            className={`p-1.5 rounded-sm transition-all duration-200 ${
              isBookmarked
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-white/90 dark:bg-neutral-800/90 text-gray-500 dark:text-neutral-400 hover:bg-primary hover:text-white border border-gray-100 dark:border-white/5"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Folder"}
          >
            <FiBookmark
              className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        )}

        {showActions && (
          <div className="relative">
            {hasMoreActions ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1.5 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors text-gray-500 dark:text-neutral-400 border border-gray-100 dark:border-white/5"
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
                    <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-800 py-1 z-20 shadow-lg">
                      {canEditFolder && (
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
                      {canDeleteFolder && (
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
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await shareContent({
                            title: folder.name,
                            text: `Check out the ${folder.name} folder on Shelf.`,
                            url: `${window.location.origin}/app/folders/${folder.slug}`,
                          });
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center space-x-2"
                      >
                        <FiShare2 className="w-3 h-3" />
                        <span>Share</span>
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await shareContent({
                    title: folder.name,
                    text: `Check out the ${folder.name} folder on Shelf.`,
                    url: `${window.location.origin}/app/folders/${folder.slug}`,
                  });
                }}
                className="p-1.5 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors text-gray-500 dark:text-neutral-400 border border-gray-100 dark:border-white/5"
                title="Share Folder"
              >
                <FiShare2 className="w-3.5 h-3.5 text-gray-600 dark:text-neutral-300" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="relative">
        <div className="relative z-10 transition-opacity duration-200">
          <FolderIcon
            visibility={folder.visibility}
            booksCount={folder.booksCount}
          />
        </div>
      </div>

      <div className="mt-2 px-1">
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-medium text-gray-900 dark:text-neutral-100 text-sm leading-tight truncate pr-2">
            {folder.name}
          </h3>
          {isPublic ? (
            <FiGlobe className="w-3.5 h-3.5 text-gray-400 dark:text-neutral-500 shrink-0" />
          ) : (
            <FiLock className="w-3.5 h-3.5 text-gray-400 dark:text-neutral-500 shrink-0" />
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <FiBook className="w-3 h-3" />
              <span>
                {folder.booksCount} {folder.booksCount === 1 ? "book" : "books"}
              </span>
            </div>
            {folder.bookmarksCount > 0 && (
              <div className="flex items-center space-x-1">
                <FiBookmark className="w-3 h-3" />
                <span>{folder.bookmarksCount}</span>
              </div>
            )}
          </div>
          <span className="truncate max-w-20">
            {folder.user?.username || "User"}
          </span>
        </div>
      </div>
    </div>
  );
};
