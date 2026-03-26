"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiBook,
  FiBookmark,
  FiEdit2,
  FiFolder,
  FiHeart,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import {
  FolderCard,
  FolderCardSkeleton,
} from "@/app/components/Folders/FolderCard";
import { FolderGrid } from "@/app/components/Folders/FolderGrid";
import { CreateFolderModal } from "@/app/components/Folders/CreateFolderModal";
import { ConfirmModal } from "@/app/components/ConfirmModal";
import { BookDetailPanel } from "@/app/components/Library/BookDetailPanel";
import { Pagination } from "@/app/components/Library/Pagination";
import { BookPreview } from "@/app/types/book";
import { Folder, FolderVisibility } from "@/app/types/folder";
import {
  useGetBookmarkedBooksQuery,
  useGetBookmarkedFoldersQuery,
} from "@/app/store/api/bookmarksApi";
import {
  useGetMeFoldersQuery,
  useCreateFolderMutation,
  useDeleteFolderMutation,
} from "@/app/store/api/foldersApi";
import { useGetUserBooksQuery } from "@/app/store/api/usersApi";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";
import { useAppSelector } from "@/app/store/store";
import { selectCurrentUser } from "@/app/store/authSlice";
import { BookCardListView } from "@/app/components/Donation_ListView";
import { DeleteModal } from "@/app/components/Library/DeleteConfirmationModal";

type LibraryTab = "bookmarks" | "folders" | "uploads";

