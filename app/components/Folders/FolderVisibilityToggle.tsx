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
  activeClass: string;
}[] = [
  {
    id: "private",
    label: "My Folders",
    icon: FiLock,
    activeClass: "text-gray-800",
  },
  {
    id: "public",
    label: "Explore Public",
    icon: FiGlobe,
    activeClass: "text-emerald-600",
  },
  {
    id: "bookmarked",
    label: "Bookmarked",
    icon: FiBookmark,
    activeClass: "text-emerald-600",
  },
];

export const FolderVisibilityToggle: React.FC<FolderVisibilityToggleProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="inline-flex bg-gray-100 rounded-xl p-1">
      {tabs.map(({ id, label, icon: Icon, activeClass }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center space-x-2 px-4 md:px-6 py-2.5 rounded-lg 
              text-sm md:text-lg font-semibold transition-all duration-200
              ${
                isActive
                  ? `bg-white shadow-sm ${activeClass}`
                  : "text-gray-500 hover:text-gray-900"
              }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
