import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiStar,
  FiBookOpen,
  FiX,
  FiBookmark,
  FiChevronDown,
  FiCamera,
  FiFileText,
  FiEdit3,
} from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";
import { FolderDropdown } from "./FolderDropdown";
import { BookPreview } from "@/app/types/book";
import {
  useAddBookToFolderMutation,
  useRemoveBookFromFolderMutation,
} from "@/app/store/api/foldersApi";
import { useNotifications } from "@/app/context/NotificationContext";
import {
  useBookmarkBookMutation,
  useUnbookmarkBookMutation,
  useGetIsBookBookmarkedQuery,
} from "@/app/store/api/bookmarksApi";
import {
  useUpdateBookCoverMutation,
  useUpdateBookFileMutation,
} from "@/app/store/api/booksApi";
import { getErrorMessage } from "@/app/helpers/error";
import { StarRating } from "./StarRating";
import { BookReviews } from "./BookReviews";
import {
  useGetMyRatingQuery,
  useRateBookMutation,
} from "@/app/store/api/ratingsApi";

export const BookDetailPanel: React.FC<{
  book: BookPreview | null;
  onClose: () => void;
  isOpen: boolean;
}> = ({ book, onClose, isOpen }) => {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [addBookToFolder] = useAddBookToFolderMutation();
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [bookFolders, setBookFolders] = useState<string[]>([]);
  const { data: bookmarkStatus } = useGetIsBookBookmarkedQuery(book?.id || "", {
    skip: !book?.id,
  });
  const { data: myRatingData } = useGetMyRatingQuery(book?.id || "", {
    skip: !book?.id,
  });
  const [bookmarkBook] = useBookmarkBookMutation();
  const [unbookmarkBook] = useUnbookmarkBookMutation();
  const [updateCover] = useUpdateBookCoverMutation();
  const [updateFile] = useUpdateBookFileMutation();
  const [rateBook] = useRateBookMutation();
  const isBookmarked = bookmarkStatus?.bookmarked;
  const [removeBookFromFolder] = useRemoveBookFromFolderMutation();
  const userRating = myRatingData?.rating || 0;

  const handleRate = async (newRating: number) => {
    if (!book?.id) return;
    try {
      await rateBook({ bookId: book.id, rating: newRating }).unwrap();
    } catch (error) {
      // Error handled by optimistic update undo
    }
  };

  const handleSaveToFolder = async (folderId: string) => {
    if (!book?.id) return;
    try {
      if (bookFolders.includes(folderId)) {
        await removeBookFromFolder({ id: folderId, bookId: book.id }).unwrap();
        setBookFolders(bookFolders.filter((id) => id !== folderId));
        addNotification("success", "Book removed from folder");
      } else {
        await addBookToFolder({
          id: folderId,
          data: { bookId: book.id },
        }).unwrap();
        setBookFolders([...bookFolders, folderId]);
        addNotification("success", "Book added to folder");
      }
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update folder"),
      );
    }
  };

  const handleBookmark = async () => {
    if (!book?.id) return;
    try {
      if (isBookmarked) {
        await unbookmarkBook(book.id).unwrap();
        addNotification("success", "Book removed from bookmarks");
      } else {
        await bookmarkBook(book.id).unwrap();
        addNotification("success", "Book bookmarked");
      }
    } catch (err) {
      addNotification("error", "Failed to update bookmark");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && book?.id) {
      try {
        await updateCover({ id: book.id, file }).unwrap();
        addNotification("success", "Cover updated successfully");
      } catch (err) {
        addNotification(
          "error",
          getErrorMessage(err, "Failed to update cover"),
        );
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && book?.id) {
      try {
        await updateFile({ id: book.id, file }).unwrap();
        addNotification("success", "File updated successfully");
      } catch (err) {
        addNotification("error", getErrorMessage(err, "Failed to update file"));
      }
    }
  };

  return (
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
            className="fixed top-0 right-0 h-full w-full md:w-2/4 lg:w-2/8 bg-emerald-950 text-white p-6 md:p-8 flex flex-col border-l border-emerald-800 z-50"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-md transition-colors duration-200 group"
              aria-label="Close"
            >
              <FiX className="w-6 h-6 text-emerald-100 group-hover:text-white" />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar pt-12">
              <div className="relative aspect-2/3 w-48 md:w-56 mx-auto rounded-lg overflow-hidden border border-emerald-700/50 mb-8 group">
                <Image
                  src={
                    book?.coverImage &&
                    (book.coverImage.startsWith("/") ||
                      book.coverImage.startsWith("http"))
                      ? book.coverImage
                      : "/dummycover.png"
                  }
                  alt={book?.title || ""}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
              </div>

              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold leading-tight mb-2">
                  {book?.title}
                </h2>
                <p className="text-emerald-400 font-medium mb-2">
                  {book?.author}
                </p>
                {book?.donor?.username && (
                  <Link
                    href={`/app/profile/${book.donor.username}`}
                    className="text-emerald-100/60 text-sm hover:text-emerald-200 transition-colors group inline-block"
                    onClick={() => onClose()}
                  >
                    Donated by{" "}
                    <span className="text-white font-semibold hover:underline">
                      {book.donor.username}
                    </span>
                  </Link>
                )}

                <div className="mt-6 flex flex-col items-center">
                  <p className="text-[10px] text-emerald-300/50 uppercase tracking-widest mb-3 font-bold">
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

              <div className="grid grid-cols-3 gap-3 mb-10">
                <div className="text-center bg-emerald-900/50 rounded-md py-4 px-2 border border-emerald-800/50">
                  <p className="text-lg font-bold text-white leading-none mb-1">
                    {book?.pages || "-"}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Pages
                  </p>
                </div>
                <div className="text-center bg-emerald-900/50 rounded-md py-4 px-2 border border-emerald-800/50">
                  <p className="text-lg font-bold text-white leading-none mb-1">
                    {book?.publishedYear || "-"}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Year
                  </p>
                </div>
                <div className="text-center bg-emerald-900/50 rounded-md py-4 px-2 border border-emerald-800/50">
                  <p className="text-lg font-bold text-white leading-none mb-1 capitalize truncate">
                    {book?.category || "-"}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Category
                  </p>
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-[10px] font-black text-gray-400 dark:text-neutral-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-4 h-[1px] bg-current opacity-30" />
                  About this resource
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed font-medium">
                  {book?.description}
                </p>
              </div>

              <div className="border-t border-gray-100 dark:border-neutral-900 pt-8 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black text-gray-400 dark:text-neutral-600 uppercase tracking-widest">
                    Reviews & Discussion
                  </h3>
                  <Link
                    href={`/app/books/${book?.slug}`}
                    onClick={() => onClose()}
                    className="text-[10px] font-black text-emerald-600 hover:text-emerald-500 uppercase tracking-widest transition-colors flex items-center gap-1"
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

            <div className="space-y-4 mt-auto pt-8 border-t border-gray-100 dark:border-neutral-900 bg-white dark:bg-neutral-950">
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/app/books/${book?.slug}`)}
                  className="flex-1 h-14 bg-gray-900 dark:bg-white text-white dark:text-neutral-950 font-black text-[11px] uppercase tracking-widest rounded-md flex items-center justify-center gap-3 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <FiBookOpen className="w-4 h-4" />
                  <span>Read Resource</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`w-14 h-14 rounded-md flex items-center justify-center transition-all duration-200 border ${
                    isBookmarked
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-400 dark:text-neutral-500 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                  title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
                >
                  <FiBookmark
                    className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
                  />
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                  className="w-full h-12 bg-gray-50/50 dark:bg-neutral-900/40 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-neutral-400 font-bold text-[10px] uppercase tracking-widest px-6 rounded-md flex items-center justify-between transition-all duration-200 border border-gray-100 dark:border-neutral-800 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <FiBookmark className="w-4 h-4" />
                    <span>Organize into Folder</span>
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
                  onSaveToFolder={handleSaveToFolder}
                  currentBookFolders={bookFolders}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
