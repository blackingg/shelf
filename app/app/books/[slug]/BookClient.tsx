"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  FiFileText,
  FiFolderPlus,
  FiPlay,
  FiShare2,
  FiArrowLeft,
  FiSearch,
} from "react-icons/fi";
import processDescription from "../../../helpers/processDescription";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/app/components/Form/Button";
import { BackButton } from "@/app/components/Layout/BackButton";
import { FolderDropdown } from "@/app/components/Library/FolderDropdown";
import {
  useBookBySlug,
  useRatings,
  useBooks,
  useRecommendedBooks,
  useUser,
} from "@/app/services";
import { StarRating } from "@/app/components/Library/StarRating";
import { BookReviews } from "@/app/components/Library/BookReviews";
import BookDetailSkeleton from "@/app/components/Skeletons/BookDetailSkeleton";
import { shareContent } from "@/app/helpers/share";

export default function BookClient() {
  const router = useRouter();
  const params = useParams();
  const bookSlug = params.slug as string;
  const { isAuthenticated } = useUser();
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  const { book, isLoading: isLoadingBook } = useBookBySlug(bookSlug);

  useEffect(() => {
    if (book?.id) {
      setShowFolderDropdown(false);
    }
  }, [book?.id]);

  const actualBookId = book?.id || "";
  const departmentFilter = book?.departmentRef?.id || book?.department;

  const { myRating, actions: ratingActions } = useRatings(actualBookId);

  const { books: allDepartmentBooks, isLoading: isLoadingDepartment } =
    useBooks(
      departmentFilter ? { department: departmentFilter, limit: 12 } : {},
    );

  const { books: allSimilarBooks, isLoading: isLoadingSimilar } = useBooks(
    book?.category ? { category: book.category, limit: 12 } : {},
  );

  const { books: trendingBooks, isLoading: isLoadingTrending } =
    useRecommendedBooks(5);

  const recommendedBooks = trendingBooks
    .filter((b: any) => b.id !== book?.id)
    .slice(0, 3);

  const recommendedBookIds = new Set(recommendedBooks.map((b: any) => b.id));

  const departmentBooks = allDepartmentBooks
    .filter((b: any) => b.id !== book?.id && !recommendedBookIds.has(b.id))
    .slice(0, 3);

  const departmentBookIds = new Set(departmentBooks.map((b: any) => b.id));

  const similarBooks = allSimilarBooks
    .filter(
      (b: any) =>
        b.id !== book?.id &&
        !recommendedBookIds.has(b.id) &&
        !departmentBookIds.has(b.id),
    )
    .slice(0, 3);

  // Priority: recommendations -> same department -> same category fallback.
  const displayBooks = [
    ...recommendedBooks,
    ...departmentBooks,
    ...similarBooks,
  ].slice(0, 3);
  const needsDepartmentFallback = recommendedBooks.length < 3;
  const needsCategoryFallback =
    recommendedBooks.length + departmentBooks.length < 3;
  const isMoreLoading =
    isLoadingTrending ||
    (needsDepartmentFallback && isLoadingDepartment) ||
    (needsCategoryFallback && isLoadingSimilar);

  const handleRate = async (newRating: number) => {
    await ratingActions.rateBook(newRating);
  };

  const handleShare = async () => {
    if (!book) return;
    await shareContent({
      title: `${book.title}`,
      text: `Check out ${book.title} by ${book.author} on Shelf.`,
      url: window.location.href,
    });
  };

  return (
    <div className="flex min-h-full bg-white dark:bg-neutral-900 w-full">
      <div className="flex-1 flex flex-col">
        <div className="bg-gray-50/50 dark:bg-neutral-900/50 border-b border-gray-100 dark:border-neutral-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 flex justify-between items-start">
            <BackButton />
            <button
              onClick={handleShare}
              className="p-2 sm:p-2.5 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-500 dark:text-neutral-400 rounded-md transition-colors border border-gray-100 dark:border-neutral-700/50 shadow-xs"
              title="Share Resource"
            >
              <FiShare2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {isLoadingBook ? (
            <div className="">
              <BookDetailSkeleton />
            </div>
          ) : !book ? (
            <div className="px-4 py-10 sm:py-12">
              <div className="max-w-4xl mx-auto border border-gray-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900 px-6 py-10 sm:px-8 sm:py-12">
                <div className="max-w-xl text-left space-y-5">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>404 resource missing</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-center">
                      <FiFileText className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-medium text-gray-900 dark:text-white">
                      Book Not Found
                    </h2>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                    The resource you are looking for does not exist.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => router.push("/app/discover")}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-md text-sm font-medium transition-colors hover:bg-emerald-700 active:bg-emerald-800"
                    >
                      <FiSearch className="w-4 h-4" />
                      Explore Library
                    </button>
                    <button
                      onClick={() => router.back()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <FiArrowLeft className="w-4 h-4" />
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 md:pb-12 lg:pb-16 pt-8 md:pt-12 lg:pt-16">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 lg:gap-16 items-start">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-60 sm:max-w-[280px] md:max-w-none md:w-1/3 lg:w-1/4 shrink-0 mx-auto md:mx-0"
                >
                  <div className="relative aspect-2/3 w-full rounded-md overflow-hidden bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700/50">
                    <img
                      src={book.coverImage || "/dummycover.png"}
                      alt={book.title}
                      className="object-cover"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 space-y-6 md:space-y-8 w-full min-w-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-md text-[10px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-800/50">
                        {book.category}
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 leading-tight wrap-break-word">
                      {book.title}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-500 dark:text-neutral-400 font-medium wrap-break-word">
                      {book.author}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 sm:gap-8 md:gap-10 border-y border-gray-100 dark:border-neutral-800 py-6 sm:py-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-neutral-500 mb-2">
                        Resource Rating
                      </span>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <StarRating
                          rating={book.rating || 0}
                          size={18}
                        />
                        <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                          {book.rating?.toFixed(1) || "5.0"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 dark:text-neutral-500 mb-2">
                        Total Pages
                      </span>
                      <div className="flex items-center text-gray-900 dark:text-neutral-200">
                        <FiFileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-500" />
                        <span className="text-base sm:text-lg font-bold">
                          {book.pages}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                    <div className="w-full sm:w-48">
                      <button
                        onClick={() =>
                          router.push(`/app/books/${book.slug}/read`)
                        }
                        className="w-full py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 sm:gap-3"
                      >
                        <FiPlay className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                        <span>Read Now</span>
                      </button>
                    </div>

                    {isAuthenticated && (
                      <div className="relative w-full sm:w-auto">
                        <button
                          onClick={() =>
                            setShowFolderDropdown(!showFolderDropdown)
                          }
                          className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border rounded-md font-bold text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 sm:gap-3 ${
                            showFolderDropdown
                              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600"
                              : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                          }`}
                        >
                          <FiFolderPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Save to Folder</span>
                        </button>

                        <FolderDropdown
                          isOpen={showFolderDropdown}
                          onClose={() => setShowFolderDropdown(false)}
                          bookId={actualBookId}
                          className="top-full mt-3 w-full sm:w-80 max-w-[calc(100vw-2rem)]"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>

        {!isLoadingBook && book && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="lg:col-span-2 space-y-12 sm:space-y-16 min-w-0">
                <section className="min-w-0">
                  <h3 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-4 sm:mb-6">
                    Overview
                  </h3>
                  <p className="text-gray-600 dark:text-neutral-300 leading-relaxed text-base sm:text-lg font-medium wrap-break-word">
                    {processDescription(book.description)}
                  </p>
                </section>

                <section className="bg-gray-50/50 dark:bg-neutral-800/30 p-6 sm:p-8 md:p-12 rounded-lg border border-gray-100 dark:border-neutral-800 min-w-0">
                  <div className="mb-8 sm:mb-10">
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-2">
                      Community
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white wrap-break-word">
                      Reviews & Discussion
                    </h2>
                  </div>
                  <BookReviews bookId={actualBookId} />
                </section>
              </div>

              <div className="space-y-8 sm:space-y-12 min-w-0">
                <section className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-lg border border-gray-100 dark:border-neutral-800">
                  <h3 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-6 sm:mb-8">
                    Resource Stats
                  </h3>
                  <div className="space-y-6 sm:space-y-8">
                    <div className="flex flex-col gap-2 min-w-0">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Contributor
                      </span>
                      {book.donor?.username && (
                        <a
                          href={`/app/profile/${encodeURIComponent(book.donor.username.replace(/\s+/g, ""))}`}
                          className="font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3 min-w-0"
                        >
                          <div className="w-7 h-7 rounded-md bg-emerald-50 dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center text-[11px] font-bold shrink-0">
                            {book.donor.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="truncate underline-offset-2 hover:underline">
                            @{book.donor.username}
                          </span>
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Published
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {book.publishedYear || "Unknown Date"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Rating
                      </span>
                      <div className="flex items-center gap-3">
                        <StarRating
                          rating={book.rating || 0}
                          size={18}
                        />
                        <span className="font-bold text-gray-900 dark:text-white">
                          {book.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-neutral-800">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Your Rating
                        </span>
                        <div className="pt-1">
                          <StarRating
                            rating={myRating || 0}
                            interactive={isAuthenticated}
                            onRate={handleRate}
                            size={22}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section className="min-w-0">
                  <h3 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-6 sm:mb-8">
                    Recommended Resources
                  </h3>
                  <div className="space-y-4">
                    {isMoreLoading ? (
                      [1, 2, 3].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-4 animate-pulse p-3"
                        >
                          <div className="w-14 h-20 bg-gray-100 dark:bg-neutral-800 rounded-md shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 dark:bg-neutral-800 rounded w-1/2" />
                          </div>
                        </div>
                      ))
                    ) : displayBooks.length > 0 ? (
                      displayBooks.map((similarBook: any) => (
                        <div
                          key={similarBook.id}
                          onClick={() =>
                            router.push(`/app/books/${similarBook.slug}`)
                          }
                          className="flex items-center space-x-3 sm:space-x-4 group cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md transition-colors min-w-0"
                        >
                          <div className="w-12 h-16 sm:w-14 sm:h-20 bg-gray-100 dark:bg-neutral-800 rounded-md shrink-0 overflow-hidden border border-gray-200 dark:border-neutral-700/50">
                            {similarBook.coverImage ? (
                              <img
                                src={similarBook.coverImage}
                                alt={similarBook.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center font-bold text-emerald-500/10 text-[10px]">
                                SHELF
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900 dark:text-neutral-200 group-hover:text-emerald-600 transition-colors truncate text-sm">
                              {similarBook.title}
                            </p>
                            <p className="text-[10px] font-bold uppercase text-gray-400 mt-1 tracking-wider opacity-60 truncate">
                              {similarBook.author}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-2">
                        <Button
                          variant="outline"
                          className="text-[10px] uppercase font-bold tracking-widest py-2"
                          onClick={() => router.push("/app/discover")}
                        >
                          Discover More
                        </Button>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
