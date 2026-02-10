import { useState } from "react";
import { FiFolder, FiPlus, FiCheck, FiAlertCircle, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";

import {
  useGetMeFoldersQuery,
  useCreateFolderMutation,
} from "@/app/store/api/foldersApi";
import { useNotifications } from "@/app/context/NotificationContext";

export const FolderDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSaveToFolder: (folderId: string) => void;
  currentBookFolders?: string[];
  className?: string;
}> = ({
  isOpen,
  onClose,
  onSaveToFolder,
  currentBookFolders = [],
  className = "bottom-full mb-2 w-full",
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const { addNotification } = useNotifications();

  const {
    data: folders = [],
    isLoading,
    isError,
  } = useGetMeFoldersQuery(undefined, {
    skip: !isOpen,
  });

  const [createFolder, { isLoading: isCreating }] = useCreateFolderMutation();

  const handleCreateFolder = async () => {
    if (newFolderName.trim() && !isCreating) {
      try {
        await createFolder({ name: newFolderName.trim() }).unwrap();
        setNewFolderName("");
        setIsCreatingNew(false);
        addNotification(
          "success",
          `Folder "${newFolderName.trim()}" created successfully`,
        );
      } catch (error) {
        addNotification(
          "error",
          `Failed to create folder "${newFolderName.trim()}"`,
        );
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden z-[70] ${className}`}
          >
            <div className="p-3 border-b border-gray-200 dark:border-neutral-800">
              <h3 className="font-semibold text-gray-900 dark:text-neutral-100 text-sm">
                Save to folder
              </h3>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="px-4 py-3 space-y-3">
                  {[1].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between animate-pulse"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-neutral-700 rounded" />
                        <div>
                          <div className="w-24 h-4 bg-gray-200 dark:bg-neutral-700 rounded mb-1" />
                          <div className="w-16 h-3 bg-gray-100 dark:bg-neutral-800 rounded" />
                        </div>
                      </div>
                      <div className="w-14 h-7 bg-gray-200 dark:bg-neutral-700 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="px-4 py-8 text-center">
                  <FiAlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Failed to load folders
                  </p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                    Please try again later
                  </p>
                </div>
              ) : folders.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FiFolder className="w-8 h-8 text-gray-400 dark:text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    No folders yet
                  </p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                    Create your first folder below
                  </p>
                </div>
              ) : (
                folders.map((folder) => {
                  const isSaved = currentBookFolders.includes(folder.id);
                  return (
                    <div
                      key={folder.id}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <FiFolder className="w-4 h-4 text-gray-600 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-neutral-100 text-sm">
                            {folder.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-neutral-400">
                            {folder.booksCount} books
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onSaveToFolder(folder.id)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSaved
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500"
                        }`}
                      >
                        {isSaved ? (
                          <span className="flex items-center space-x-1">
                            <FiCheck className="w-3 h-3" />
                            <span>Saved</span>
                          </span>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-neutral-800 p-3">
              {isCreatingNew ? (
                <div className="grid grid-cols-2 items-center space-x-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFolder();
                      if (e.key === "Escape") {
                        setIsCreatingNew(false);
                        setNewFolderName("");
                      }
                    }}
                    placeholder="Folder name"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white dark:placeholder-gray-500"
                    autoFocus
                  />
                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleCreateFolder}
                      disabled={!newFolderName.trim() || isCreating}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreating ? "Creating..." : "Create"}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingNew(false);
                        setNewFolderName("");
                      }}
                      aria-label="Cancel"
                      className="ml-2 p-2 rounded-lg text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors group"
                >
                  <FiPlus className="w-4 h-4 text-gray-600 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    Create new folder
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
