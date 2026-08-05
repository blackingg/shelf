"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import BooksTable from "@/app/components/Folders/BooksTable";
import { BackButton } from "@/app/components/Layout/BackButton";
import {
  FiFolder,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiBookmark,
  FiLock,
  FiArrowLeft,
  FiSearch,
  FiPlus,
  FiCheckSquare,
} from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { useNotifications } from "@/app/context/NotificationContext";
import {
  useFolderBySlug,
  useFolderActions,
  useIsFolderBookmarked,
  useBookmarkFolderActions,
  useUser,
  useFolderChildren,
} from "@/app/services";
import { useFolderPermissions } from "@/app/hooks";
import { Folder } from "@/app/types/folder";
import { FolderIcon } from "@/app/components/Folders/FolderIcon";
import { FolderBreadcrumbs } from "@/app/components/Folders/FolderBreadcrumbs";
import { CreateFolderModal } from "@/app/components/Folders/CreateFolderModal";
import { MoveFoldersModal } from "@/app/components/Folders/MoveFoldersModal";
import { FolderGrid } from "@/app/components/Folders/FolderGrid";
import { FoldersTable } from "@/app/components/Folders/FoldersTable";
import { UnifiedTable } from "@/app/components/Folders/UnifiedTable";
import FolderDetailSkeleton from "@/app/components/Skeletons/FolderDetailSkeleton";
import { shareContent } from "@/app/helpers/share";
import { ConfirmModal } from "@/app/components/Shared/ConfirmModal";
import { AddToFolderModal } from "@/app/components/Folders/AddToFolderModal";

