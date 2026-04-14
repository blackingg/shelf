"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiBookmark, FiMoreVertical } from "react-icons/fi";
import { useState } from "react";
import {
  useIsBookBookmarked,
  useBookBookmarkActions,
} from "@/app/services";
import { BookCardProps } from "@/app/types/book";

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
  const { isBookmarked } = useIsBookBookmarked(id || "");
  const { toggleBookmark } = useBookBookmarkActions();
  const [showMenu, setShowMenu] = useState(false);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    await toggleBookmark(id, isBookmarked);
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer transition-colors duration-200 ${className} relative`}
    >
      <div className="relative h-64 md:h-72 rounded-md overflow-hidden mb-3 border border-gray-100 dark:border-white/10">
        <img
          src={
            coverImage &&
            (coverImage.startsWith("/") ||
              coverImage.startsWith("http://") ||
              coverImage.startsWith("https://"))
              ? coverImage
              : "/dummycover.png"
          }
          alt={title}
          className="object-cover h-full w-full"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />

        {rating && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-black/60 px-2 py-1 rounded-md flex items-center space-x-1">
              <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white font-medium">{rating}</span>
            </div>
          </div>
        )}

        <div className="absolute top-2 left-2 flex items-center space-x-1.5">
          {id && (
            <button
              onClick={handleBookmark}
              className={`p-1.5 rounded-md transition-all duration-200 ${
                isBookmarked
                  ? "bg-emerald-600 text-white opacity-100"
                  : "bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-emerald-600"
              }`}
            >
              <FiBookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>
          )}

          {showActions && id && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  showMenu
                    ? "bg-white text-gray-900 border border-gray-200 opacity-100"
                    : "bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-white hover:text-gray-900"
                }`}
              >
                <FiMoreVertical className="w-4 h-4" />
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
                  <div className="absolute left-0 mt-1 w-32 bg-white dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-800 py-1 z-20 shadow-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <h3 className="font-medium text-gray-900 dark:text-neutral-100 text-sm line-clamp-1 mb-0.5">
        {title}
      </h3>
      <p className="text-[10px] text-gray-500 dark:text-neutral-400 line-clamp-1 font-medium uppercase tracking-wider">
        {author}
      </p>
      {donor?.username && (
        <Link
          href={`/app/profile/${encodeURIComponent(donor.username.replace(/\s+/g, ""))}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] text-gray-400 dark:text-neutral-500 mt-0.5 block truncate"
        >
          Donated by
          <span className="ml-1 underline-offset-2 hover:underline">
            {donor.username}
          </span>
        </Link>
      )}
    </div>
  );
};

export function SingleBookCardSkeleton() {
  return (
    <div className="w-full">
      <div className="h-64 md:h-72 rounded-md bg-gray-100 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800 mb-3 animate-pulse" />
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
