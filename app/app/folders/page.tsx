"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/app/components/PageHeader";
import { FolderGrid } from "@/app/components/Folders/FolderGrid";
import { FolderVisibilityToggle } from "@/app/components/Folders/FolderVisibilityToggle";
import { CreateFolderModal } from "@/app/components/Folders/CreateFolderModal";

export default function FoldersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"private" | "public">("private");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [privateFolders, setPrivateFolders] = useState([
    {
      id: "1",
      name: "Want to Read",
      bookCount: 12,
      isPublic: false,
      coverImages: ["/books/psychology.jpg", "/books/innovation.jpg"],
    },
    {
      id: "2",
      name: "Favorites",
      bookCount: 8,
      isPublic: false,
      coverImages: ["/books/gatsby.jpg", "/books/wood.jpg"],
    },
    {
      id: "3",
      name: "Study Materials",
      bookCount: 15,
      isPublic: false,
      coverImages: ["/books/company.jpg", "/books/room.jpg"],
    },
  ]);

  const [publicFolders, setPublicFolders] = useState([
    {
      id: "4",
      name: "Best Fiction 2024",
      bookCount: 24,
      isPublic: true,
      createdBy: "Sarah Johnson",
      coverImages: ["/books/bees.jpg", "/books/batman.jpg"],
    },
    {
      id: "5",
      name: "Tech & Innovation",
      bookCount: 18,
      isPublic: true,
      createdBy: "Mike Chen",
      coverImages: ["/books/innovation.jpg", "/books/psychology.jpg"],
    },
    {
      id: "6",
      name: "Classic Literature",
      bookCount: 32,
      isPublic: true,
      createdBy: "Emily Davis",
      coverImages: ["/books/gatsby.jpg", "/books/wood.jpg"],
    },
  ]);

  const handleCreateFolder = (name: string, isPublic: boolean) => {
    const newFolder = {
      id: Date.now().toString(),
      name,
      bookCount: 0,
      isPublic,
      coverImages: [],
      createdBy: "You",
    };

    if (isPublic) {
      setPublicFolders([newFolder, ...publicFolders]);
    } else {
      setPrivateFolders([newFolder, ...privateFolders]);
    }
  };

  const handleFolderClick = (folder: any) => {
    router.push(`/app/folders/${folder.id}`);
  };

  const handleFolderEdit = (folder: any) => {
    router.push(`/app/folders/edit/${folder.id}`);
  };

  const handleFolderDelete = (folder: any) => {
    if (confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      if (folder.isPublic) {
        setPublicFolders(publicFolders.filter((f) => f.id !== folder.id));
      } else {
        setPrivateFolders(privateFolders.filter((f) => f.id !== folder.id));
      }
    }
  };

  const displayedFolders =
    activeTab === "private" ? privateFolders : publicFolders;
  const filteredFolders = displayedFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <PageHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="p-8">
          <div className="flex gap-4 items-center justify-between mb-8">
            <FolderVisibilityToggle
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center text-sm md:text-lg space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Create Folder</span>
            </button>
          </div>

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
                ? "No private folders yet. Create your first folder!"
                : "No public folders available to explore."
            }
          />
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
