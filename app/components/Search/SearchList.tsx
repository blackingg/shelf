"use client";

import { SearchResultItem } from "@/app/types/search";
import { SearchListItem } from "./SearchListItem";

interface SearchListProps {
  items: SearchResultItem[];
  onBookClick: (item: SearchResultItem) => void;
  onFolderClick: (folderId: string) => void;
}

export const SearchList: React.FC<SearchListProps> = ({
  items,
  onBookClick,
  onFolderClick,
}) => {
  const handleClick = (item: SearchResultItem) => {
    if (item.type === "book") {
      onBookClick(item);
    } else if (item.type === "folder") {
      onFolderClick(item.data.id);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 px-4 py-2 text-[10px] uppercase tracking-wider text-gray-400 dark:text-neutral-500 font-medium border-b border-gray-100 dark:border-white/5">
        <span className="w-2" />
        <span className="flex-1">Name</span>
        <span className="hidden sm:block max-w-[200px]">Details</span>
        <span className="hidden md:block w-12 text-right">Type</span>
        <span className="hidden lg:block w-24 text-right">Date</span>
      </div>

      {items.map((item, idx) => (
        <SearchListItem
          key={`${item.type}-${item.data.id}-${idx}`}
          item={item}
          onClick={() => handleClick(item)}
        />
      ))}
    </div>
  );
};
