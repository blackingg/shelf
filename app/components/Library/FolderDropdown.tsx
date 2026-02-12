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
            className={`absolute left-0 bg-white dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-800 overflow-hidden z-[70] ${className}`}
          >
            <div className="p-3 border-b border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/50">
              <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-[10px] uppercase tracking-widest">
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
                        <div className="w-4 h-4 bg-gray-100 dark:bg-neutral-800 rounded-sm" />
                        <div>
                          <div className="w-24 h-4 bg-gray-100 dark:bg-neutral-800 rounded-sm mb-1" />
                          <div className="w-16 h-3 bg-gray-50 dark:bg-neutral-800/50 rounded-sm" />
                        </div>
                      </div>
                      <div className="w-14 h-7 bg-gray-100 dark:bg-neutral-800 rounded-md" />
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="px-4 py-8 text-center">
                  <FiAlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
                    Failed to load folders
                  </p>
                </div>
              ) : folders.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FiFolder className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
                    No folders yet
                  </p>
                </div>
              ) : (
                folders.map((folder) => {
                  const isSaved = currentBookFolders.includes(folder.id);
                  return (
                    <div
                      key={folder.id}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-150 group"
                    >
                      <div className="flex items-center space-x-3">
                        <FiFolder className="w-4 h-4 text-gray-400 dark:text-neutral-600 group-hover:text-emerald-500 transition-colors" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-neutral-100 text-sm">
                            {folder.name}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-bold uppercase tracking-wider">
                            {folder.booksCount} books
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onSaveToFolder(folder.id)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          isSaved
                            ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
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

            <div className="border-t border-gray-200 dark:border-neutral-800 p-3 bg-gray-50/30 dark:bg-neutral-800/30">
              {isCreatingNew ? (
                <div className="flex items-center space-x-2">
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
                    className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    autoFocus
                  />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleCreateFolder}
                      disabled={!newFolderName.trim() || isCreating}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isCreating ? "..." : "Create"}
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingNew(false);
                        setNewFolderName("");
                      }}
                      className="p-1.5 rounded-md text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingNew(true)}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors group"
                >
                  <FiPlus className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-emerald-600 transition-colors">
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
