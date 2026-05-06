"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiBook, FiBookmark, FiFolder, FiHeart } from "react-icons/fi";
import { FolderGrid } from "@/app/components/Folders/FolderGrid";
import { CreateFolderModal } from "@/app/components/Folders/CreateFolderModal";
import { ConfirmModal } from "@/app/components/Shared/ConfirmModal";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { PaginatedBookGrid } from "@/app/components/Library/PaginatedBookGrid";
import { PaginatedFolderGrid } from "@/app/components/Folders/PaginatedFolderGrid";
import { Pagination } from "@/app/components/Library/Pagination";
import { useResponsiveLimit } from "@/app/hooks/useResponsiveLimit";
import { BookPreview } from "@/app/types/book";
import { Folder, FolderVisibility } from "@/app/types/folder";
import {
  useBookmarkedBooks,
  useBookmarkedFolders,
  useMeFolders,
  useFolderActions,
  useUserBooks,
  useBookActions,
} from "@/app/services";
import { useNotifications } from "@/app/context/NotificationContext";
import { DeleteModal } from "@/app/components/Library/DeleteConfirmationModal";
import { useGetMeQuery } from "@/app/services";

type LibraryTab = "bookmarks" | "folders" | "uploads";
type BookmarkSubTab = "books" | "folders";

function isLibraryTab(value: string | null): value is LibraryTab {
  return value === "bookmarks" || value === "folders" || value === "uploads";
}

function isBookmarkSubTab(value: string | null): value is BookmarkSubTab {
  return value === "books" || value === "folders";
}

