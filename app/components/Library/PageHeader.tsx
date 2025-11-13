"use client";
import { useState } from "react";
import { FiBell, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import { SearchBar } from "./SearchBar";
import { NotificationPanel } from "../Notification/NotificationPanel";
import { UserProfileDropdown } from "../UserProfileDropdown";

interface UserNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: "book_saved" | "folder_created" | "system" | "reminder";
}

interface PageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sample notifications data
  const [notifications, setNotifications] = useState<UserNotification[]>([
    {
      id: "1",
      title: "Book Saved",
      message:
        "You saved 'The Great Gatsby' to your 'ENG 203 - American Literature' folder",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      type: "book_saved",
    },
    {
      id: "2",
      title: "Book Saved",
      message:
        "You saved 'Things Fall Apart' to your public folder 'African Classics'",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      type: "book_saved",
    },
    {
      id: "3",
      title: "New Folder Created",
      message: "Folder 'ENG 203 - American Literature' has been created",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      type: "folder_created",
    },
    {
      id: "4",
      title: "Folder Shared",
      message: "Your folder 'POL 302 - Governance & Policy' is now public",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      type: "folder_created",
    },
    {
      id: "5",
      title: "Reading Reminder",
      message: "Time to continue reading 'Atomic Habits",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      type: "reminder",
    },
    {
      id: "6",
      title: "Book Added to Folder",
      message:
        "A new book 'Digital Design and Computer Architecture' was added to 'CPE 310 Group Folder'",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      type: "book_saved",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
        />
        <div className="flex items-center space-x-4 ml-6">
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiBell className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <NotificationPanel
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAll}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden relative">
                <Image
                  src="/avatar.jpg"
                  alt="User"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-gray-900">Balogun</span>
              <FiChevronDown className="w-4 h-4 text-gray-600" />
            </button>
            <UserProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
