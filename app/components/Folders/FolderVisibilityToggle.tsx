"use client";
import { FiLock, FiGlobe, FiBookmark } from "react-icons/fi";

interface FolderVisibilityToggleProps {
  activeTab: "private" | "public" | "bookmarked";
  onTabChange: (tab: "private" | "public" | "bookmarked") => void;
}

export const FolderVisibilityToggle: React.FC<FolderVisibilityToggleProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="inline-flex bg-gray-100 rounded-xl p-1">
      <button
        onClick={() => onTabChange("private")}
        className={`flex items-center text-sm md:text-lg space-x-2 px-4 md:px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
          activeTab === "private"
            ? "bg-white text-gray-800 shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <FiLock className="w-4 h-4" />
        <span>My Folders</span>
      </button>
      <button
        onClick={() => onTabChange("public")}
        className={`flex items-center text-sm md:text-lg space-x-2 px-4 md:px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
          activeTab === "public"
            ? "bg-white text-emerald-600 shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <FiGlobe className="w-4 h-4" />
        <span>Explore Public</span>
      </button>
      <button
        onClick={() => onTabChange("bookmarked")}
        className={`flex items-center text-sm md:text-lg space-x-2 px-4 md:px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
          activeTab === "bookmarked"
            ? "bg-white text-emerald-600 shadow-sm"
            : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <FiBookmark className="w-4 h-4" />
        <span>Bookmarked</span>
      </button>
    </div>
  );
};
