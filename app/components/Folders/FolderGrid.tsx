import { FolderCard, FolderCardSkeleton } from "./FolderCard";
import { FiFolder } from "react-icons/fi";
import { Folder, Collaborator } from "@/app/types/folder";

interface FolderGridProps {
  folders: (Folder & { collaborator?: Collaborator })[];
  onFolderClick: (folder: Folder) => void;
  onFolderEdit?: (folder: Folder) => void;
  onFolderDelete?: (folder: Folder) => void;
  showActions?: boolean;
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
}

export const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  onFolderClick,
  onFolderEdit,
  onFolderDelete,
  showActions = false,
  emptyMessage = "No folders yet",
  isLoading = false,
  skeletonCount = 8,
  className = "",
}) => {
  if (isLoading) {
    return (
      <div
        className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
      >
        <FolderCardSkeleton count={skeletonCount} />
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <div className={`text-center py-16 ${className}`}>
        <div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiFolder className="w-10 h-10 text-gray-400 dark:text-neutral-500" />
        </div>
        <p className="text-gray-500 dark:text-neutral-400 text-lg">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {folders.map((folder) => (
        <FolderCard
          key={folder.id}
          folder={folder}
          onClick={() => onFolderClick(folder)}
          onEdit={() => onFolderEdit?.(folder)}
          onDelete={() => onFolderDelete?.(folder)}
          showActions={showActions}
        />
      ))}
    </div>
  );
};
