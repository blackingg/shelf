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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Folder
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., Summer Reading, Favorites..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Visibility
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setVisibility("PRIVATE")}
                    className={`w-full flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                      visibility === "PRIVATE"
                        ? "border-gray-600 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        visibility === "PRIVATE"
                          ? "border-gray-600"
                          : "border-gray-300"
                      }`}
                    >
                      {visibility === "PRIVATE" && (
                        <div className="w-3 h-3 rounded-full bg-gray-600" />
                      )}
                    </div>
                    <FiLock
                      className={`w-5 h-5 ${
                        visibility === "PRIVATE"
                          ? "text-gray-600"
                          : "text-gray-600"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <p
                        className={`font-semibold ${
                          visibility === "PRIVATE"
                            ? "text-gray-900"
                            : "text-gray-900"
                        }`}
                      >
                        Private
                      </p>
                      <p className="text-sm text-gray-500">
                        Only you can see this folder
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility("PUBLIC")}
                    className={`w-full flex items-center space-x-3 p-4 rounded-xl border-2 transition-all ${
                      visibility === "PUBLIC"
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        visibility === "PUBLIC"
                          ? "border-emerald-600"
                          : "border-gray-300"
                      }`}
                    >
                      {visibility === "PUBLIC" && (
                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                      )}
                    </div>
                    <FiGlobe
                      className={`w-5 h-5 ${
                        visibility === "PUBLIC"
                          ? "text-emerald-600"
                          : "text-gray-600"
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <p
                        className={`font-semibold ${
                          visibility === "PUBLIC"
                            ? "text-emerald-900"
                            : "text-gray-900"
                        }`}
                      >
                        Public
                      </p>
                      <p className="text-sm text-gray-500">
                        Anyone can discover and view
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!folderName.trim()}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
