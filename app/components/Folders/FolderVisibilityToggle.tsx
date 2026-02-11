"use client";
import { FiLock, FiGlobe, FiBookmark } from "react-icons/fi";

type Tab = "private" | "public" | "bookmarked";

interface FolderVisibilityToggleProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "private", label: "My Folders", icon: FiLock },
  { id: "public", label: "Explore Public", icon: FiGlobe },
  { id: "bookmarked", label: "Bookmarked", icon: FiBookmark },
];

export const FolderVisibilityToggle: React.FC<FolderVisibilityToggleProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="inline-flex bg-gray-100 dark:bg-neutral-800 rounded-md p-0.5">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
              isActive
                ? "bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