export default function LibraryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addNotification } = useNotifications();

  const tabParam = searchParams.get("tab");
  const bookmarkParam = searchParams.get("bookmark");

  const initialTab: LibraryTab = isLibraryTab(tabParam)
    ? tabParam
    : "bookmarks";
  const initialBookmarkSubTab: BookmarkSubTab = isBookmarkSubTab(bookmarkParam)
    ? bookmarkParam
    : "books";

  const { data: activeUser } = useGetMeQuery();
  const [activeTab, setActiveTab] = useState<LibraryTab>(initialTab);
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);

  // Uploads state
  const [uploadPage, setUploadPage] = useState(1);
  const [showBookDeleteModal, setShowBookDeleteModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookPreview | null>(null);

  // Bookmarks state
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [bookmarkFolderPage, setBookmarkFolderPage] = useState(1);
  const [bookmarkSubTab, setBookmarkSubTab] = useState<BookmarkSubTab>(
    initialBookmarkSubTab,
  );

  // Folders state
  const [folderPage, setFolderPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [viewState, updateViewState] = useState("grid");

  const pageSize = useResponsiveLimit({ base: 2, md: 4, lg: 5 }, 2, 8);

  useEffect(() => {
    setUploadPage(1);
    setBookmarkPage(1);
    setBookmarkFolderPage(1);
    setFolderPage(1);
  }, [pageSize]);

  useEffect(() => {
    const nextTabParam = searchParams.get("tab");
    const nextBookmarkParam = searchParams.get("bookmark");

    const tabFromUrl: LibraryTab = isLibraryTab(nextTabParam)
      ? nextTabParam
      : "bookmarks";
    const bookmarkFromUrl: BookmarkSubTab = isBookmarkSubTab(nextBookmarkParam)
      ? nextBookmarkParam
      : "books";

    if (tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }

    if (tabFromUrl === "bookmarks" && bookmarkFromUrl !== bookmarkSubTab) {
      setBookmarkSubTab(bookmarkFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", activeTab);

    if (activeTab === "bookmarks") {
      params.set("bookmark", bookmarkSubTab);
    } else {
      params.delete("bookmark");
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }
  }, [activeTab, bookmarkSubTab, pathname, router, searchParams]);

  const {
    books: bookmarkedBooks,
    total: totalBookmarkedBooks,
    totalPages: bookmarkedBooksTotalPages,
    isLoading: isLoadingBookmarkedBooks,
    isFetching: isFetchingBookmarkedBooks,
  } = useBookmarkedBooks(
    { page: bookmarkPage, limit: pageSize },
    { enabled: activeTab === "bookmarks" && bookmarkSubTab === "books" },
  );

  const {
    folders: bookmarkedFolders,
    total: totalBookmarkedFolders,
    totalPages: bookmarkedFoldersTotalPages,
    isLoading: isLoadingBookmarkedFolders,
    isFetching: isFetchingBookmarkedFolders,
  } = useBookmarkedFolders(
    { page: bookmarkFolderPage, limit: pageSize },
    { enabled: activeTab === "bookmarks" && bookmarkSubTab === "folders" },
  );

  // ── Folders queries ──
  const {
    folders: myFolders,
    total: totalMyFolders,
    totalPages: myFoldersTotalPages,
    isLoading: isLoadingMyFolders,
    isFetching: isFetchingMyFolders,
  } = useMeFolders({
    page: folderPage,
    limit: pageSize,
    enabled: activeTab === "folders",
  });

  const { actions: folderActions, isDeleting: isDeletingFolder } =
    useFolderActions();
  const { actions: bookActions, isDeleting: isDeletingBook } = useBookActions();

  // ── Uploads queries ──
  const {
    books: myBooks,
    total: myBooksTotal,
    totalPages: myBooksTotalPages,
    isLoading: isLoadingMyBooks,
    isFetching: isFetchingMyBooks,
  } = useUserBooks(
    { username: activeUser?.username || "", page: uploadPage, limit: pageSize },
    { enabled: activeTab === "uploads" && !!activeUser?.username },
  );
  // ── Simplified loading helpers ──

  // ── Handlers ──
  const handleCreateFolder = async (
    name: string,
    visibility: FolderVisibility,
    description?: string,
  ) => {
    try {
      await folderActions.createFolder({ name, visibility, description });
      setShowCreateModal(false);
    } catch (err: any) {
      // handled in actions
    }
  };

  const handleFolderClick = (folder: Folder) => {
    router.push(`/folders/${folder.slug}`);
  };

  const handleFolderDelete = (folder: Folder) => {
    setFolderToDelete(folder);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (folderToDelete) {
      try {
        await folderActions.deleteFolder(folderToDelete.id);
      } catch (err: any) {
        // handled in actions
      }
    }
    setShowDeleteModal(false);
    setFolderToDelete(null);
  };

  const handleBookEdit = (book: BookPreview) => {
    router.push(`/books/${book.slug}/edit`);
  };

  const handleBookDelete = (book: BookPreview) => {
    setBookToDelete(book);
    setShowBookDeleteModal(true);
  };

  const confirmBookDelete = async () => {
    if (bookToDelete) {
      try {
        await bookActions.deleteBook(bookToDelete.id);
        addNotification("success", "Resource deleted successfully");
      } catch (err: any) {
        // handled in actions
      }
    }
    setShowBookDeleteModal(false);
    setBookToDelete(null);
  };

  // ── Tabs config ──
  const tabs = [
    {
      id: "bookmarks" as const,
      label: "Bookmarks",
      icon: FiBookmark,
    },
    {
      id: "folders" as const,
      label: "My Folders",
      icon: FiFolder,
    },
    {
      id: "uploads" as const,
      label: "My Uploads",
      icon: FiHeart,
    },
  ];

  const bookmarkSubTabs = [
    {
      id: "books" as const,
      label: "Books",
      icon: FiBook,
      count: totalBookmarkedBooks,
    },
    {
      id: "folders" as const,
      label: "Folders",
      icon: FiFolder,
      count: totalBookmarkedFolders,
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-0">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-6">
            My Library
          </h1>

          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 shrink-0 ${
                    isActive
                      ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        {activeTab === "bookmarks" && (
          <div>
            <div className="flex gap-1 mb-8 overflow-x-auto no-scrollbar pb-1">
              {bookmarkSubTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = bookmarkSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setBookmarkSubTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 shrink-0 ${
                      isActive
                        ? "bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isActive
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {bookmarkSubTab === "books" && (
              <PaginatedBookGrid
                books={bookmarkedBooks}
                isLoading={isLoadingBookmarkedBooks}
                totalPages={bookmarkedBooksTotalPages}
                currentPage={bookmarkPage}
                onPageChange={setBookmarkPage}
                onBookClick={(book) => setSelectedBook(book)}
                pageSize={pageSize}
                emptyTitle="No bookmarked books"
                emptyMessage="Books you bookmark will appear here."
                emptyIcon={
                  <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                    <FiBookmark className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                  </div>
                }
              />
            )}

            {bookmarkSubTab === "folders" && (
              <PaginatedFolderGrid
                folders={bookmarkedFolders}
                isLoading={isLoadingBookmarkedFolders}
                totalPages={bookmarkedFoldersTotalPages}
                currentPage={bookmarkFolderPage}
                onPageChange={setBookmarkFolderPage}
                onFolderClick={(folder) =>
                  router.push(`/folders/${folder.slug}`)
                }
                pageSize={pageSize}
                gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                emptyTitle="No bookmarked folders"
                emptyMessage="Folders you bookmark will appear here."
                emptyIcon={
                  <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                    <FiFolder className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                  </div>
                }
              />
            )}
          </div>
        )}

        {/* ── FOLDERS TAB ── */}
        {activeTab === "folders" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                {myFolders.length} folder{myFolders.length !== 1 ? "s" : ""}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center text-sm space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-150"
              >
                <span>Create Folder</span>
              </button>
            </div>

            <FolderGrid
              folders={myFolders}
              onFolderClick={handleFolderClick}
              onFolderEdit={(folder) =>
                router.push(`/folders/${folder.slug}/edit`)
              }
              onFolderDelete={handleFolderDelete}
              showActions={true}
              isLoading={isLoadingMyFolders}
              emptyMessage="No folders found. Create your first folder!"
            />

            {myFoldersTotalPages > 1 && (
              <Pagination
                currentPage={folderPage}
                totalPages={myFoldersTotalPages}
                onPageChange={setFolderPage}
                isLoading={isLoadingMyFolders}
                className="mt-8"
              />
            )}
          </div>
        )}

        {/* ── UPLOADS TAB ── */}
        {activeTab === "uploads" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                {myBooksTotal || 0} book
                {myBooksTotal !== 1 ? "s" : ""} donated
              </p>
              {(myBooksTotal || 0) > 0 && (
                <button
                  onClick={() => router.push("/books/upload")}
                  className="flex items-center text-sm space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-150"
                >
                  <FiHeart className="w-4 h-4" />
                  <span>Donate Another</span>
                </button>
              )}
            </div>

            <PaginatedBookGrid
              books={myBooks}
              isLoading={isLoadingMyBooks}
              totalPages={myBooksTotalPages}
              currentPage={uploadPage}
              onPageChange={setUploadPage}
              onBookClick={(book) => setSelectedBook(book)}
              onBookEdit={handleBookEdit}
              onBookDelete={handleBookDelete}
              pageSize={pageSize}
              emptyTitle="No Donated Books"
              emptyMessage="Books you upload and donate to the community will appear here."
              emptyIcon={
                <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                  <FiHeart className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                </div>
              }
              emptyAction={
                <button
                  onClick={() => router.push("/books/upload")}
                  className="flex items-center text-sm space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-150"
                >
                  <FiHeart className="w-4 h-4" />
                  <span>Donate a Book</span>
                </button>
              }
            />
          </div>
        )}
      </div>

      {viewState !== "list" && (
        <BookDetailPanel
          book={selectedBook!}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

      {viewState === "list" && (
        <DeleteModal
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          book={selectedBook!}
        />
      )}

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
                &quot;{folderToDelete.name}&quot;
              </span>
              ?
            </p>
          )
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeletingFolder}
      />

      <ConfirmModal
        isOpen={showBookDeleteModal}
        onClose={() => setShowBookDeleteModal(false)}
        onConfirm={confirmBookDelete}
        title="Delete Resource?"
        message={
          bookToDelete && (
            <p className="text-gray-600 text-left">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-600 dark:text-gray-300">
                &quot;{bookToDelete.title}&quot;
              </span>
              ? This action cannot be undone.
            </p>
          )
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeletingBook}
      />
    </>
  );
}