export default function FolderClient() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [folderToMove, setFolderToMove] = useState<Folder | null>(null);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [selectedSubfolderIds, setSelectedSubfolderIds] = useState<string[]>(
    [],
  );
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showAddToFolderModal, setShowAddToFolderModal] = useState(false);
  const [showMoveFoldersModal, setShowMoveFoldersModal] = useState(false);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const { folder, isLoading, isFetching, error } = useFolderBySlug(slug);
  const { actions, isDeleting, isMoving } = useFolderActions();
  const { isBookmarked } = useIsFolderBookmarked(folder?.id || "");
  const { toggleBookmark } = useBookmarkFolderActions();
  const { children, isLoading: isLoadingChildren } = useFolderChildren(
    folder?.id || "",
  );

  const { me: user, isAuthenticated } = useUser();
  const [showCreateSubfolderModal, setShowCreateSubfolderModal] =
    useState(false);

  const isAnyModalOpen =
    showDeleteModal ||
    showMoveModal ||
    showCreateSubfolderModal ||
    showAddToFolderModal ||
    showMoveFoldersModal;

  const {
    isOwner,
    isCollaborator,
    canEditFolder,
    canDeleteFolder,
    canAddBooks,
    canRemoveBooks,
    canMoveFolder,
  } = useFolderPermissions(folder);

  const canEdit = canEditFolder;
  const canDelete = canDeleteFolder;
  const canMove = canMoveFolder;

  const isForbidden = (error as any)?.status === 403;

  const handleShare = async () => {
    if (!folder) return;

    const result = await shareContent({
      title: folder.name,
      text: `Check out the ${folder.name} folder on Shelf.`,
      url: window.location.href,
    });

    if (result === "copied") {
      addNotification("success", "Link copied to clipboard");
    }

    setShowMenu(false);
  };

  const handleToggleBookmark = async () => {
    if (!folder) return;
    await toggleBookmark(folder.id, isBookmarked);
  };

  const books = folder?.items?.map((item: any) => item.book) || [];

  const canSeeShare =
    folder?.visibility === "PUBLIC" || isOwner || isCollaborator;

  const hasMultipleActions = canEdit || canDelete;
  const showActions = hasMultipleActions || canSeeShare;

  const handleRemoveBook = async (bookId: string) => {
    if (!folder) return;
    await actions.removeBookFromFolder(folder.id, bookId);
  };

  const handleDeleteFolder = async () => {
    const target = folderToDelete || folder;
    if (!target) return;

    await actions.deleteFolder(target.id);
    setShowDeleteModal(false);
    setFolderToDelete(null);

    // If we deleted the current folder, go back to folders list
    if (!folderToDelete) {
      router.push("/folders");
    }
  };

  const handleMoveFolder = async (newParentId: string | null) => {
    const target = folderToMove || folder;
    if (!target) return;

    await actions.moveFolder(target.id, newParentId);
    setShowMoveModal(false);
    setFolderToMove(null);
  };

  const handleBulkAddToFolder = async (targetFolderId: string) => {
    setIsProcessingBulk(true);
    try {
      for (const bookId of selectedBookIds) {
        await actions.addBookToFolder(targetFolderId, bookId);
      }
      addNotification(
        "success",
        `Added ${selectedBookIds.length} books to folder`,
      );
      setSelectedBookIds([]);
      setShowAddToFolderModal(false);
    } catch (err) {
      addNotification("error", "Failed to add some books to folder");
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleBulkRemoveFromFolder = async () => {
    if (!folder) return;
    setIsProcessingBulk(true);
    try {
      for (const bookId of selectedBookIds) {
        await actions.removeBookFromFolder(folder.id, bookId);
      }
      addNotification(
        "success",
        `Removed ${selectedBookIds.length} books from folder`,
      );
      setSelectedBookIds([]);
    } catch (err) {
      addNotification("error", "Failed to remove some books from folder");
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleBulkMoveFolders = async (newParentId: string | null) => {
    setIsProcessingBulk(true);
    try {
      for (const fId of selectedSubfolderIds) {
        await actions.moveFolder(fId, newParentId);
      }
      addNotification(
        "success",
        `Moved ${selectedSubfolderIds.length} folders successfully`,
      );
      setSelectedSubfolderIds([]);
      setShowMoveFoldersModal(false);
    } catch (err) {
      addNotification("error", "Failed to move some folders");
    } finally {
      setIsProcessingBulk(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-background">
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col space-y-4">
          <BackButton />
          {folder && <FolderBreadcrumbs folderId={folder.id} />}
        </div>

        {isLoading || isLoadingChildren || (isFetching && !folder) ? (
          <FolderDetailSkeleton hideHeader />
        ) : isForbidden ? (
          <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/10 rounded-full flex items-center justify-center mb-6">
              <FiLock className="w-10 h-10 text-amber-600 dark:text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Private Folder
            </h2>
            <p className="text-sm text-muted mb-8 max-w-sm leading-relaxed">
              This folder is set to private. You don&apos;t have permission to
              view its contents. If you believe this is an error, contact the
              owner.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/folders")}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-sm text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-colors shadow-sm"
              >
                Explore Folders
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors border border-gray-100 dark:border-neutral-700/50"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : !folder ? (
          <div className="border border-line rounded-sm bg-background min-h-[48vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-xl text-left space-y-5">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span>404 folder missing</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm border border-gray-200 dark:border-neutral-700 bg-background flex items-center justify-center">
                  <FiFolder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <h2 className="text-2xl font-medium text-foreground">
                  Folder Not Found
                </h2>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                The folder you are looking for does not exist.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push("/folders")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-sm text-sm font-medium transition-colors hover:opacity-90 active:opacity-100"
                >
                  <FiSearch className="w-4 h-4" />
                  Browse Folders
                </button>
                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm border border-gray-200 dark:border-neutral-700 bg-background text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-wash transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="shrink-0 w-20 aspect-[278/194] md:w-24 rounded-sm overflow-hidden">
                  <FolderIcon
                    visibility={folder.visibility}
                    booksCount={folder.booksCount}
                    childrenCount={children && children.length > 0 ? children.length : folder.childrenCount || 0}
                    width="100%"
                    height="100%"
                  />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-medium text-foreground mb-2">
                    {folder.name}
                  </h1>
                  <p className="text-muted max-w-2xl mb-4 text-sm md:text-base leading-relaxed">
                    {folder.description || "No description provided."}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-faint">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{folder.booksCount} books</span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <FiBookmark className="w-3 h-3 text-primary" />
                      <span>{folder.bookmarksCount} bookmarks</span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <div className="flex items-center gap-1.5">
                      <FiFolder className="w-3 h-3 text-primary" />
                      <span>
                        {children.length > 0
                          ? children.length
                          : folder.childrenCount || 0}{" "}
                        subfolders
                      </span>
                    </div>
                    <span className="hidden md:inline">•</span>
                    <span>
                      Created by{" "}
                      <Link
                        href={`/profile/${encodeURIComponent((folder.user?.username || "").replace(/\s+/g, ""))}`}
                        className="underline-offset-2 hover:underline"
                      >
                        {folder.user?.username}
                      </Link>
                    </span>
                    <span className="hidden md:inline">•</span>
                    <span className="capitalize">
                      {folder.visibility.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end lg:self-start">
                {isAuthenticated && (
                  <button
                    onClick={handleToggleBookmark}
                    className={`p-2 rounded-sm transition-all duration-200 border ${
                      isBookmarked
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                    title={
                      isBookmarked
                        ? "Remove from bookmarks"
                        : "Add to bookmarks"
                    }
                  >
                    <FiBookmark
                      className={`w-6 h-6 md:w-5 md:h-5 ${isBookmarked ? "fill-current" : ""}`}
                    />
                  </button>
                )}

                {showActions && (
                  <div className="relative">
                    {hasMultipleActions ? (
                      <>
                        <button
                          onClick={() => setShowMenu(!showMenu)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-sm transition-colors text-muted"
                        >
                          <FiMoreVertical className="w-6 h-6 md:w-5 md:h-5" />
                        </button>

                        {showMenu && (
                          <div className="absolute right-0 mt-2 w-48 bg-background rounded-sm border border-gray-100 dark:border-white/10 py-1 z-10 shadow-lg">
                            {canEdit && (
                              <button
                                onClick={() =>
                                  router.push(`/folders/${folder.slug}/edit`)
                                }
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-neutral-300 hover:bg-wash flex items-center space-x-2 transition-colors"
                              >
                                <FiEdit2 className="w-4 h-4" />
                                <span>Edit Folder</span>
                              </button>
                            )}
                            {canEdit && (
                              <button
                                onClick={() => {
                                  setShowMenu(false);
                                  setShowCreateSubfolderModal(true);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-neutral-300 hover:bg-wash flex items-center space-x-2 transition-colors"
                              >
                                <FiPlus className="w-4 h-4" />
                                <span>Add Subfolder</span>
                              </button>
                            )}
                            {canSeeShare && (
                              <button
                                onClick={handleShare}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-neutral-300 hover:bg-wash flex items-center space-x-2 transition-colors"
                              >
                                <FiShare2 className="w-4 h-4" />
                                <span>Share</span>
                              </button>
                            )}
                            {canMove && (
                              <button
                                onClick={() => {
                                  setShowMenu(false);
                                  setShowMoveModal(true);
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-neutral-300 hover:bg-wash flex items-center space-x-2 transition-colors"
                              >
                                <FiFolder className="w-4 h-4" />
                                <span>Move Folder</span>
                              </button>
                            )}
                            {canDelete && (
                              <>
                                {(canEdit || canSeeShare) && (
                                  <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                                )}
                                <button
                                  onClick={() => {
                                    setShowMenu(false);
                                    setShowDeleteModal(true);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-danger hover:bg-danger-wash flex items-center space-x-2 transition-colors"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </button>
                              </>
                            )}
                            <div className="border-t border-gray-100 dark:border-white/5 my-1" />
                            <button
                              onClick={() => {
                                setIsSelectionMode(!isSelectionMode);
                                setShowMenu(false);
                                if (isSelectionMode) {
                                  setSelectedBookIds([]);
                                  setSelectedSubfolderIds([]);
                                }
                              }}
                              className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                                isSelectionMode
                                  ? "text-primary bg-primary/5"
                                  : "text-gray-700 dark:text-neutral-300 hover:bg-wash"
                              }`}
                            >
                              <FiCheckSquare className="w-4 h-4" />
                              <span>
                                {isSelectionMode
                                  ? "Exit Selection"
                                  : "Select Items"}
                              </span>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={handleShare}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-sm transition-colors text-muted border border-transparent hover:border-gray-100 dark:hover:border-neutral-700/50"
                        title="Share Folder"
                      >
                        <FiShare2 className="w-6 h-6 md:w-5 md:h-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-faint">
                  Contents
                </h3>
                {canEdit && (
                  <button
                    onClick={() => setShowCreateSubfolderModal(true)}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
                  >
                    + New Subfolder
                  </button>
                )}
              </div>

              <UnifiedTable
                resources={[
                  ...children.map((f) => ({
                    type: "folder" as const,
                    data: f,
                  })),
                  ...books.map((b: any) => ({
                    type: "book" as const,
                    data: b,
                  })),
                ]}
                onBookClick={(bookId) => {
                  const book = books.find((b: any) => b.id === bookId);
                  router.push(`/books/${book?.slug || bookId}/read`);
                }}
                onFolderClick={(f) => router.push(`/folders/${f.slug}`)}
                onFolderEdit={(f) => router.push(`/folders/${f.slug}/edit`)}
                onFolderDelete={(f) => {
                  setFolderToDelete(f);
                  setShowDeleteModal(true);
                }}
                onFolderMove={(f) => {
                  setFolderToMove(f);
                  setShowMoveModal(true);
                }}
                onRemoveBook={handleRemoveBook}
                canEdit={canEdit}
                selectedBookIds={selectedBookIds}
                selectedFolderIds={selectedSubfolderIds}
                onSelectionChange={
                  isSelectionMode
                    ? (type, ids) => {
                        if (type === "book") setSelectedBookIds(ids);
                        else setSelectedSubfolderIds(ids);
                      }
                    : undefined
                }
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setFolderToDelete(null);
        }}
        onConfirm={handleDeleteFolder}
        title="Delete Folder"
        message={`Are you sure you want to delete "${folderToDelete?.name || folder?.name}"? This action will remove the folder and all its organizational data.`}
        confirmText="Delete Folder"
        isDanger
        isLoading={isDeleting}
      />

      <CreateFolderModal
        isOpen={showCreateSubfolderModal}
        onClose={() => setShowCreateSubfolderModal(false)}
        onSubmit={async (name, visibility, description, parentId) => {
          await actions.createFolder({
            name,
            visibility,
            description,
            parentId,
          });
          setShowCreateSubfolderModal(false);
        }}
        parentId={folder?.id}
        parentVisibility={folder?.visibility}
        lockParent={true}
      />

      {(folderToMove || folder) && (
        <MoveFoldersModal
          isOpen={showMoveModal}
          onClose={() => {
            setShowMoveModal(false);
            setFolderToMove(null);
          }}
          onConfirm={handleMoveFolder}
          folderIds={folderToMove ? [folderToMove.id] : [folder!.id]}
          isMoving={isMoving}
        />
      )}

      <AddToFolderModal
        isOpen={showAddToFolderModal}
        onClose={() => setShowAddToFolderModal(false)}
        onConfirm={handleBulkAddToFolder}
        selectedCount={selectedBookIds.length}
        isProcessing={isProcessingBulk}
        currentFolderId={folder?.id}
      />

      <MoveFoldersModal
        isOpen={showMoveFoldersModal}
        onClose={() => setShowMoveFoldersModal(false)}
        onConfirm={handleBulkMoveFolders}
        selectedCount={selectedSubfolderIds.length}
        isMoving={isProcessingBulk}
        folderIds={selectedSubfolderIds}
      />

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {!isAnyModalOpen &&
          (selectedBookIds.length > 0 || selectedSubfolderIds.length > 0) && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-[calc(4.5rem+var(--safe-area-inset-bottom))] lg:bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-background border border-gray-100 dark:border-white/10 rounded-sm shadow-2xl p-3 sm:p-4 flex items-center justify-between space-x-3 sm:space-x-6 w-[calc(100%-2rem)] max-w-md sm:w-auto sm:max-w-none sm:min-w-[500px]"
            >
              <div className="flex items-center space-x-4 pr-6 border-r border-gray-100 dark:border-white/5">
                {selectedBookIds.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center text-primary font-bold text-xs">
                      {selectedBookIds.length}
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Books
                    </span>
                  </div>
                )}
                {selectedSubfolderIds.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-sm flex items-center justify-center text-primary font-bold text-xs">
                      {selectedSubfolderIds.length}
                    </div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Folders
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {selectedBookIds.length > 0 && (
                  <button
                    onClick={() => setShowAddToFolderModal(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors flex items-center space-x-2"
                  >
                    <FiFolder className="w-3.5 h-3.5" />
                    <span>Add to Folder</span>
                  </button>
                )}

                {canMove && selectedSubfolderIds.length > 0 && (
                  <button
                    onClick={() => setShowMoveFoldersModal(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-sm text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-colors flex items-center space-x-2"
                  >
                    <FiFolder className="w-3.5 h-3.5" />
                    <span>Move Folders</span>
                  </button>
                )}

                {canRemoveBooks && selectedBookIds.length > 0 && (
                  <button
                    onClick={handleBulkRemoveFromFolder}
                    disabled={isProcessingBulk}
                    className="px-4 py-2 bg-red-50 dark:bg-red-900/10 text-danger rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center space-x-2 border border-red-100 dark:border-red-900/20"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                    <span>Remove Books</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedBookIds([]);
                    setSelectedSubfolderIds([]);
                  }}
                  className="px-4 py-2 text-muted hover:text-gray-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
