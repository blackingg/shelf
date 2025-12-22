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

export default function FoldersPage() {
  const router = useRouter();
  const currentUser = "You"; // Current logged-in user

  const [searchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "private" | "public" | "bookmarked"
  >("private");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  // Mock Data
  const [myFolders, setMyFolders] = useState<Folder[]>([
    {
      id: "1",
      slug: "want-to-read",
      name: "Want to Read",
      description: "Books I want to read",
      booksCount: 12,
      bookmarksCount: 0,
      visibility: "PRIVATE",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      slug: "favorites",
      name: "Favorites",
      description: "My favorite books",
      booksCount: 8,
      bookmarksCount: 0,
      visibility: "PRIVATE",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      slug: "study-materials",
      name: "Study Materials",
      description: "Books for my studies",
      booksCount: 15,
      bookmarksCount: 0,
      visibility: "PUBLIC",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [publicFolders] = useState<(Folder & { collaborator?: any })[]>([
    {
      id: "4",
      slug: "best-fiction-2024",
      name: "Best Fiction 2024",
      description: "Top fiction picks this year",
      booksCount: 24,
      bookmarksCount: 150,
      visibility: "PUBLIC",
      createdBy: "Sarah Johnson",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "5",
      slug: "tech-innovation",
      name: "Tech & Innovation",
      description: "Future of technology",
      booksCount: 18,
      bookmarksCount: 120,
      visibility: "PUBLIC",
      createdBy: "Mike Chen",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "6",
      slug: "classic-literature",
      name: "Classic Literature",
      description: "Timeless pieces",
      booksCount: 32,
      bookmarksCount: 300,
      visibility: "PUBLIC",
      createdBy: "Emily Davis",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdAt: new Date().toISOString(),
      collaborator: { role: "EDITOR" },
    },
  ]);

  const [bookmarkedFolders] = useState<(Folder & { collaborator?: any })[]>([
    {
      id: "7",
      slug: "must-read-classics",
      name: "Must Read Classics",
      description: "Curated by classics lovers",
      booksCount: 45,
      bookmarksCount: 500,
      visibility: "PUBLIC",
      createdBy: "BookClub Official",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "8",
      slug: "sci-fi-gems",
      name: "Sci-Fi Gems",
      description: "Hidden gems in sci-fi",
      booksCount: 12,
      bookmarksCount: 80,
      visibility: "PUBLIC",
      createdBy: "Alex Space",
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdAt: new Date().toISOString(),
      collaborator: { role: "EDITOR" },
    },
  ]);

  const handleCreateFolder = (name: string, visibility: FolderVisibility) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      slug: name.toLowerCase().replace(/ /g, "-"),
      name,
      description: null,
      booksCount: 0,
      bookmarksCount: 0,
      visibility,
      coverImages: null,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
    };

    setMyFolders([newFolder, ...myFolders]);
  };

  const handleFolderClick = (folder: Folder) => {
    router.push(`/app/folders/${folder.id}`);
  };

  const handleFolderEdit = (folder: Folder) => {
    router.push(`/app/folders/${folder.id}/edit`);
  };

  const handleFolderDelete = (folder: Folder) => {
    setFolderToDelete(folder);
    console.log("Deleting folder:", folder);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (folderToDelete) {
      setMyFolders(myFolders.filter((f) => f.id !== folderToDelete.id));
    }
    setShowDeleteModal(false);
    setFolderToDelete(null);
  };

  const displayedFolders =
    activeTab === "private"
      ? myFolders
      : activeTab === "public"
      ? publicFolders
      : bookmarkedFolders;

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
              currentUser={currentUser}
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
              currentUser={currentUser}
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
