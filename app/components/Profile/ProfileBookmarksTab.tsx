"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BookPreview } from "@/app/types/book";
import {
  useBookmarkedBooks,
  useBookmarkedFolders,
} from "@/app/services/bookmarks/hooks";
import { PaginatedBookGrid } from "@/app/components/Library/PaginatedBookGrid";
import { PaginatedFolderGrid } from "@/app/components/Folders/PaginatedFolderGrid";

interface ProfileBookmarksTabProps {
  pageSize: number;
  bookmarkBooksPage: number;
  setBookmarkBooksPage: (page: number) => void;
  bookmarkFoldersPage: number;
  setBookmarkFoldersPage: (page: number) => void;
  setSelectedBook: (book: BookPreview) => void;
}

export const ProfileBookmarksTab: React.FC<ProfileBookmarksTabProps> = ({
  pageSize,
  bookmarkBooksPage,
  setBookmarkBooksPage,
  bookmarkFoldersPage,
  setBookmarkFoldersPage,
  setSelectedBook,
}) => {
  const router = useRouter();

  const {
    books: bookmarkedBooksItems,
    totalPages: bookmarkedBooksTotalPages,
    isFetching: isFetchingBookmarkedBooks,
  } = useBookmarkedBooks({ page: bookmarkBooksPage, limit: pageSize });

  const {
    folders: bookmarkedFoldersItems,
    totalPages: bookmarkedFoldersTotalPages,
    isFetching: isFetchingBookmarkedFolders,
  } = useBookmarkedFolders({ page: bookmarkFoldersPage, limit: pageSize });

  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Bookmarked Books
          </h3>
        </div>
        <PaginatedBookGrid
          books={bookmarkedBooksItems}
          isLoading={isFetchingBookmarkedBooks}
          totalPages={bookmarkedBooksTotalPages}
          currentPage={bookmarkBooksPage}
          onPageChange={setBookmarkBooksPage}
          onBookClick={setSelectedBook}
          pageSize={pageSize}
          emptyMessage="No books bookmarked."
        />
      </section>

      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Bookmarked Folders
          </h3>
        </div>
        <PaginatedFolderGrid
          folders={bookmarkedFoldersItems}
          isLoading={isFetchingBookmarkedFolders}
          totalPages={bookmarkedFoldersTotalPages}
          currentPage={bookmarkFoldersPage}
          onPageChange={setBookmarkFoldersPage}
          onFolderClick={(folder) => router.push(`/app/folders/${folder.slug}`)}
          pageSize={pageSize}
          emptyMessage="No folders bookmarked."
        />
      </section>
    </div>
  );
};
