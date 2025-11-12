"use client";
import { FiBell, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import { SearchBar } from "./SearchBar";

interface PageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => (
  <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
    <div className="flex items-center justify-between">
      <SearchBar
        value={searchQuery}
        onChange={onSearchChange}
      />
      <div className="flex items-center space-x-4 ml-6">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiBell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center space-x-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
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
      </div>
    </div>
  </header>
);
