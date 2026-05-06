import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiBookOpen,
  FiX,
  FiBookmark,
  FiChevronDown,
  FiFolderPlus,
} from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { FolderDropdown } from "./FolderDropdown";
import { BookPreview } from "@/app/types/book";
import {
  useIsBookBookmarked,
  useBookBookmarkActions,
  useMyRating,
  useRatingActions,
  useGetBookBySlugQuery,
  useUser,
} from "@/app/services";
import { StarRating } from "./StarRating";
import { BookReviews } from "./BookReviews";
import processDescription from "@/app/helpers/processDescription";

export const BookDetailPanel: React.FC<{
  book: BookPreview | null;
  onClose: () => void;
  isOpen: boolean;
}> = ({ book, onClose, isOpen }) => {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const { data: bookDetails } = useGetBookBySlugQuery(String(book?.slug));
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const { isBookmarked } = useIsBookBookmarked(book?.id || "");
  const { toggleBookmark } = useBookBookmarkActions();
  const { rating: userRating } = useMyRating(book?.id || "");
  const { rateBook } = useRatingActions();

  useEffect(() => {
    if (book?.id) {
      setShowFolderDropdown(false);
    }
  }, [book?.id]);

  const handleRate = async (newRating: number) => {
    if (!book?.id) return;
    await rateBook(book.id, newRating);
  };

  const handleBookmark = async () => {
    if (!book?.id) return;
    await toggleBookmark(book.id, !!isBookmarked);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 top-0 bottom-0 h-full md:top-0 md:bottom-auto md:inset-x-auto md:right-0 md:h-full w-full md:w-lg max-w-full bg-emerald-950 text-white p-4 sm:p-6 md:p-8 flex flex-col border-t md:border-t-0 md:border-l border-neutral-800 z-50"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 hover:bg-white/10 rounded-sm transition-colors duration-200 group"
                aria-label="Close"
              >
                <FiX className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar pt-10 md:pt-12 pr-1">
                <div>
                  <div
                    className={`relative aspect-2/3 w-36 sm:w-44 md:w-56 mx-auto rounded-sm overflow-hidden border border-white/10 mb-6 md:mb-8 group`}
                  >
                    <img
                      src={
                        book?.coverImage &&
                        (book.coverImage.startsWith("/") ||
                          book.coverImage.startsWith("http"))
                          ? book.coverImage
                          : "/dummycover.png"
                      }
                      alt={book?.title || ""}
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />
                  </div>

                  <div className="text-center mb-8 md:mb-10">
                    <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-2 wrap-break-word px-2">
                      {book?.title}
                    </h2>
                    <p className="text-primary font-medium mb-2 text-sm sm:text-base px-2 wrap-break-word">
                      {book?.author}
                    </p>
                    {book?.donor?.username && (
                      <Link
                        href={`/profile/${encodeURIComponent(book.donor.username.replace(/\s+/g, ""))}`}
                        className="text-primary/70 text-xs sm:text-sm inline-block"
                        onClick={() => onClose()}
                      >
                        Donated by{" "}
                        <span className="text-white font-semibold underline-offset-2 hover:underline">
                          {book.donor.username}
                        </span>
                      </Link>
                    )}

                    <div className="mt-5 md:mt-6 flex flex-col items-center">
                      <p className="text-[10px] text-primary/50 uppercase tracking-widest mb-3 font-bold">
                        Your Rating
                      </p>
                      <StarRating
                        rating={userRating}
                        interactive
                        onRate={handleRate}
                        size={20}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8 md:mb-10">
                  <div className="text-center bg-white/5 rounded-sm py-4 px-2 border border-white/10">
                    <p className="text-lg font-bold text-white leading-none mb-1">
                      {book?.pages || "-"}
                    </p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      Pages
                    </p>
                  </div>
                  <div className="text-center bg-white/5 rounded-sm py-4 px-2 border border-white/10">
                    <p className="text-lg font-bold text-white leading-none mb-1">
                      {typeof book?.rating === "number"
                        ? book.rating.toFixed(1)
                        : "-"}
                    </p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      Rating
                    </p>
                  </div>
                  <div className="text-center bg-white/5 rounded-sm py-4 px-2 border border-white/10">
                    <p className="text-lg font-bold text-white leading-none mb-1 capitalize truncate">
                      {book?.category || "-"}
                    </p>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                      Category
                    </p>
                  </div>
                </div>

                  <div className="mb-10 md:mb-12">
                    <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                      <div className="w-4 h-px bg-current opacity-30" />
                      About this resource
                    </h3>
                    <p className="text-sm indent-6 text-white/80 whitespace-normal text-justify leading-relaxed font-medium">
                      {processDescription(String(bookDetails?.description))}
                    </p>
                  </div>

                <div className="border-t border-white/10 pt-6 md:pt-8 mb-6 md:mb-8">
                  <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
                    <h3 className="text-[10px] font-black text-primary/60 uppercase tracking-widest">
                      Reviews & Discussion
                    </h3>
                    <Link
                      href={`/books/${book?.slug}`}
                      onClick={() => onClose()}
                      className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-widest transition-colors flex items-center gap-1 shrink-0"
                    >
                      Expand Thread
                      <FiChevronDown className="-rotate-90 w-3 h-3" />
                    </Link>
                  </div>
                  <BookReviews
                    bookId={book?.id || ""}
                    limit={3}
                    hideForm
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 mt-auto pt-5 md:pt-8 pb-[max(env(safe-area-inset-bottom),0.25rem)]">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => router.push(`/books/${book?.slug}`)}
                    className="h-12 sm:h-14 bg-white text-neutral-950 font-black text-[10px] sm:text-[11px] uppercase tracking-widest rounded-sm flex flex-1 items-center justify-center gap-2 sm:gap-3 transition-all duration-200"
                  >
                    <FiBookOpen className="w-4 h-4" />
                    <span>Read Now</span>
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={handleBookmark}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-sm flex items-center justify-center transition-all duration-200 border ${
                        isBookmarked
                          ? "bg-white text-primary dark:bg-primary dark:text-primary-foreground border-transparent shadow-sm"
                          : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-primary hover:border-primary"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                    >
                      <FiBookmark
                        className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                      />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => typeof setShowFolderDropdown === 'function' && setShowFolderDropdown(!showFolderDropdown)}
                    className="w-full bg-white/5 hover:bg-white/10 text-primary font-semibold py-3 px-4 sm:px-6 rounded-sm flex items-center justify-between transition-all duration-200 border border-white/10 hover:border-primary/50"
                  >
                    <div className="flex items-center gap-3">
                      <FiFolderPlus />
                      <span>Add to Folder</span>
                    </div>
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        showFolderDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <FolderDropdown
                    isOpen={showFolderDropdown}
                    onClose={() => setShowFolderDropdown(false)}
                    bookId={book?.id || ""}
                    bookTitle={book?.title || undefined}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
