"use client";
import { useState, useEffect } from "react";
import { FiX, FiLock, FiGlobe } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { Folder, FolderVisibility } from "@/app/types/folder";
import { useMeFolders } from "@/app/services";
import { FolderSelectDropdown } from "../Library/FolderSelectDropdown";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    name: string,
    visibility: FolderVisibility,
    description?: string,
    parentId?: string,
  ) => void;
  parentId?: string;
  lockParent?: boolean;
  parentVisibility?: FolderVisibility;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  parentId: initialParentId,
  lockParent = false,
  parentVisibility,
}) => {
  const [folderName, setFolderName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<FolderVisibility>("PRIVATE");
  const [parentId, setParentId] = useState<string | undefined>(initialParentId);

  const { folders } = useMeFolders({ limit: 100, root_only: false });

  // Sync parentId and inherit visibility when modal opens
  useEffect(() => {
    if (isOpen) {
      setParentId(initialParentId);
      setFolderName("");
      setDescription("");

      // Inherit visibility from parent
      if (parentVisibility) {
        setVisibility(parentVisibility);
      } else if (initialParentId) {
        const parent = folders.find((f) => f.id === initialParentId);
        if (parent?.visibility === "PUBLIC") {
          setVisibility("PUBLIC");
        } else {
          setVisibility("PRIVATE");
        }
      } else {
        setVisibility("PRIVATE");
      }
    }
  }, [isOpen, initialParentId, parentVisibility, folders]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSubmit(
        folderName.trim(),
        visibility,
        description.trim() || undefined,
        parentId,
      );
      setFolderName("");
      setDescription("");
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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-sm z-50 p-8 border border-line"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-medium text-foreground">
                {parentId ? "Create Subfolder" : "Create New Folder"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-sm transition-colors"
              >
                <FiX className="w-6 h-6 text-faint" />
              </button>
            </div>

            {!lockParent ? (
              <div className="flex flex-col space-y-2 mb-6">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-faint ml-1">
                  Parent Folder
                </label>
                <FolderSelectDropdown
                  selectedFolderId={parentId || null}
                  onSelect={(id) => {
                    const pId = id || undefined;
                    setParentId(pId);
                    if (pId) {
                      const parent = folders.find((f) => f.id === pId);
                      setVisibility(
                        parent?.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE",
                      );
                    } else {
                      setVisibility("PRIVATE");
                    }
                  }}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="flex items-center space-x-2 mb-6 p-2 bg-gray-50 dark:bg-neutral-800/50 rounded-sm">
                <span className="text-[10px] uppercase tracking-widest font-bold text-faint ml-1">
                  Parent:
                </span>
                <span className="text-[11px] font-medium text-primary ml-1">
                  {folders.find((f) => f.id === parentId)?.name ||
                    "Current Folder"}
                </span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              <div>
                <label className="block text-[10px] uppercase tracking-widest font-medium text-faint mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="e.g., Summer Reading, Favorites"
                  className="w-full px-4 py-3 border border-line bg-surface rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground dark:placeholder-gray-600 transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-medium text-faint mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this folder about?"
                  rows={3}
                  className="w-full px-4 py-3 border border-line bg-surface rounded-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground dark:placeholder-gray-600 transition-colors resize-none"
                />
              </div>

              {!parentId && (
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-medium text-faint mb-3">
                    Visibility
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setVisibility("PRIVATE")}
                      className={`w-full flex items-center space-x-4 p-4 rounded-sm border transition-colors ${
                        visibility === "PRIVATE"
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-line-subtle hover:border-gray-200 dark:hover:border-neutral-700 bg-gray-50/50 dark:bg-neutral-800/20"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          visibility === "PRIVATE"
                            ? "border-primary"
                            : "border-gray-300 dark:border-neutral-700"
                        }`}
                      >
                        {visibility === "PRIVATE" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <FiLock
                        className={`w-5 h-5 ${
                          visibility === "PRIVATE"
                            ? "text-primary"
                            : "text-faint"
                        }`}
                      />
                      <div className="flex-1 text-left">
                        <p
                          className={`font-medium text-sm ${
                            visibility === "PRIVATE"
                              ? "text-foreground"
                              : "text-gray-700 dark:text-neutral-400"
                          }`}
                        >
                          Private
                        </p>
                        <p className="text-xs text-faint mt-0.5">
                          Only you can see this folder
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVisibility("PUBLIC")}
                      className={`w-full flex items-center space-x-4 p-4 rounded-sm border transition-colors ${
                        visibility === "PUBLIC"
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-line-subtle hover:border-gray-200 dark:hover:border-neutral-700 bg-gray-50/50 dark:bg-neutral-800/20"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          visibility === "PUBLIC"
                            ? "border-primary"
                            : "border-gray-300 dark:border-neutral-700"
                        }`}
                      >
                        {visibility === "PUBLIC" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <FiGlobe
                        className={`w-5 h-5 ${
                          visibility === "PUBLIC"
                            ? "text-primary"
                            : "text-faint"
                        }`}
                      />
                      <div className="flex-1 text-left">
                        <p
                          className={`font-medium text-sm ${
                            visibility === "PUBLIC"
                              ? "text-foreground"
                              : "text-gray-700 dark:text-neutral-400"
                          }`}
                        >
                          Public
                        </p>
                        <p className="text-xs text-faint mt-0.5">
                          Anyone can discover and view
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-line text-muted rounded-sm font-medium text-sm hover:bg-wash transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!folderName.trim()}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-sm font-medium text-sm hover:opacity-90 transition-colors disabled:opacity-50"
                >
                  {parentId ? "Create Subfolder" : "Create Folder"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
