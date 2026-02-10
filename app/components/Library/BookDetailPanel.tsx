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
import { useGetMeQuery } from "@/app/store/api/usersApi";
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
  const [removeBookFromFolder] = useRemoveBookFromFolderMutation();
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [bookFolders, setBookFolders] = useState<string[]>([]);

  const { data: bookmarkStatus } = useGetIsBookBookmarkedQuery(book?.id || "", {
    skip: !book?.id,
  });
  const [bookmarkBook] = useBookmarkBookMutation();
  const [unbookmarkBook] = useUnbookmarkBookMutation();

  const { data: userData } = useGetMeQuery();
  const [updateCover] = useUpdateBookCoverMutation();
  const [updateFile] = useUpdateBookFileMutation();

  const { data: myRatingData } = useGetMyRatingQuery(book?.id || "", {
    skip: !book?.id,
  });
  const [rateBook] = useRateBookMutation();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBookmarked = bookmarkStatus?.bookmarked;
  const isOwner =
    userData?.id && book?.donor?.id ? userData.id === book.donor.id : false;

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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full md:w-2/4 lg:w-2/8 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white p-8 flex flex-col shadow-2xl z-50"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg transition-all duration-200 group"
              aria-label="Close"
            >
              <FiX className="w-6 h-6 text-emerald-100 group-hover:text-white" />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
              <div className="relative aspect-2/3 w-48 md:w-56 mx-auto rounded-2xl overflow-hidden shadow-2xl mb-8 ring-4 ring-emerald-700/30 group">
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

              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold leading-tight">
                    {book?.title}
                  </h2>
                </div>
                <p className="text-emerald-300 font-medium mb-2">
                  {book?.author}
                </p>
                {book?.donor?.username && (
                  <Link
                    href={`/app/profile/${book.donor.username}`}
                    className="text-emerald-100/60 text-sm hover:text-emerald-200 transition-colors group block"
                    onClick={() => onClose()}
                  >
                    Donated by{" "}
                    <span className="text-white font-semibold group-hover:underline">
                      {book.donor.username}
                    </span>
                  </Link>
                )}

                <div className="mt-4 flex flex-col items-center">
                  <p className="text-xs text-emerald-200/50 uppercase tracking-wider mb-2 font-bold">
                    Your Rating
                  </p>
                  <StarRating
                    rating={userRating}
                    interactive
                    onRate={handleRate}
                    size={24}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <div className="text-center bg-emerald-800/40 rounded-xl py-3 px-2">
                  <p className="text-xl font-bold text-white">
                    {book?.pages || "-"}
                  </p>
                  <p className="text-xs text-emerald-200 font-medium mt-1">
                    Pages
                  </p>
                </div>
                <div className="text-center bg-emerald-800/40 rounded-xl py-3 px-2">
                  <p className="text-xl font-bold text-white">
                    {book?.publishedYear || "-"}
                  </p>
                  <p className="text-xs text-emerald-200 font-medium mt-1">
                    Year
                  </p>
                </div>
                <div className="text-center bg-white/5 backdrop-blur-sm rounded-xl py-3 px-2 border border-white/5">
                  <p className="text-xl font-bold text-white capitalize truncate">
                    {book?.category || "-"}
                  </p>
                  <p className="text-xs text-emerald-20 font-medium mt-1">
                    Category
                  </p>
                </div>
              </div>

              <div className="mb-8 flex-1 flex-col min-h-0">
                <h3 className="text-sm font-semibold text-emerald-200 mb-2 uppercase tracking-wider">
                  About this book
                </h3>
                <div className="custom-scrollbar overflow-y-auto flex-1 pr-2">
                  <p className="text-sm text-emerald-100 leading-relaxed">
                    {book?.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 mt-8">
                <h3 className="text-xs font-bold text-emerald-200/50 uppercase tracking-wider mb-6">
                  Reviews & Discussion
                </h3>
                <BookReviews bookId={book?.id || ""} />
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <div className="flex gap-3">
                <button
                  onClick={() => router.push(`/app/books/${book?.slug}`)}
                  className="flex-1 bg-white dark:bg-neutral-800 text-emerald-900 dark:text-neutral-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-emerald-50 transform hover:scale-[1.02]"
                >
                  <FiBookOpen className="w-5 h-5" />
                  <span>Read Now</span>
                </button>

                <button
                  onClick={handleBookmark}
                  className={`bg-emerald-800/40 hover:bg-emerald-700/60 p-4 rounded-xl flex items-center justify-center transition-all duration-200 border border-emerald-500/30 ${isBookmarked ? "text-emerald-300 bg-emerald-800/70" : "text-emerald-100"}`}
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
                  className="w-full bg-emerald-700/50 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-between transition-all duration-200 border border-emerald-600/50"
                >
                  <div className="flex items-center space-x-2">
                    <FiBookmark className="w-4 h-4" />
                    <span>Add to Folder</span>
                  </div>
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform ${
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
