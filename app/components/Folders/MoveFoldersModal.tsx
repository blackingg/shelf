"use client";
import { useState } from "react";
import {
  FiX,
  FiFolder,
  FiCheck,
  FiArrowUp,
  FiPlus,
  FiChevronDown,
} from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { Folder } from "@/app/types/folder";
import { useMeFolders, useFolderActions } from "@/app/services";

interface MoveFoldersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newParentId: string | null) => void;
  folderIds: string[];
  selectedCount?: number;
  isMoving?: boolean;
}

export const MoveFoldersModal: React.FC<MoveFoldersModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  folderIds,
  selectedCount,
  isMoving = false,
}) => {
  const { actions } = useFolderActions();
  const { folders, isLoading } = useMeFolders({ limit: 100, root_only: false });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateInline, setShowCreateInline] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
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

  // Helper to filter and render recursively
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
        const pId = item.parentId || item.parent_id || item.parent?.id;
        if (pId && map.has(pId)) {
          const parent = map.get(pId)!;
          if (!parent.children?.some((c) => c.id === item.id)) {
            parent.children = [...(parent.children || []), map.get(item.id)!];
          }
        }
      });

      // Third pass: find true roots
      inputItems.forEach((item) => {
        const pId = item.parentId || item.parent_id || item.parent?.id;
        if (!pId || !map.has(pId)) {
          roots.push(map.get(item.id)!);
        }
      });

      return roots;
    };

    const tree = depth === 0 ? buildTree(items) : items;

    return tree
      .filter((folder) => !folderIds.includes(folder.id)) // Don't show moving folders
      .map((folder) => {
        const hasChildren = folder.children && folder.children.length > 0;
        const isExpanded = expandedFolders.has(folder.id);

        return (
          <div key={folder.id}>
            <button
              onClick={() => setSelectedId(folder.id)}
              className={`w-full flex items-center justify-between p-3 rounded-sm border transition-all ${
                selectedId === folder.id
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-transparent hover:bg-wash"
              }`}
            >
              <div
                className="flex items-center space-x-3 flex-1 min-w-0"
                style={{ marginLeft: `${depth * 24}px` }}
              >
                <div
                  className={`w-8 h-8 rounded shrink-0 flex items-center justify-center transition-colors ${
                    selectedId === folder.id
                      ? "bg-primary/20 text-primary"
                      : "bg-gray-100 dark:bg-neutral-800 text-gray-500"
                  }`}
                >
                  <FiFolder className="w-4 h-4" />
                </div>

                <div className="text-left truncate">
                  <p
                    className={`text-sm font-medium truncate ${selectedId === folder.id ? "text-primary font-bold" : "text-foreground"}`}
                  >
                    {folder.name}
                  </p>
                  <p className="text-[10px] text-faint">
                    {folder.booksCount} books
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
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
                {selectedId === folder.id && (
                  <FiCheck className="text-primary w-4 h-4" />
                )}
              </div>
            </button>

            {hasChildren && isExpanded && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                {renderFolderTree(folder?.children || [], depth + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  const handleConfirm = () => {
    onConfirm(selectedId);
  };

  const handleCreateAndSelect = async () => {
    if (!newFolderName.trim()) return;
    setIsCreating(true);
    try {
      const newFolder = await actions.createFolder({
        name: newFolderName.trim(),
        visibility: "PRIVATE",
      });
      if (newFolder) {
        setSelectedId(newFolder.id);
      }
      setShowCreateInline(false);
      setNewFolderName("");
    } catch (err) {
      // Handled in service
    } finally {
      setIsCreating(false);
    }
  };

  const count = selectedCount || folderIds.length;
  const modalTitle = count > 1 ? `Move ${count} Folders` : "Move Folder";

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
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-sm z-50 p-6 border border-line flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-medium text-foreground uppercase tracking-tight">
                  {modalTitle}
                </h2>
                <p className="text-xs text-gray-500 dark:text-neutral-500 mt-1">
                  Select a destination parent folder.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-sm transition-colors"
              >
                <FiX className="w-5 h-5 text-faint" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-2 min-h-[300px] no-scrollbar">
              {/* Move to Root */}
              <button
                onClick={() => setSelectedId(null)}
                className={`w-full flex items-center justify-between p-3 rounded-sm border transition-all ${
                  selectedId === null
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-transparent hover:bg-wash"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                    <FiArrowUp className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">
                      Move to Root
                    </p>
                    <p className="text-[10px] text-faint uppercase tracking-tight">
                      Top-level directory
                    </p>
                  </div>
                </div>
                {selectedId === null && (
                  <FiCheck className="text-primary w-4 h-4" />
                )}
              </button>

              <div className="h-px bg-gray-100 dark:bg-neutral-800 my-2" />

              {/* Create New Folder Inline */}
              {!showCreateInline ? (
                <button
                  onClick={() => setShowCreateInline(true)}
                  className="w-full flex items-center space-x-3 p-3 rounded-sm border border-dashed border-line text-gray-500 hover:border-primary hover:text-primary transition-all text-sm font-medium"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Create new folder</span>
                </button>
              ) : (
                <div className="p-3 border border-primary bg-primary/5 dark:bg-primary/10 rounded-sm space-y-3">
                  <input
                    autoFocus
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name..."
                    className="w-full bg-background border border-primary/20 rounded-sm px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateAndSelect();
                      if (e.key === "Escape") setShowCreateInline(false);
                    }}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateAndSelect}
                      disabled={isCreating || !newFolderName.trim()}
                      className="flex-1 bg-primary text-primary-foreground py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                    >
                      {isCreating ? "Creating..." : "Create & Select"}
                    </button>
                    <button
                      onClick={() => setShowCreateInline(false)}
                      className="px-3 py-1.5 border border-line text-gray-500 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-wash"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-1">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 bg-gray-50 dark:bg-neutral-800/50 animate-pulse rounded-sm"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {folders.length === 0 ? (
                      <div className="px-4 py-8 text-center bg-gray-50 dark:bg-neutral-800/50 rounded-sm">
                        <FiFolder className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto mb-2" />
                        <p className="text-sm text-muted font-medium">
                          No folders yet
                        </p>
                      </div>
                    ) : (
                      renderFolderTree(folders)
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-6 mt-2 border-t border-line-subtle">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-line text-muted rounded-sm font-medium text-sm hover:bg-wash transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isMoving}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-sm font-medium text-sm hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {isMoving ? "Moving..." : "Move Here"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
