"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderGrid } from "@/app/components/Folders/FolderGrid";
import { FolderList } from "@/app/components/Folders/FolderList";
import { FolderVisibilityToggle } from "@/app/components/Folders/FolderVisibilityToggle";
import { CreateFolderModal } from "@/app/components/Folders/CreateFolderModal";
import { FiGrid, FiList } from "react-icons/fi";
import { Folder } from "@/app/types/folder";

export default function FoldersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"private" | "public" | "bookmarked">("private");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [myFolders, setMyFolders] = useState<Folder[]>([
    {
      type: "folder",
      id: "1",
      name: "Want to Read",
      bookCount: 12,
      isPublic: false,
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdBy: "You",
    },
    {
      type: "folder",
      id: "2",
      name: "Favorites",
      bookCount: 8,
      isPublic: false,
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdBy: "You",
    },
    {
      type: "folder",
      id: "3",
      name: "Study Materials",
      bookCount: 15,
      isPublic: true,
      coverImages: ["/dummycover.png", "/dummycover.png"],
      createdBy: "You",
    },
  ]);

  const [publicFolders, setPublicFolders] = useState<Folder[]>([
    {
      type: "folder",
      id: "4",
      name: "Best Fiction 2024",
      bookCount: 24,
      isPublic: true,
      createdBy: "Sarah Johnson",
      coverImages: ["/dummycover.png", "/dummycover.png"],
    },
    {
      type: "folder",
      id: "5",
      name: "Tech & Innovation",
      bookCount: 18,
      isPublic: true,
      createdBy: "Mike Chen",
      coverImages: ["/dummycover.png", "/dummycover.png"],
    },
    {
      type: "folder",
      id: "6",
      name: "Classic Literature",
      bookCount: 32,
      isPublic: true,
      createdBy: "Emily Davis",
      coverImages: ["/dummycover.png", "/dummycover.png"],
    },
  ]);

  const [bookmarkedFolders, setBookmarkedFolders] = useState<Folder[]>([
    {
      type: "folder",
      id: "7",
      name: "Must Read Classics",
      bookCount: 45,
      isPublic: true,
      createdBy: "BookClub Official",
      coverImages: ["/dummycover.png", "/dummycover.png"],
    },
    {
      type: "folder",
      id: "8",
      name: "Sci-Fi Gems",
      bookCount: 12,
      isPublic: true,
      createdBy: "Alex Space",
      coverImages: ["/dummycover.png", "/dummycover.png"],
    },
  ]);

  const handleCreateFolder = (name: string, isPublic: boolean) => {
    const newFolder: Folder = {
      type: "folder",
      id: Date.now().toString(),
      name,
      bookCount: 0,
      isPublic,
      coverImages: [],
      createdBy: "You",
    };

    setMyFolders([newFolder, ...myFolders]);
  };

  const handleFolderClick = (folder: any) => {
    router.push(`/app/folders/${folder.id}`);
  };

  const handleFolderEdit = (folder: any) => {
    router.push(`/app/folders/${folder.id}/edit`);
  };

  const handleFolderDelete = (folder: any) => {
    if (confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      setMyFolders(myFolders.filter((f) => f.id !== folder.id));
    }
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
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <FolderVisibilityToggle
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="flex items-center gap-3">
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
              onFolderEdit={
                activeTab === "private" ? handleFolderEdit : undefined
              }
              onFolderDelete={
                activeTab === "private" ? handleFolderDelete : undefined
              }
              showActions={activeTab === "private"}
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
              onFolderEdit={
                activeTab === "private" ? handleFolderEdit : undefined
              }
              onFolderDelete={
                activeTab === "private" ? handleFolderDelete : undefined
              }
              showActions={activeTab === "private"}
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
    </>
  );
}
