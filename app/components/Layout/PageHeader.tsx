"use client";
import React, { Suspense } from "react";
import { SearchBar } from "../Search/SearchBar";
import { NotificationPanel } from "../Notification/NotificationPanel";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { useUser } from "@/app/services";

interface PageHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const { isAuthenticated } = useUser();

  return (
    <header className="lg:bg-surface lg:border-b lg:border-line px-4 lg:px-8 safe-area-top sticky top-0 z-30 transition-colors duration-200">
      <div className="flex items-center py-2 lg:py-4">
        <Suspense
          fallback={
            <div className="hidden lg:block w-96 lg:w-160 h-[50px] bg-inset border border-line rounded-xl" />
          }
        >
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
          />
        </Suspense>

        <div className="flex items-center lg:space-x-4 ml-auto">
          {isAuthenticated && <NotificationPanel />}
          <div className="hidden lg:block">
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};
