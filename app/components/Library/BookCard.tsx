"use client";

import Image from "next/image";
import Link from "next/link";
import { FiStar, FiBookmark } from "react-icons/fi";
import {
  useBookmarkBookMutation,
  useUnbookmarkBookMutation,
  useGetIsBookBookmarkedQuery,
} from "@/app/store/api/bookmarksApi";
import { Book, BookCardProps } from "@/app/types/book";

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
      className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div className="relative h-65 rounded-xl overflow-hidden shadow-lg mb-3">
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
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {rating && (
            <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
              <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-white font-medium">{rating}</span>
            </div>
          )}
        </div>

        {id && (
          <button
            onClick={handleBookmark}
            className={`absolute top-2 left-2 p-1.5 rounded-lg backdrop-blur-sm transition-colors ${
              isBookmarked
                ? "bg-emerald-500 text-white"
                : "bg-black/40 text-white hover:bg-emerald-500"
            }`}
          >
            <FiBookmark
              className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        )}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-neutral-100 text-sm line-clamp-1 mb-1">
        {title}
      </h3>
      <p className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-1">
        {author}
      </p>
      {donor?.username && (
        <Link
          href={`/app/profile/${donor.username}`}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] text-emerald-600 hover:text-emerald-700 group mt-0.5 block truncate"
        >
          Donated by{" "}
          <span className=" group-hover:underline"> {donor.username}</span>
        </Link>
      )}
    </div>
  );
};
