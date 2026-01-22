import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiStar,
  FiBookOpen,
  FiX,
  FiBookmark,
  FiChevronDown,
} from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { FolderDropdown } from "./FolderDropdown";
import { BookPreview } from "@/app/types/book";
import {
  useAddBookToFolderMutation,
  useRemoveBookFromFolderMutation,
} from "@/app/store/api/foldersApi";
import { useNotifications } from "@/app/context/NotificationContext";

export const BookDetailPanel: React.FC<{
  book: BookPreview;
  onClose: () => void;
  isOpen: boolean;
}> = ({ book, onClose, isOpen }) => {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [addBookToFolder] = useAddBookToFolderMutation();
  const [removeBookFromFolder] = useRemoveBookFromFolderMutation();
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);
  const [bookFolders, setBookFolders] = useState<string[]>([]);

  const handleSaveToFolder = async (folderId: string) => {
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
      addNotification("error", "Failed to update folder");
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
            <div className="relative aspect-[2/3] w-38 md:w-48 mx-auto rounded-2xl overflow-hidden shadow-2xl mb-6 ring-4 ring-emerald-700/30">
              <Image
                src={book.cover_image}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center leading-tight">
              {book.title}
            </h2>
            <p className="text-emerald-600 dark:text-emerald-200 text-center mb-2 font-medium">
              {book.author}
            </p>
            <p className="text-emerald-200/80 text-center mb-6 text-sm">
              Donated by{" "}
              <Link
                href={`/app/profile/${book.donor_id}`}
                className="text-white hover:text-emerald-200 hover:underline font-semibold transition-colors"
                onClick={() => onClose()}
              >
                {book.donor_id}
              </Link>
            </p>
            {/* <div className="flex items-center justify-center space-x-1 mb-6 bg-emerald-800/50 rounded-xl py-3 px-4">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(book.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-emerald-600"
                  }`}
                />
              ))}
              <span className="ml-2 font-bold text-lg">{book.rating || 0}</span>
            </div> */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center bg-emerald-800/40 rounded-xl py-3 px-2">
                <p className="text-2xl font-bold text-white">
                  {book.pages || "-"}
                </p>
                <p className="text-xs text-emerald-200 font-medium mt-1">
                  Pages
                </p>
              </div>
              <div className="text-center bg-emerald-800/40 rounded-xl py-3 px-2">
                <p className="text-2xl font-bold text-white">
                  {book.published_year || "-"}
                </p>
                <p className="text-xs text-emerald-200 font-medium mt-1">
                  Published
                </p>
              </div>
              <div className="text-center bg-emerald-800/40 rounded-xl py-3 px-2">
                <p className="text-2xl font-bold text-white capitalize">
                  {book.category || "-"}
                </p>
                <p className="text-xs text-emerald-200 font-medium mt-1">
                  Category
                </p>
              </div>
            </div>
            <div className="mb-6 flex-1 flex flex-col min-h-0">
              <h3 className="text-sm font-semibold text-emerald-200 mb-2 uppercase tracking-wide">
                About this book
              </h3>
              <div className="custom-scrollbar overflow-y-auto flex-1 pr-2">
                <p className="text-sm text-emerald-100 leading-relaxed">
                  {book.description}
                </p>
              </div>
            </div>
            <div className="space-y-3 mt-auto">
              <button
                onClick={() => router.push(`/app/books/${book.title}`)}
                className="w-full bg-white dark:bg-neutral-800 text-emerald-900 dark:text-neutral-300 font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:bg-emerald-50 transform hover:scale-[1.02]"
              >
                <FiBookOpen className="w-5 h-5" />
                <span>Read Now</span>
              </button>

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
