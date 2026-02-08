"use client";
import React, { useState } from "react";
import NextImage from "next/image";
import { motion } from "motion/react";
import {
  FiBook,
  FiStar,
  FiFileText,
  FiFolderPlus,
  FiPlay,
} from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/Form/Button";
import { FolderDropdown } from "@/app/components/Library/FolderDropdown";
import {
  useAddBookToFolderMutation,
  useRemoveBookFromFolderMutation,
} from "@/app/store/api/foldersApi";
import { useNotifications } from "@/app/context/NotificationContext";
import {
  useGetBookBySlugQuery,
} from "@/app/store/api/booksApi";
import {
  useGetMyRatingQuery,
  useRateBookMutation,
} from "@/app/store/api/ratingsApi";
import { StarRating } from "@/app/components/Library/StarRating";
import { BookReviews } from "@/app/components/Library/BookReviews";
import { getErrorMessage } from "@/app/helpers/error";
import BookDetailSkeleton from "@/app/components/Skeletons/BookDetailSkeleton";

export default function BookDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const bookSlug = params.slug as string;
  const { addNotification } = useNotifications();
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [savedFolders, setSavedFolders] = useState<string[]>([]);

  const { data: book, isLoading: isLoadingBook, isFetching: isFetchingBook } = useGetBookBySlugQuery(bookSlug, {
    skip: !bookSlug,
  });

  const actualBookId = book?.id || "";

  const { data: myRatingData } = useGetMyRatingQuery(actualBookId, {
    skip: !actualBookId,
  });
  const [rateBook] = useRateBookMutation();

  const [addBookToFolder] = useAddBookToFolderMutation();
  const [removeBookFromFolder] = useRemoveBookFromFolderMutation();

  const handleRate = async (newRating: number) => {
    try {
      await rateBook({ bookId: actualBookId, rating: newRating }).unwrap();
    } catch (error) {
      addNotification("error", getErrorMessage(error, "Failed to rate book"));
    }
  };

  const handleSaveToFolder = async (folderId: string) => {
    try {
      if (savedFolders.includes(folderId)) {
        await removeBookFromFolder({ id: folderId, bookId: actualBookId }).unwrap();
        setSavedFolders(savedFolders.filter((id) => id !== folderId));
        addNotification("success", "Book removed from folder");
      } else {
        await addBookToFolder({
          id: folderId,
          data: { bookId: actualBookId },
        }).unwrap();
        setSavedFolders([...savedFolders, folderId]);
        addNotification("success", "Book added to folder");
      }
    } catch (error) {
      addNotification("error", getErrorMessage(error, "Failed to update folder"));
    }
  };

  if (isLoadingBook) {
    return <BookDetailSkeleton />;
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Book Not Found
          </h2>
          <Button onClick={() => router.push("/app/library")}>
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 overflow-y-auto">
      <div className="flex-1 flex flex-col">
        <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-800 flex-shrink-0">
          <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
            <div className="flex flex-col md:flex-row gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0"
              >
                <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl bg-emerald-900 border-8 border-white dark:border-neutral-700">
                  <NextImage
                    src={
                      book.coverImage && (book.coverImage.startsWith("/") || book.coverImage.startsWith("http"))
                        ? book.coverImage
                        : "/dummycover.png"
                    }
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1"
              >
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
                    {book.category}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                  {book.title}
                </h1>
                <p className="text-2xl text-gray-600 dark:text-neutral-400 mb-8 font-serif italic">
                  by {book.author}
                </p>

                <div className="flex flex-wrap items-center gap-8 mb-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                      Rating
                    </span>
                    <div className="flex items-center">
                      <StarRating
                        rating={book.rating || 0}
                        size={24}
                        className="mr-3"
                      />
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {book.rating?.toFixed(1) || "5.0"}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({book.ratingsCount || 0} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                      Details
                    </span>
                    <div className="flex items-center text-gray-700 dark:text-neutral-200">
                      <FiFileText className="w-5 h-5 mr-2 text-emerald-500" />
                      <span className="text-lg font-semibold">
                        {book.pages} Pages
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-10 y-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">
                      Drop your rating
                    </p>
                    <StarRating
                      rating={myRatingData?.rating || 0}
                      interactive
                      onRate={handleRate}
                      size={32}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">  
                  <div className="w-full sm:w-48">
                    <Button
                      onClick={() => router.push(`/app/books/${book.slug}/read`)}
                      icon={<FiPlay className="w-5 h-5 fill-current" />}
                      className="w-full py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/20"
                    >
                      Read Now
                    </Button>
                  </div>

                  <div className="relative w-full sm:w-auto">
                    <button
                      onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                      className={`w-full sm:w-auto px-8 py-4 border-2 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 ${
                        showFolderDropdown
                          ? "border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                          : "border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 shadow-sm"
                      }`}
                    >
                      <FiFolderPlus className="w-5 h-5" />
                      <span>Save to Folder</span>
                    </button>

                    <FolderDropdown
                      isOpen={showFolderDropdown}
                      onClose={() => setShowFolderDropdown(false)}
                      currentBookFolders={savedFolders}
                      onSaveToFolder={handleSaveToFolder}
                      className="top-full mt-3 w-80 shadow-2xl"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-4">
                  Overview
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-neutral-300 leading-relaxed text-base">
                    {book.description}
                  </p>
                </div>
              </section>

              <section className="bg-white dark:bg-neutral-800 p-8 md:p-12 rounded-[2.5rem] border border-gray-200 dark:border-neutral-700 shadow-xl">
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Reviews & Community
                  </h2>
                  <p className="text-gray-500 dark:text-neutral-400">
                    Join the conversation about this resource.
                  </p>
                </div>
                <BookReviews bookId={actualBookId} />
              </section>
            </div>

            <div className="space-y-10">
              <section className="bg-white dark:bg-neutral-800 p-8 rounded-xl border border-gray-200 dark:border-neutral-700">
                <h3 className="font-black text-gray-900 dark:text-white mb-6 uppercase text-[10px] tracking-[0.2em] text-emerald-600">
                  Metadata
                </h3>
                <div className="space-y-6 text-sm">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-400 font-bold uppercase text-[9px]">
                      Contributor
                    </span>
                    <Link
                      href={`/app/profile/${book.donor?.username}`}
                      className="font-bold text-gray-900 dark:text-white hover:text-emerald-600 flex items-center gap-2 group"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-[10px]">
                        {book.donor?.username?.charAt(0).toUpperCase()}
                      </div>
                      @{book.donor?.username || "user"}
                    </Link>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-400 font-bold uppercase text-[9px]">
                      Published
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {book.publishedYear || "Unknown Date"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-400 font-bold uppercase text-[9px]">
                      Visibility
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      Public Resource
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-black text-gray-900 dark:text-white mb-6 uppercase text-[10px] tracking-[0.2em] text-emerald-600">
                  Similar Resources
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 group cursor-pointer p-3 hover:bg-white dark:hover:bg-neutral-800 rounded-2xl transition-all hover:shadow-md"
                    >
                      <div className="w-14 h-20 bg-gray-200 dark:bg-neutral-700 rounded-xl flex-shrink-0 overflow-hidden shadow-sm">
                        <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 flex items-center justify-center font-bold text-emerald-500/20 text-xs">
                          SHELF
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 dark:text-neutral-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors truncate">
                          Explore More Assets
                        </div>
                        <div className="text-[10px] font-black uppercase text-gray-400 mt-1 tracking-tighter">
                          {book.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
