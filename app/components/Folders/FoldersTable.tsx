"use client";
import { useState, useRef, useEffect } from "react";
import {
  FiMoreVertical,
  FiFolder,
  FiEdit2,
  FiTrash2,
  FiCornerUpRight,
} from "react-icons/fi";
import { Folder } from "@/app/types/folder";
import { useFolderPermissions } from "@/app/hooks/useFolderPermissions";

interface FoldersTableProps {
  folders: Folder[];
  onFolderClick: (folder: Folder) => void;
  onFolderEdit?: (folder: Folder) => void;
  onFolderDelete?: (folder: Folder) => void;
  onFolderMove?: (folder: Folder) => void;
  canEdit?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

export const FoldersTable = ({
  folders,
  onFolderClick,
  onFolderEdit,
  onFolderDelete,
  onFolderMove,
  canEdit = false,
  selectedIds = [],
  onSelectionChange,
}: FoldersTableProps) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
        setMenuPosition(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = (
    e: React.MouseEvent<HTMLButtonElement>,
    folderId: string,
  ) => {
    e.stopPropagation();
    if (activeMenuId === folderId) {
      setActiveMenuId(null);
      setMenuPosition(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + window.scrollY + 4,
      right: window.innerWidth - rect.right,
    });
    setActiveMenuId(folderId);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5">
              {onSelectionChange && (
                <th className="w-12 px-6 py-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        folders.length > 0 &&
                        selectedIds.length === folders.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectionChange(folders.map((f) => f.id));
                        } else {
                          onSelectionChange([]);
                        }
                      }}
                      className="w-4 h-4 rounded-sm border-gray-200 dark:border-white/10 text-primary focus:ring-primary dark:bg-neutral-800 transition-colors"
                    />
                  </div>
                </th>
              )}
              <th className="px-6 py-4 text-left text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                Folder
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                Owner
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {folders.map((folder) => (
              <tr
                key={folder.id}
                onClick={() => onFolderClick(folder)}
                className={`hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group ${
                  selectedIds.includes(folder.id)
                    ? "bg-primary/5 dark:bg-primary/10"
                    : ""
                }`}
              >
                {onSelectionChange && (
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(folder.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectionChange([...selectedIds, folder.id]);
                          } else {
                            onSelectionChange(
                              selectedIds.filter((id) => id !== folder.id),
                            );
                          }
                        }}
                        className="w-4 h-4 rounded-sm border-gray-200 dark:border-white/10 text-primary focus:ring-primary dark:bg-neutral-800 transition-colors"
                      />
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-10 bg-gray-50 dark:bg-neutral-800 rounded-sm flex-shrink-0 flex items-center justify-center border border-gray-100 dark:border-white/5 text-gray-400">
                      <FiFolder className="w-4 h-4" />
                    </div>
                    <div className="max-w-[300px]">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {folder.name}
                      </div>
                      <div className="text-[10px] text-gray-400 dark:text-neutral-500 truncate mt-0.5">
                        {folder.booksCount} resources •{" "}
                        {folder.childrenCount || 0} subfolders
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[13px] text-gray-600 dark:text-neutral-400">
                    {folder.user?.username || "Unknown"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => handleMenuToggle(e, folder.id)}
                    className="p-1.5 hover:bg-white dark:hover:bg-neutral-800 rounded-sm transition-colors text-gray-400 hover:text-primary border border-transparent hover:border-gray-100 dark:hover:border-white/10"
                  >
                    <FiMoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeMenuId && menuPosition && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuPosition.top,
            right: menuPosition.right,
          }}
          className="w-48 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/10 rounded-md py-1.5 z-[200] shadow-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const folder = folders.find((f) => f.id === activeMenuId);
            if (!folder) return null;
            return (
              <FolderMenu
                folder={folder}
                onFolderClick={onFolderClick}
                onFolderEdit={onFolderEdit}
                onFolderMove={onFolderMove}
                onFolderDelete={onFolderDelete}
                setActiveMenuId={setActiveMenuId}
                setMenuPosition={setMenuPosition}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
};

const FolderMenu = ({
  folder,
  onFolderClick,
  onFolderEdit,
  onFolderMove,
  onFolderDelete,
  setActiveMenuId,
  setMenuPosition,
}: {
  folder: Folder;
  onFolderClick: (f: Folder) => void;
  onFolderEdit?: (f: Folder) => void;
  onFolderMove?: (f: Folder) => void;
  onFolderDelete?: (f: Folder) => void;
  setActiveMenuId: (id: string | null) => void;
  setMenuPosition: (pos: { top: number; right: number } | null) => void;
}) => {
  const { canEditFolder, canDeleteFolder, canMoveFolder } =
    useFolderPermissions(folder);

  return (
    <>
      <button
        onClick={() => {
          onFolderClick(folder);
          setActiveMenuId(null);
        }}
        className="w-full px-4 py-2 text-[12px] text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center space-x-2 transition-colors"
      >
        <FiFolder className="w-3.5 h-3.5" />
        <span>Open Folder</span>
      </button>

      {(canEditFolder || canDeleteFolder || canMoveFolder) && (
        <div className="border-t border-gray-50 dark:border-white/5 my-1" />
      )}

      {canEditFolder && (
        <button
          onClick={() => {
            onFolderEdit?.(folder);
            setActiveMenuId(null);
          }}
          className="w-full px-4 py-2 text-[12px] text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center space-x-2 transition-colors"
        >
          <FiEdit2 className="w-3.5 h-3.5" />
          <span>Edit Folder</span>
        </button>
      )}

      {canMoveFolder && (
        <button
          onClick={() => {
            onFolderMove?.(folder);
            setActiveMenuId(null);
          }}
          className="w-full px-4 py-2 text-[12px] text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center space-x-2 transition-colors"
        >
          <FiCornerUpRight className="w-3.5 h-3.5" />
          <span>Move Folder</span>
        </button>
      )}

      {canDeleteFolder && (
        <button
          onClick={() => {
            onFolderDelete?.(folder);
            setActiveMenuId(null);
            setMenuPosition(null);
          }}
          className="w-full px-4 py-2 text-[12px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center space-x-2 transition-colors"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
          <span>Delete Folder</span>
        </button>
      )}
    </>
  );
};
