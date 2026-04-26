"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiFolder, FiPlus, FiCheck, FiChevronDown, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { useMeFolders, useFolderActions } from "@/app/services";

interface FolderSelectDropdownProps {
  selectedFolderId: string;
  onSelect: (folderId: string) => void;
  label?: string;
}

export const FolderSelectDropdown: React.FC<FolderSelectDropdownProps> = ({
  selectedFolderId,
  onSelect,
  label = "Add to Folder (Optional)",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { folders, isLoading } = useMeFolders({ limit: 100 });
  const { actions, isUpdating: isCreating } = useFolderActions();

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsCreatingNew(false);
        setNewFolderName("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleCreateFolder = async () => {
    if (newFolderName.trim() && !isCreating) {
      const folder = await actions.createFolder({ name: newFolderName.trim() });
      if (folder) {
        onSelect(folder.id);
      }
      setNewFolderName("");
      setIsCreatingNew(false);
      setIsOpen(false);
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block ml-1 mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 flex items-center justify-between px-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-neutral-800 rounded-sm hover:border-emerald-500 transition-all text-sm group"
      >
        <div className="flex items-center gap-3">
          <FiFolder
            className={`w-4 h-4 ${selectedFolder ? "text-emerald-500" : "text-gray-400"}`}
          />
          <span
            className={
              selectedFolder ? "text-gray-900 dark:text-white" : "text-gray-400"
            }
          >
            {selectedFolder ? selectedFolder.name : "No folder selected"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedFolder && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelect("");
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-md text-gray-400 hover:text-red-500"
            >
              <FiX className="w-3 h-3" />
            </div>
          )}
          <FiChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-md shadow-xl overflow-hidden z-20"
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/50">
              <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-[10px] uppercase tracking-widest">
                Select folder
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="px-4 py-8 flex justify-center">
                  <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : folders.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <FiFolder className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
                    No folders yet
                  </p>
                </div>
              ) : (
                folders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => {
                      onSelect(folder.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-150 group ${
                      selectedFolderId === folder.id
                        ? "bg-emerald-50/30 dark:bg-emerald-950/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FiFolder
                        className={`w-4 h-4 transition-colors ${selectedFolderId === folder.id ? "text-emerald-500" : "text-gray-400 dark:text-neutral-600 group-hover:text-emerald-500"}`}
                      />
                      <div className="text-left">
                        <p
                          className={`font-medium text-sm ${selectedFolderId === folder.id ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-neutral-100"}`}
                        >
                          {folder.name}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-bold uppercase tracking-wider">
                          {folder.booksCount} books
                        </p>
                      </div>
                    </div>
                    {selectedFolderId === folder.id && (
                      <FiCheck className="text-emerald-500 w-4 h-4" />
                    )}
                  </button>
                ))
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
                    autoFocus
                    className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleCreateFolder}
                      disabled={!newFolderName.trim() || isCreating}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-md text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isCreating ? "..." : "Create"}
                    </button>
                    <button
                      type="button"
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
                  type="button"
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
        )}
      </AnimatePresence>
    </div>
  );
};
