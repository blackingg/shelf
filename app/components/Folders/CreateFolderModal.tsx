"use client";
import { useState } from "react";
import { FiX, FiLock, FiGlobe } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { FolderVisibility } from "@/app/types/folder";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, visibility: FolderVisibility) => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [folderName, setFolderName] = useState("");
  const [visibility, setVisibility] = useState<FolderVisibility>("PRIVATE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSubmit(folderName.trim(), visibility);
      setFolderName("");
      setVisibility("PRIVATE");
      onClose();
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
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-neutral-900 rounded-lg z-50 p-8 border border-gray-200 dark:border-neutral-800"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                Create New Folder
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-400 dark:text-neutral-500" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-neutral-500 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., Summer Reading, Favorites"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 rounded-md focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white dark:placeholder-gray-600 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-medium text-gray-400 dark:text-neutral-500 mb-3">
                  Visibility
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setVisibility("PRIVATE")}
                    className={`w-full flex items-center space-x-4 p-4 rounded-md border transition-colors ${
                      visibility === "PRIVATE"
                        ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10"
                        : "border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 bg-gray-50/50 dark:bg-neutral-800/20"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        visibility === "PRIVATE"
                          ? "border-emerald-500"
                          : "border-gray-300 dark:border-neutral-700"
                      }`}
                    >
                      {visibility === "PRIVATE" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <FiLock
                      className={`w-5 h-5 ${
                        visibility === "PRIVATE"
                          ? "text-emerald-500"
                          : "text-gray-400 dark:text-neutral-500"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <p
                        className={`font-medium text-sm ${
                          visibility === "PRIVATE"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-neutral-400"
                        }`}
                      >
                        Private
                      </p>
                      <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                        Only you can see this folder
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility("PUBLIC")}
                    className={`w-full flex items-center space-x-4 p-4 rounded-md border transition-colors ${
                      visibility === "PUBLIC"
                        ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10"
                        : "border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 bg-gray-50/50 dark:bg-neutral-800/20"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        visibility === "PUBLIC"
                          ? "border-emerald-500"
                          : "border-gray-300 dark:border-neutral-700"
                      }`}
                    >
                      {visibility === "PUBLIC" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <FiGlobe
                      className={`w-5 h-5 ${
                        visibility === "PUBLIC"
                          ? "text-emerald-500"
                          : "text-gray-400 dark:text-neutral-500"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <p
                        className={`font-medium text-sm ${
                          visibility === "PUBLIC"
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-neutral-400"
                        }`}
                      >
                        Public
                      </p>
                      <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                        Anyone can discover and view
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 rounded-md font-medium text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!folderName.trim()}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-md font-medium text-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
