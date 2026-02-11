"use client";

import { SearchResultItem } from "@/app/types/search";

interface SearchListItemProps {
  item: SearchResultItem;
  onClick: () => void;
}

const dotColors: Record<string, string> = {
  book: "bg-blue-500",
  folder: "bg-yellow-400",
  user: "bg-purple-500",
};

const typeLabels: Record<string, string> = {
  book: "Book",
  folder: "Folder",
  user: "User",
};

function getTitle(item: SearchResultItem): string {
  if (item.type === "book") return item.data.title;
  if (item.type === "folder") return item.data.name;
  if (item.type === "user") return item.data.fullName || item.data.username;
  return "";
}

function getMeta(item: SearchResultItem): string {
  if (item.type === "book") return item.data.author;
  if (item.type === "folder")
    return `${item.data.booksCount} ${item.data.booksCount === 1 ? "book" : "books"}`;
  if (item.type === "user") return `@${item.data.username}`;
  return "";
}

function getDate(item: SearchResultItem): string {
  if (item.type === "folder" && item.data.createdAt) {
    return new Date(item.data.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return "";
}

export const SearchListItem: React.FC<SearchListItemProps> = ({
  item,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 py-3 px-4 text-left transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md group"
    >
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColors[item.type] || "bg-gray-400"}`}
      />

      <span className="flex-1 font-medium text-sm text-gray-900 dark:text-neutral-100 truncate">
        {getTitle(item)}
      </span>

      <span className="hidden sm:block text-xs text-gray-500 dark:text-neutral-400 truncate max-w-[200px]">
        {getMeta(item)}
      </span>

      <span className="hidden md:block text-[10px] uppercase tracking-wider text-gray-400 dark:text-neutral-500 w-12 text-right">
        {typeLabels[item.type]}
      </span>

      <span className="hidden lg:block text-xs text-gray-400 dark:text-neutral-500 w-24 text-right tabular-nums">
        {getDate(item)}
      </span>
    </button>
  );
};
