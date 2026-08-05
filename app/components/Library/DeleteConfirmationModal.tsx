"use client";
import { useNotifications } from "@/app/context/NotificationContext";
import { Book, BookPreview } from "@/app/types/book";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiTrash, FiX } from "react-icons/fi";
import { useBookActions } from "@/app/services";
import { SpinnerLoader } from "../Loader/SpinnerLoader";

export const DeleteModal: React.FC<{
  isOpen: boolean;
  book: BookPreview | null;
  onClose: () => void;
}> = ({ isOpen, book, onClose }) => {
  const { actions: bookActions, isDeleting } = useBookActions();
  const [inputSlug, updateInputSlug] = useState("");
  const { addNotification } = useNotifications();
  const router = useRouter();

  const deleteHandler = async (id: string) => {
    if (inputSlug === book?.slug) {
      await bookActions.deleteBook(id);
      addNotification("success", "Book Deleted Successfully");
      onClose();
      router.push("/library");
    } else {
      addNotification(
        "error",
        "Please ensure that the slugs match before attempting to delete the file",
      );
    }
  };

  return (
    isOpen &&
    book && (
      <AnimatePresence>
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        />
        <motion.div
          key="panel"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-x-0 top-0 bottom-0 h-full md:top-0 md:bottom-auto md:inset-x-auto md:right-0 md:h-full w-full md:w-lg max-w-full bg-emerald-950 text-white flex flex-col p-4 sm:p-6 md:p-8 border-t md:border-t-0 md:border-l border-emerald-800 z-50"
        >
          <div className="flex justify-end">
            <FiX
              onClick={onClose}
              className=" w-6 h-6 hover:font-bold hover:text-red-600 my-6"
            />
          </div>
          <div className="md:my-4">
            <p className="text-xl">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold">{book?.title}</span> from Shelf?
            </p>
            <p className="text-sm font-light my-1">
              Once taken, this action cannot be reversed
            </p>
          </div>
          <p>
            Please enter the following slug to confirm:
            <span className="font-bold block">{book?.slug} </span>
          </p>
          <input
            type="text"
            className="font-lg border-2 outline-0 my-2 w-4/5 md:p-2 p-1 rounded-lg border-white bg-gray-300/40"
            onChange={(e) => updateInputSlug(e.target.value)}
          />
          <button
            className="justify-self-center flex justify-center gap-x-2 items-center text-center border-2 border-emerald-500/45 p-2 rounded-xl my-2 hover:bg-red-600/65 hover:font-bold shrink-0"
            onClick={() => deleteHandler(book?.id)}
          >
            {isDeleting ? (
              <>
                <SpinnerLoader />
                Deleting...
              </>
            ) : (
              <span>Delete Item</span>
            )}
          </button>
        </motion.div>
      </AnimatePresence>
    )
  );
};
