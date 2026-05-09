"use client";
import React from "react";
import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { useFolderBreadcrumbs } from "@/app/services";

interface FolderBreadcrumbsProps {
  folderId: string;
}

export const FolderBreadcrumbs: React.FC<FolderBreadcrumbsProps> = ({
  folderId,
}) => {
  const { breadcrumbs, isLoading } = useFolderBreadcrumbs(folderId);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 h-6 animate-pulse">
        <div className="w-4 h-4 bg-gray-100 dark:bg-neutral-800 rounded" />
        <FiChevronRight className="w-3 h-3 text-gray-300 dark:text-neutral-700" />
        <div className="w-20 h-4 bg-gray-100 dark:bg-neutral-800 rounded" />
      </div>
    );
  }

  return (
    <nav className="flex items-center space-x-1 md:space-x-2 text-[10px] md:text-xs font-medium text-gray-500 dark:text-neutral-500 overflow-x-auto no-scrollbar whitespace-nowrap py-1">
      <Link
        href="/library?tab=folders"
        className="flex items-center hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <FiHome className="mr-1" />
        <span>Library</span>
      </Link>

      {breadcrumbs.map((crumb) => (
        <React.Fragment key={crumb.id}>
          <FiChevronRight className="w-3 h-3 flex-shrink-0 text-gray-300 dark:text-neutral-700" />
          <Link
            href={`/folders/${crumb.slug}`}
            className="hover:text-gray-900 dark:hover:text-white transition-colors max-w-[100px] md:max-w-[200px] truncate"
          >
            {crumb.name}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};