export default function LibraryPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();

  const activeUser = useAppSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<LibraryTab>("bookmarks");
  const [selectedBook, setSelectedBook] = useState<BookPreview | null>(null);

  // Uploads state
  const [uploadPage, setUploadPage] = useState(1);

  // Bookmarks state
  const [bookmarkPage, setBookmarkPage] = useState(1);
  const [bookmarkFolderPage, setBookmarkFolderPage] = useState(1);
  const [bookmarkSubTab, setBookmarkSubTab] = useState<"books" | "folders">(
    "books",
  );

  // Folders state
  const [folderPage, setFolderPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [viewState, updateViewState] = useState("grid");

  const pageSize = 8;

  // ── Bookmarks queries ──
  const {
    data: bookmarkedBooksResponse,
    isLoading: isLoadingBookmarkedBooks,
    isFetching: isFetchingBookmarkedBooks,
  } = useGetBookmarkedBooksQuery(
    { page: bookmarkPage, pageSize },
    { skip: activeTab !== "bookmarks" || bookmarkSubTab !== "books" },
  );

  const {
    data: bookmarkedFoldersResponse,
    isLoading: isLoadingBookmarkedFolders,
    isFetching: isFetchingBookmarkedFolders,
  } = useGetBookmarkedFoldersQuery(
    { page: bookmarkFolderPage, pageSize },
    { skip: activeTab !== "bookmarks" || bookmarkSubTab !== "folders" },
  );

  // ── Folders queries ──
  const {
    data: myFoldersResponse,
    isLoading: isLoadingMyFolders,
    isFetching: isFetchingMyFolders,
  } = useGetMeFoldersQuery(
    { page: folderPage, pageSize },
    { skip: activeTab !== "folders" },
  );

  const [createFolder] = useCreateFolderMutation();
  const [deleteFolderMutation] = useDeleteFolderMutation();

  // ── Uploads queries ──
  const {
    data: myBooksResponse,
    isLoading: isLoadingMyBooks,
    isFetching: isFetchingMyBooks,
  } = useGetUserBooksQuery(
    { username: activeUser?.username || "", page: uploadPage, pageSize },
    { skip: activeTab !== "uploads" || !activeUser?.username },
  );
  // ── Bookmarks data ──
  const bookmarkedBooks = bookmarkedBooksResponse?.items || [];
  const totalBookmarkedBooks = bookmarkedBooksResponse?.total || 0;
  const bookmarkedFolders = bookmarkedFoldersResponse?.items || [];
  const totalBookmarkedFolders = bookmarkedFoldersResponse?.total || 0;
  const showBooksSkeleton =
    !bookmarkedBooksResponse &&
    (isLoadingBookmarkedBooks || isFetchingBookmarkedBooks);
  const showFoldersSkeleton =
    !bookmarkedFoldersResponse &&
    (isLoadingBookmarkedFolders || isFetchingBookmarkedFolders);

  // ── Folders data ──
  const myFolders = myFoldersResponse?.items || [];

  // ── Uploads data ──
  const myBooks = myBooksResponse?.items || [];
  const showUploadsSkeleton =
    !myBooksResponse && (isLoadingMyBooks || isFetchingMyBooks);

  // ── Handlers ──
  const handleCreateFolder = async (
    name: string,
    visibility: FolderVisibility,
    description?: string,
  ) => {
    try {
      await createFolder({ name, visibility, description }).unwrap();
      addNotification("success", "Folder created successfully!");
      setShowCreateModal(false);
    } catch (err: any) {
      addNotification("error", getErrorMessage(err, "Failed to create folder"));
    }
  };

  const handleFolderClick = (folder: Folder) => {
    router.push(`/app/folders/${folder.slug}`);
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
          getErrorMessage(err, "Failed to delete folder"),
        );
      }
    }
    setShowDeleteModal(false);
    setFolderToDelete(null);
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
              <div className="space-y-8">
                <div
                  className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6`}
                >
                  {showBooksSkeleton ? (
                    <BookCardSkeleton count={5} />
                  ) : bookmarkedBooks.length > 0 ? (
                    bookmarkedBooks.map((book) => (
                      <BookCard
                        key={book.id}
                        {...book}
                        onClick={() => setSelectedBook(book as BookPreview)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full min-h-[50vh] flex items-center justify-center">
                      <div className="py-20 text-center flex flex-col items-center border border-dashed border-gray-200 dark:border-neutral-800 rounded-lg w-full">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                          <FiBookmark className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          No bookmarked books
                        </h3>
                        <p className="text-gray-500 dark:text-neutral-400 font-medium">
                          Books you bookmark will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {bookmarkedBooks.length > 0 && (
                  <Pagination
                    currentPage={bookmarkPage}
                    totalPages={bookmarkedBooksResponse?.totalPages || 1}
                    onPageChange={setBookmarkPage}
                    isLoading={showBooksSkeleton}
                  />
                )}
              </div>
            )}

            {bookmarkSubTab === "folders" && (
              <div className="space-y-8">
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 ${
                    showFoldersSkeleton ? "opacity-50" : ""
                  }`}
                >
                  {showFoldersSkeleton ? (
                    <FolderCardSkeleton count={4} />
                  ) : bookmarkedFolders && bookmarkedFolders.length > 0 ? (
                    bookmarkedFolders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        onClick={() =>
                          router.push(`/app/folders/${folder.slug}`)
                        }
                      />
                    ))
                  ) : (
                    <div className="col-span-full min-h-[50vh] flex items-center justify-center">
                      <div className="py-20 text-center flex flex-col items-center border border-dashed border-gray-200 dark:border-neutral-800 rounded-lg w-full">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                          <FiFolder className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          No bookmarked folders
                        </h3>
                        <p className="text-gray-500 dark:text-neutral-400 font-medium">
                          Folders you bookmark will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {bookmarkedFolders.length > 0 &&
                  bookmarkedFoldersResponse &&
                  bookmarkedFoldersResponse.totalPages > 1 && (
                    <Pagination
                      currentPage={bookmarkFolderPage}
                      totalPages={bookmarkedFoldersResponse.totalPages}
                      onPageChange={setBookmarkFolderPage}
                      isLoading={showFoldersSkeleton}
                    />
                  )}
              </div>
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
                router.push(`/app/folders/${folder.slug}/edit`)
              }
              onFolderDelete={handleFolderDelete}
              showActions={true}
              isLoading={isLoadingMyFolders}
              emptyMessage="No folders found. Create your first folder!"
              className={isFetchingMyFolders ? "opacity-50" : ""}
            />

            {myFoldersResponse && myFoldersResponse.totalPages > 1 && (
              <Pagination
                currentPage={folderPage}
                totalPages={myFoldersResponse.totalPages}
                onPageChange={setFolderPage}
                isLoading={isFetchingMyFolders}
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
                {myBooksResponse?.total || 0} book
                {myBooksResponse?.total !== 1 ? "s" : ""} donated
              </p>
              {(myBooksResponse?.total || 0) > 0 && (
                <div className="flex md:gap-x-4 gap-x-2 items-center">
                  <div className="flex gap-x-2">
                    <FiGrid
                      className="w-6 h-6"
                      onClick={() => updateViewState("grid")}
                    />
                    <FiList
                      className="w-6 h-6"
                      onClick={() => updateViewState("list")}
                    />
                  </div>
                  <button
                    onClick={() => router.push("/app/books/upload")}
                    className="flex items-center text-sm space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-150"
                  >
                    <FiHeart className="w-4 h-4" />
                    <span>Donate Another</span>
                  </button>
                </div>
              )}
            </div>

            <div
              className={` ${viewState === "list" ? "block" : "grid"} grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6`}
            >
              {showUploadsSkeleton ? (
                <BookCardSkeleton count={5} />
              ) : myBooks.length > 0 ? (
                viewState == "grid" ? (
                  myBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      {...book}
                      onClick={() => setSelectedBook(book as BookPreview)}
                    />
                  ))
                ) : (
                  myBooks.map((book) => (
                    <BookCardListView
                      book={book}
                      key={book.id}
                      deleteFunct={() => {
                        setSelectedBook(book as BookPreview);
                      }}
                    />
                  ))
                )
              ) : (
                <div className="col-span-full min-h-[50vh] flex items-center justify-center">
                  <div className="py-20 text-center flex flex-col items-center border border-dashed border-gray-200 dark:border-neutral-800 rounded-lg w-full max-w-lg">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                      <FiHeart className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      No Donated Books
                    </h3>
                    <p className="text-gray-500 dark:text-neutral-400 font-medium mb-6 max-w-xs">
                      Books you upload and donate to the community will appear
                      here.
                    </p>
                    <button
                      onClick={() => router.push("/app/books/upload")}
                      className="flex items-center text-sm space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-md font-medium transition-colors duration-150"
                    >
                      <FiHeart className="w-4 h-4" />
                      <span>Donate a Book</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {myBooks.length > 0 && (
              <Pagination
                currentPage={uploadPage}
                totalPages={myBooksResponse?.totalPages || 1}
                onPageChange={setUploadPage}
                isLoading={showUploadsSkeleton}
              />
            )}
          </div>
        )}
      </div>

      {viewState !== "list" && (
        <BookDetailPanel
          book={selectedBook!}
          isOpen={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          isDonationsPage={activeTab === "uploads"}
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
      />
    </>
  );
}
