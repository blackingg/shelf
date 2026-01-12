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
  useGetMeFoldersQuery,
  useGetPublicFoldersQuery,
  useGetBookmarkedFoldersQuery,
  useCreateFolderMutation,
  useDeleteFolderMutation,
} from "@/app/store/api/foldersApi";
import { useNotifications } from "@/app/context/NotificationContext";

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

  // API Queries
  const { data: myFolders, isLoading: isLoadingMyFolders } =
    useGetMeFoldersQuery(undefined, {
      skip: activeTab !== "private",
    });
  const { data: publicFolders, isLoading: isLoadingPublicFolders } =
    useGetPublicFoldersQuery(undefined, {
      skip: activeTab !== "public",
    });
  const { data: bookmarkedFolders, isLoading: isLoadingBookmarked } =
    useGetBookmarkedFoldersQuery(undefined, {
      skip: activeTab !== "bookmarked",
    });

  // Mutations
  const [createFolder] = useCreateFolderMutation();
  const [deleteFolderMutation] = useDeleteFolderMutation();

  const handleCreateFolder = async (
    name: string,
    visibility: FolderVisibility
  ) => {
    try {
      await createFolder({ name, visibility }).unwrap();
      addNotification("success", "Folder created successfully!");
      setShowCreateModal(false);
    } catch (err: any) {
      addNotification("error", err.data?.message || "Failed to create folder");
    }
  };

  const handleFolderClick = (folder: Folder) => {
    router.push(`/app/folders/${folder.id}`);
  };

  const handleFolderEdit = (folder: Folder) => {
    router.push(`/app/folders/${folder.id}/edit`);
  };

  const handleFolderDelete = (folder: Folder) => {
    setFolderToDelete(folder);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (folderToDelete) {
      try {
        await deleteFolderMutation(folderToDelete.id).unwrap();
        addNotification("success", "Folder deleted successfully!");
      } catch (err: any) {
        addNotification(
          "error",
          err.data?.message || "Failed to delete folder"
        );
      }
    }
    setShowDeleteModal(false);
    setFolderToDelete(null);
  };

  const displayedFolders =
    activeTab === "private"
      ? myFolders || []
      : activeTab === "public"
      ? publicFolders || []
      : bookmarkedFolders || [];

  const isLoading =
    (activeTab === "private" && isLoadingMyFolders) ||
    (activeTab === "public" && isLoadingPublicFolders) ||
    (activeTab === "bookmarked" && isLoadingBookmarked);

  const filteredFolders = displayedFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <FolderVisibilityToggle
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="flex w-full lg:w-fit items-start justify-between gap-3">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="Grid View"
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="List View"
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center text-sm md:text-base space-x-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
              isLoading={isLoading}
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
              isLoading={isLoading}
              emptyMessage={
                activeTab === "private"
                  ? "No folders found. Create your first folder!"
                  : activeTab === "bookmarked"
                  ? "No bookmarked folders yet."
                  : "No public folders available to explore."
              }
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
            <p className="text-gray-600 text-center">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-900">
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
