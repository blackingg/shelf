"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiBookmark, FiMoreVertical, FiShare2 } from "react-icons/fi";
import { shareContent } from "@/app/helpers/share";
import { useState } from "react";
import {
  useIsBookBookmarked,
  useBookBookmarkActions,
  useUser,
} from "@/app/services";
import { BookCardProps } from "@/app/types/book";
import { AuthPromptModal } from "@/app/components/Auth/AuthPromptModal";
import { useIsOwner } from "@/app/hooks/useIsOwner";
import { useOpenPanel } from "@openpanel/nextjs";
import { useNotifications } from "@/app/context/NotificationContext";

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  coverImage,
  rating,
  donor,
  onClick,
  showActions = false,
  onEdit,
  onDelete,
  className = "",
}) => {
  const { isAuthenticated } = useUser();
  const isOwner = useIsOwner(donor);
  const hasActions = isOwner;

  const { isBookmarked } = useIsBookBookmarked(id || "", {
    enabled: isAuthenticated,
  });
  const { toggleBookmark } = useBookBookmarkActions();
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const openPanel = useOpenPanel();
  const { addNotification } = useNotifications();

  const handleCardClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      setShowAuthPrompt(true);
      return;
    }
    onClick?.();
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    await toggleBookmark(id, isBookmarked);
    openPanel.track("book_bookmarked");
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group cursor-pointer transition-colors duration-200 ${className} relative`}
    >
      <div className="relative h-64 md:h-72 rounded-sm overflow-hidden mb-3 border border-gray-100 dark:border-white/10">
        <img
          src={coverImage || "/dummycover.png"}
          alt={title}
          className="object-cover h-full w-full"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />

        {rating && (
          <div className="absolute top-2 left-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 z-10">
            <div className="bg-black/60 px-2 py-1 rounded-sm flex items-center space-x-1 backdrop-blur-sm">
              <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white font-medium">{rating}</span>
            </div>
          </div>
        )}

        <div className="absolute top-1.5 right-1.5 flex items-center space-x-1.5 z-20">
          {isAuthenticated && id && (
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-sm transition-all duration-200 ${
                isBookmarked
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-white/90 dark:bg-neutral-800/90 text-muted hover:bg-primary hover:text-white border border-gray-100 dark:border-white/5"
              }`}
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Book"}
            >
              <FiBookmark
                className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>
          )}

          {showActions && (
            <div className="relative">
              {hasActions ? (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="p-1.5 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors text-muted border border-gray-100 dark:border-white/5"
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
                      <div className="absolute right-0 mt-1 w-36 bg-background rounded-md border border-line py-1 z-20 shadow-lg">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (id) onEdit?.(id);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-neutral-300 hover:bg-wash"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (id) onDelete?.(id);
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-danger hover:bg-danger-wash"
                        >
                          Delete
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!id) return;
                            const result = await shareContent({
                              title: title,
                              text: `Check out "${title}" by ${author} on Shelf.`,
                              url: `${window.location.origin}/books/${id}`,
                            });
                            if (result === "copied") {
                              addNotification("success", "Link copied to clipboard");
                            }
                            setShowMenu(false);
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-neutral-300 hover:bg-wash flex items-center space-x-2"
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
                    if (!id) return;
                    const result = await shareContent({
                      title: title,
                      text: `Check out "${title}" by ${author} on Shelf.`,
                      url: `${window.location.origin}/books/${id}`,
                    });
                    if (result === "copied") {
                      addNotification("success", "Link copied to clipboard");
                    }
                  }}
                  className="p-1.5 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 rounded-md transition-colors text-muted border border-gray-100 dark:border-white/5"
                  title="Share Resource"
                >
                  <FiShare2 className="w-3.5 h-3.5 text-gray-600 dark:text-neutral-300" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <h3 className="font-medium text-gray-900 dark:text-neutral-100 text-sm line-clamp-1 mb-0.5">
        {title}
      </h3>
      <p className="text-[10px] text-muted line-clamp-1 font-medium uppercase tracking-wider">
        {author}
      </p>
      {donor?.username && (
        <Link
          href={`/profile/${encodeURIComponent(donor.username.replace(/\s+/g, ""))}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] text-faint mt-0.5 block truncate"
        >
          Donated by
          <span className="ml-1 underline-offset-2 hover:underline">
            {donor.username}
          </span>
        </Link>
      )}

      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        message="Sign in to view book details, bookmark resources, and build your library."
      />
    </div>
  );
};

export function SingleBookCardSkeleton() {
  return (
    <div className="w-full">
      <div className="h-64 md:h-72 rounded-md bg-gray-100 dark:bg-neutral-800 border border-line-subtle mb-3 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded-md w-4/5 animate-pulse" />
        <div className="h-3 bg-gray-50 dark:bg-neutral-800/50 rounded-md w-2/5 animate-pulse" />
      </div>
    </div>
  );
}

export function BookCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SingleBookCardSkeleton key={i} />
      ))}
    </>
  );
}
