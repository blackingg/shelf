"use client";
import React, { useState, useRef, useEffect } from "react";
import { FiFolder, FiPlus, FiCheck, FiChevronDown, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { useMeFolders, useFolderActions } from "@/app/services";
import { Folder } from "@/app/types/folder";

interface FolderSelectDropdownProps {
  selectedFolderId: string | null;
  onSelect: (folderId: string | null) => void;
  label?: string;
  className?: string;
}

export const FolderSelectDropdown: React.FC<FolderSelectDropdownProps> = ({
  selectedFolderId,
  onSelect,
  label = "Add to Folder (Optional)",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [creatingSubfolderId, setCreatingSubfolderId] = useState<string | null>(
    null,
  );
  const [subfolderName, setSubfolderName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subfolderInputRef = useRef<HTMLInputElement>(null);

  const { folders, isLoading } = useMeFolders({ limit: 100, root_only: false });
  const { actions, isUpdating: isCreating } = useFolderActions();

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

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
      if (folder) {
        onSelect(folder.id);
        // Auto-expand parent to show new subfolder
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

      inputItems.forEach((item) => {
        map.set(item.id, {
          ...item,
          children: item.children ? [...item.children] : [],
        });
      });

      inputItems.forEach((item) => {
        const pId = item.parentId || item.parent_id || item.parent?.id;
        if (pId && map.has(pId)) {
          const parent = map.get(pId)!;
          if (!parent.children?.some((c) => c.id === item.id)) {
            parent.children = [...(parent.children || []), map.get(item.id)!];
          }
        }
      });

      inputItems.forEach((item) => {
        const pId = item.parentId || item.parent_id || item.parent?.id;
        if (!pId || !map.has(pId)) {
          roots.push(map.get(item.id)!);
        }
      });

      return roots;
    };

    const tree = depth === 0 ? buildTree(items) : items;

    return tree.map((folder) => {
      const hasChildren = folder.children && folder.children.length > 0;
      const isExpanded = expandedFolders.has(folder.id);
      const isCreatingSubfolderHere = creatingSubfolderId === folder.id;

      return (
        <div key={folder.id}>
          <button
            type="button"
            onClick={() => {
              onSelect(folder.id);
              setIsOpen(false);
            }}
            className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors duration-150 group ${
              selectedFolderId === folder.id
                ? "bg-primary/5 dark:bg-primary/10"
                : ""
            }`}
          >
            <div
              className="flex items-center space-x-3 flex-1 min-w-0"
              style={{ marginLeft: `${depth * 24}px` }}
            >
              <FiFolder
                className={`w-4 h-4 shrink-0 transition-colors ${
                  selectedFolderId === folder.id
                    ? "text-primary"
                    : "text-gray-400 dark:text-neutral-600 group-hover:text-primary"
                }`}
              />
              <div className="text-left truncate">
                <p
                  className={`font-medium text-sm truncate ${
                    selectedFolderId === folder.id
                      ? "text-primary"
                      : "text-gray-900 dark:text-neutral-100"
                  }`}
                >
                  {folder.name}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-bold uppercase tracking-wider">
                  {folder.booksCount} books
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setCreatingSubfolderId(
                    isCreatingSubfolderHere ? null : folder.id,
                  );
                  setSubfolderName("");
                  // Auto-expand so user sees where subfolder will go
                  if (!isCreatingSubfolderHere) {
                    setExpandedFolders((prev) => new Set([...prev, folder.id]));
                  }
                }}
                title="Create subfolder"
                className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm transition-colors cursor-pointer text-gray-400 hover:text-emerald-500"
              >
                <FiPlus className="w-3.5 h-3.5" />
              </div>
              {hasChildren && (
                <div
                  onClick={(e) => toggleFolder(e, folder.id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm transition-colors cursor-pointer text-gray-400"
                >
                  <FiChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isExpanded ? "" : "-rotate-90"
                    }`}
                  />
                </div>
              )}
              {selectedFolderId === folder.id && (
                <FiCheck className="text-primary w-4 h-4" />
              )}
            </div>
          </button>

          {/* Inline subfolder creation row */}
          {isCreatingSubfolderHere && (
            <div
              className="flex items-center gap-2 px-4 py-2 bg-gray-50/80 dark:bg-neutral-800/60 border-y border-gray-100 dark:border-neutral-800"
              style={{ paddingLeft: `${(depth + 1) * 24 + 16}px` }}
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

  // Helper to find selected folder in nested data
  const findFolderById = (items: any[], id: string): any | null => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findFolderById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedFolder = findFolderById(folders, selectedFolderId || "");

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
        setCreatingSubfolderId(null);
        setSubfolderName("");
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
      className={`relative ${className}`}
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
        className={`w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-neutral-800/50 border border-transparent rounded-sm transition-all duration-200 group ${
          isOpen
            ? "ring-1 ring-primary border-primary"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800 border-gray-200 dark:border-neutral-800"
        }`}
      >
        <div className="flex items-center gap-3">
          <FiFolder
            className={`w-4 h-4 ${selectedFolder ? "text-primary" : "text-gray-400"}`}
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
              ) : (
                <div className="space-y-1 py-1">
                  {folders.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <FiFolder className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
                        No folders yet
                      </p>
                    </div>
                  ) : (
                    renderFolderTree(folders)
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
