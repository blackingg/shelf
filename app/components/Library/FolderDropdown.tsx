import React, { useState, useEffect, useRef } from "react";
import {
  FiFolder,
  FiPlus,
  FiCheck,
  FiAlertCircle,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { Folder } from "@/app/types/folder";
import { motion, AnimatePresence } from "motion/react";
import { useMeFolders, useFolderActions } from "@/app/services";
import { useNotifications } from "@/app/context/NotificationContext";

export const FolderDropdown: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle?: string;
  className?: string;
}> = ({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  className = "bottom-full mb-2 w-full",
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [savedFolderIds, setSavedFolderIds] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [creatingSubfolderId, setCreatingSubfolderId] = useState<string | null>(
    null,
  );
  const [subfolderName, setSubfolderName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subfolderInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();

  const { folders, isLoading, isError } = useMeFolders({ root_only: false });
  const { actions, isUpdating: isCreating } = useFolderActions();

  // Focus subfolder input when creating
  useEffect(() => {
    if (creatingSubfolderId && subfolderInputRef.current) {
      subfolderInputRef.current.focus();
    }
  }, [creatingSubfolderId]);

  const handleCreateSubfolder = async (parentId: string) => {
    if (subfolderName.trim() && !isCreating) {
      const folder = await actions.createFolder({
        name: subfolderName.trim(),
        parentId,
      });
      if (folder && bookId) {
        setSavedFolderIds((prev) => [...prev, folder.id]);
        await actions.addBookToFolder(folder.id, bookId, bookTitle);
        setExpandedFolders((prev) => new Set([...prev, parentId]));
      }
      setSubfolderName("");
      setCreatingSubfolderId(null);
    }
  };

  // Recursive renderer
  const renderFolderTree = (items: Folder[], depth = 0) => {
    // Helper to build a tree from potentially flat data
    const buildTree = (inputItems: Folder[]) => {
      const map = new Map<string, Folder>();
      const roots: Folder[] = [];

      // First pass: create map and initialize children arrays
      inputItems.forEach((item) => {
        map.set(item.id, {
          ...item,
          children: item.children ? [...item.children] : [],
        });
      });

      // Second pass: link children to parents
      inputItems.forEach((item) => {
        const pId = item.parentId || (item as any).parent_id || item.parent?.id;
        if (pId && map.has(pId)) {
          const parent = map.get(pId)!;
          if (!parent.children?.some((c) => c.id === item.id)) {
            parent.children = [...(parent.children || []), map.get(item.id)!];
          }
        }
      });

      // Third pass: find true roots
      inputItems.forEach((item) => {
        const pId = item.parentId || (item as any).parent_id || item.parent?.id;
        if (!pId || !map.has(pId)) {
          roots.push(map.get(item.id)!);
        }
      });

      return roots;
    };

    const tree = depth === 0 ? buildTree(items) : items;

    return tree.map((folder) => {
      const isSaved = savedFolderIds.includes(folder.id);
      const hasChildren = folder.children && folder.children.length > 0;
      const isExpanded = expandedFolders.has(folder.id);
      const isCreatingSubfolderHere = creatingSubfolderId === folder.id;

      return (
        <div key={folder.id}>
          <div className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-150 group">
            <div
              className="flex items-center space-x-3 flex-1 min-w-0"
              style={{ marginLeft: `${depth * 20}px` }}
            >
              <FiFolder
                className={`w-4 h-4 shrink-0 transition-colors ${isSaved ? "text-primary" : "text-gray-400 dark:text-neutral-600 group-hover:text-primary"}`}
              />

              <div className="text-left truncate">
                <p
                  className={`font-medium text-sm truncate ${isSaved ? "text-primary font-bold" : "text-gray-900 dark:text-neutral-100"}`}
                >
                  {folder.name}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-bold uppercase tracking-wider">
                  {folder.booksCount} books
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCreatingSubfolderId(
                    isCreatingSubfolderHere ? null : folder.id,
                  );
                  setSubfolderName("");
                  if (!isCreatingSubfolderHere) {
                    setExpandedFolders((prev) => new Set([...prev, folder.id]));
                  }
                }}
                title="Create subfolder"
                className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm transition-colors text-gray-400 hover:text-emerald-500"
              >
                <FiPlus className="w-3.5 h-3.5" />
              </button>
              {hasChildren && (
                <button
                  type="button"
                  onClick={(e) => toggleFolder(e, folder.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm transition-colors text-gray-400"
                >
                  <FiChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExpanded ? "" : "-rotate-90"
                    }`}
                  />
                </button>
              )}

              <button
                onClick={() => handleSaveToggle(folder.id)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors min-w-[70px] ${
                  isSaved
                    ? "bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20"
                    : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                }`}
              >
                {isSaved ? (
                  <span className="flex items-center justify-center space-x-1">
                    <FiCheck className="w-3 h-3" />
                    <span>Saved</span>
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>

          {/* Inline subfolder creation row */}
          {isCreatingSubfolderHere && (
            <div
              className="flex items-center gap-2 px-4 py-2 bg-gray-50/80 dark:bg-neutral-800/60 border-y border-gray-100 dark:border-neutral-800"
              style={{ paddingLeft: `${(depth + 1) * 20 + 16}px` }}
            >
              <FiFolder className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <input
                ref={subfolderInputRef}
                type="text"
                value={subfolderName}
                onChange={(e) => setSubfolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateSubfolder(folder.id);
                  if (e.key === "Escape") {
                    setCreatingSubfolderId(null);
                    setSubfolderName("");
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                placeholder="Subfolder name"
                className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-sm text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateSubfolder(folder.id);
                }}
                disabled={!subfolderName.trim() || isCreating}
                className="px-2 py-1 bg-emerald-600 text-white rounded-sm text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 disabled:opacity-50 shrink-0"
              >
                {isCreating ? "..." : "Create"}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCreatingSubfolderId(null);
                  setSubfolderName("");
                }}
                className="p-1 rounded-sm text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors shrink-0"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {hasChildren && isExpanded && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
              {renderFolderTree(folder?.children || [], depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  // Helper to get all folder IDs from potentially nested data
  const getAllFolderIds = (items: any[]): string[] => {
    let ids: string[] = [];
    items.forEach((item) => {
      ids.push(item.id);
      if (item.children) {
        ids = [...ids, ...getAllFolderIds(item.children)];
      }
    });
    return ids;
  };

  const toggleFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  // Initialize saved folders based on data
  useEffect(() => {
    if (isOpen && bookId && folders.length > 0) {
      // Find which folders contain this book
      const findSavedIds = (items: any[]): string[] => {
        let saved: string[] = [];
        items.forEach((item) => {
          if (item.items?.some((fi: any) => fi.book.id === bookId)) {
            saved.push(item.id);
          }
          if (item.children) {
            saved = [...saved, ...findSavedIds(item.children)];
          }
        });
        return saved;
      };
      setSavedFolderIds(findSavedIds(folders));
    }
  }, [isOpen, bookId, folders]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleCreateFolder = async () => {
    if (newFolderName.trim() && !isCreating) {
      const folder = await actions.createFolder({ name: newFolderName.trim() });
      if (folder && bookId) {
        // Optimistically add to the new folder
        setSavedFolderIds((prev) => [...prev, folder.id]);
        await actions.addBookToFolder(folder.id, bookId, bookTitle);
      }
      setNewFolderName("");
      setIsCreatingNew(false);
    }
  };

  const handleSaveToggle = async (folderId: string) => {
    if (!bookId) return;

    const isAdding = !savedFolderIds.includes(folderId);

    // 1. Optimistic Update
    if (isAdding) {
      setSavedFolderIds((prev) => [...prev, folderId]);
    } else {
      setSavedFolderIds((prev) => prev.filter((id) => id !== folderId));
    }

    try {
      // 2. Perform Action
      if (isAdding) {
        await actions.addBookToFolder(folderId, bookId, bookTitle);
      } else {
        await actions.removeBookFromFolder(folderId, bookId);
      }
    } catch (error) {
      // 3. Revert on Error
      if (isAdding) {
        setSavedFolderIds((prev) => prev.filter((id) => id !== folderId));
      } else {
        setSavedFolderIds((prev) => [...prev, folderId]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`absolute left-0 bg-white dark:bg-neutral-900 rounded-md border border-gray-200 dark:border-neutral-800 shadow-xl overflow-hidden z-70 ${className}`}
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-800/50">
            <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-[10px] uppercase tracking-widest">
              Save to folder
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            >
              <FiX className="w-3 h-3" />
            </button>
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
            ) : (
              <div className="py-2">
                {folders.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <FiFolder className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
                      No folders yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">{renderFolderTree(folders)}</div>
                )}
              </div>
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
                  className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-900 dark:text-white"
                  autoFocus
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim() || isCreating}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-50"
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
                <FiPlus className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-primary transition-colors">
                  Create new folder
                </span>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
