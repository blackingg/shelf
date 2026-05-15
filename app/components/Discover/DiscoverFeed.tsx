"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiBook, FiFolder } from "react-icons/fi";
import { useDiscoverFeed } from "@/app/services";
import {
  FolderCard,
  FolderCardSkeleton,
} from "@/app/components/Folders/FolderCard";
import { BookCard, BookCardSkeleton } from "@/app/components/Library/BookCard";
import { BookPreview } from "@/app/types/book";
import { Folder } from "@/app/types/folder";

interface DiscoverFeedProps {
  onBookClick: (book: BookPreview) => void;
  onFolderEdit: (folder: Folder) => void;
  onFolderDelete: (folder: Folder) => void;
}

type DiscoverTab = "books" | "folders";

export const DiscoverFeed = ({
  onBookClick,
  onFolderEdit,
  onFolderDelete,
}: DiscoverFeedProps) => {
  const router = useRouter();
  const [discoverTab, setDiscoverTab] = useState<DiscoverTab>("books");

  const { recommendations, isLoading } = useDiscoverFeed({ enabled: true });

  const { recBooks, recFolders } = useMemo(() => {
    if (!recommendations) return { recBooks: [], recFolders: [] };
    const items = recommendations.items || [];
    return {
      recFolders: items
        .filter((item: any) => item.type === "folder")
        .map((item: any) => ({ ...item.data, type: "folder" as const })),
      recBooks: items
        .filter((item: any) => item.type === "book")
        .map((item: any) => ({ ...item.data, type: "book" as const })),
    };
  }, [recommendations]);

  const activeItems = discoverTab === "books" ? recBooks : recFolders;

  return (
    <div className="mb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
          Discover
        </h2>

        <div className="flex gap-1 bg-gray-100/50 dark:bg-white/5 p-1 rounded-sm w-fit">
          {[
            { id: "books", label: "Books", icon: FiBook },
            { id: "folders", label: "Folders", icon: FiFolder },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = discoverTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDiscoverTab(tab.id as DiscoverTab)}
                className={`flex items-center gap-2 px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? "bg-white dark:bg-neutral-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-stretch gap-6 md:gap-8 overflow-x-auto pb-6 custom-scrollbar -mx-4 px-4 md:-mx-8 md:px-8">
          <div className="w-60 md:w-[280px] shrink-0">
            <FolderCardSkeleton count={1} />
          </div>
          <div className="w-60 md:w-[280px] shrink-0">
            <FolderCardSkeleton count={1} />
          </div>
          <div className="w-60 md:w-[280px] shrink-0">
            <BookCardSkeleton count={1} />
          </div>
          <div className="w-60 md:w-[280px] shrink-0">
            <BookCardSkeleton count={1} />
          </div>
        </div>
      ) : activeItems.length > 0 ? (
        <div className="flex items-stretch gap-8 md:gap-10 overflow-x-auto pb-6 custom-scrollbar -mx-4 px-4 md:-mx-8 md:px-8">
          {activeItems.map((item, idx) => (
            <div
              key={`rec-${item.type}-${item.id}-${idx}`}
              className="w-60 md:w-[300px] shrink-0"
            >
              {item.type === "folder" ? (
                <FolderCard
                  folder={item}
                  showActions={true}
                  onEdit={() => onFolderEdit(item)}
                  onDelete={() => onFolderDelete(item)}
                  onClick={() => router.push(`/folders/${item.slug}`)}
                />
              ) : (
                <BookCard
                  {...(item as any)}
                  onClick={() => onBookClick(item as any)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[30vh] bg-gray-50/30 dark:bg-neutral-900/10 p-16 rounded-md border border-gray-100 dark:border-neutral-800/50 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-md flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-neutral-700/50">
            <FiBook className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Recommendations Yet
          </h3>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 max-w-xs mx-auto">
            Start exploring to get personalized suggestions.
          </p>
        </div>
      )}
    </div>
  );
};
