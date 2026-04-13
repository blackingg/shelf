"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderGrid } from "@/app/components/Folders/FolderGrid";
import { FolderList } from "@/app/components/Folders/FolderList";
import { FolderVisibilityToggle } from "@/app/components/Folders/FolderVisibilityToggle";
import { CreateFolderModal } from "@/app/components/Folders/CreateFolderModal";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { FiGrid, FiList } from "react-icons/fi";
import { Folder, FolderVisibility } from "@/app/types/folder";
import {
  useMeFolders,
  useFolders,
  useFolderActions,
} from "@/app/services/folders/hooks";
import { useBookmarkedFolders } from "@/app/services/bookmarks/hooks";
import { useNotifications } from "@/app/context/NotificationContext";
import { Pagination } from "@/app/components/Library/Pagination";

export default function FoldersPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();

  const [searchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "private" | "public" | "bookmarked"
  >("private");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const handleTabChange = (tab: "private" | "public" | "bookmarked") => {
    setActiveTab(tab);
    setPage(1);
  };

  // API Queries
  const {
    folders: myFolders,
    isLoading: isLoadingMyFolders,
    isFetching: isFetchingMyFolders,
    totalPages: myTotalPages,
  } = useMeFolders({ page, limit: pageSize });

  const {
    folders: publicFolders,
    isLoading: isLoadingPublicFolders,
    isFetching: isFetchingPublic,
    totalPages: publicTotalPages,
  } = useFolders({ page, limit: pageSize });

  const {
    folders: bookmarkedFolders,
    isLoading: isLoadingBookmarked,
    isFetching: isFetchingBookmarked,
    totalPages: bookmarkedTotalPages,
  } = useBookmarkedFolders({ page, limit: pageSize });

  const { actions, isCreating, isDeleting } = useFolderActions();

  const handleCreateFolder = async (
    name: string,
    visibility: FolderVisibility,
    description?: string,
  ) => {
    await actions.createFolder({ name, visibility, description });
    setShowCreateModal(false);
  };

  const handleFolderClick = (folder: Folder) => {
    router.push(`/app/folders/${folder.slug}`);
  };

  const handleFolderEdit = (folder: Folder) => {
    router.push(`/app/folders/${folder.slug}/edit`);
  };

  const handleFolderDelete = (folder: Folder) => {
    setFolderToDelete(folder);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (folderToDelete) {
      await actions.deleteFolder(folderToDelete.id);
    }
    setShowDeleteModal(false);
    setFolderToDelete(null);
  };

  const displayedFolders: Folder[] =
    activeTab === "private"
      ? myFolders
      : activeTab === "public"
        ? publicFolders
        : bookmarkedFolders;

  const totalPages =
    activeTab === "private"
      ? myTotalPages
      : activeTab === "public"
        ? publicTotalPages
        : bookmarkedTotalPages;

  const isLoading =
    (activeTab === "private" && isLoadingMyFolders) ||
    (activeTab === "public" && isLoadingPublicFolders) ||
    (activeTab === "bookmarked" && isLoadingBookmarked);

  const isFetching =
    (activeTab === "private" && isFetchingMyFolders) ||
    (activeTab === "public" && isFetchingPublic) ||
    (activeTab === "bookmarked" && isFetchingBookmarked);

  const filteredFolders = displayedFolders.filter((folder) =>
    folder.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <main className="flex-1 w-full relative">
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <FolderVisibilityToggle
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            <div className="flex w-full lg:w-fit items-start justify-between gap-3">
              <div className="flex bg-gray-100 dark:bg-neutral-800 p-0.5 rounded-md">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-sm transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-sm transition-colors ${
                    viewMode === "list"
                      ? "bg-white dark:bg-neutral-700 text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200"
                  }`}
                  title="List View"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center text-sm space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-150"
              >
                <span>Create Folder</span>
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <FolderGrid
              folders={filteredFolders}
              onFolderClick={handleFolderClick}
              onFolderEdit={handleFolderEdit}
              onFolderDelete={handleFolderDelete}
              showActions={true}
              isLoading={isFetching}
              emptyMessage={
                activeTab === "private"
                  ? "No folders found. Create your first folder!"
                  : activeTab === "bookmarked"
                    ? "No bookmarked folders yet."
                    : "No public folders available to explore."
              }
            />
          ) : (
            <FolderList
              folders={filteredFolders}
              onFolderClick={handleFolderClick}
              onFolderEdit={handleFolderEdit}
              onFolderDelete={handleFolderDelete}
              showActions={true}
              isLoading={isFetching}
              emptyMessage={
                activeTab === "private"
                  ? "No folders found. Create your first folder!"
                  : activeTab === "bookmarked"
                    ? "No bookmarked folders yet."
                    : "No public folders available to explore."
              }
            />
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          )}
        </div>
      </main>

      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFolder}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Folder?"
        message={
          folderToDelete && (
            <p className="text-gray-600 text-left">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-600 dark:text-gray-300">
                "{folderToDelete.name}"
              </span>
              ?
            </p>
          )
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
      />
    </>
  );
}
