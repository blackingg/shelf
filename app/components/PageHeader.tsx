"use client";
import React from "react";
import { SearchBar } from "./SearchBar";
import { NotificationPanel } from "./Notification/NotificationPanel";
import { UserProfileDropdown } from "./UserProfileDropdown";

interface PageHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-neutral-800 px-4 lg:px-8 py-4 sticky top-0 z-30 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
        />
        <div className="flex items-center lg:space-x-4 space-x-2">
          <NotificationPanel />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};
