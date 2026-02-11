"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiBookmark } from "react-icons/fi";
import {
  useBookmarkBookMutation,
  useUnbookmarkBookMutation,
  useGetIsBookBookmarkedQuery,
} from "@/app/store/api/bookmarksApi";
import { BookCardProps } from "@/app/types/book";
import { motion } from "motion/react";

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  coverImage,
  rating,
  donor,
  onClick,
  className = "",
}) => {
  const [bookmarkBook] = useBookmarkBookMutation();
  const [unbookmarkBook] = useUnbookmarkBookMutation();
  const { data: bookmarkStatus } = useGetIsBookBookmarkedQuery(id || "", {
    skip: !id,
  });

  const isBookmarked = bookmarkStatus?.bookmarked;

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    if (isBookmarked) {
      await unbookmarkBook(id);
    } else {
      await bookmarkBook(id);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer transition-colors duration-200 ${className}`}
    >
      <div className="relative h-64 md:h-72 rounded-md overflow-hidden mb-3 border border-gray-100 dark:border-white/10">
        <Image
          src={
            coverImage &&
            (coverImage.startsWith("/") ||
              coverImage.startsWith("http://") ||
              coverImage.startsWith("https://"))
              ? coverImage
              : "/dummycover.png"
          }
          alt={title}
          fill
          className="object-cover"
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

        {id && (
          <button
            onClick={handleBookmark}
            className={`absolute top-2 left-2 p-1.5 rounded-md transition-all duration-200 ${
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
      </div>
      <h3 className="font-medium text-gray-900 dark:text-neutral-100 text-sm line-clamp-1 mb-0.5">
        {title}
      </h3>
      <p className="text-[10px] text-gray-500 dark:text-neutral-400 line-clamp-1 font-medium uppercase tracking-wider">
        {author}
      </p>
      {donor?.username && (
        <Link
          href={`/app/profile/${donor.username}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] text-gray-400 dark:text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 mt-0.5 block truncate transition-colors"
        >
          Donated by <span className="hover:underline">{donor.username}</span>
        </Link>
      )}
    </div>
  );
};

export function SingleBookCardSkeleton() {
  return (
    <div className="w-full">
      <div className="relative h-64 md:h-72 rounded-md bg-gray-100 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800 overflow-hidden mb-3">
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 dark:via-white/5 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded-md w-4/5 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 dark:via-white/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />
        </div>
        <div className="h-3 bg-gray-50 dark:bg-neutral-800/50 rounded-md w-2/5 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 dark:via-white/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </div>
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
