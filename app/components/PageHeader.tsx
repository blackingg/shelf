"use client";
import { SearchBar } from "./SearchBar";
import { NotificationPanel } from "./Notification/NotificationPanel";
import { UserProfileDropdown } from "./UserProfileDropdown";

interface PageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
        />
        <div className="flex items-center space-x-4 ml-6">
          <NotificationPanel />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};
