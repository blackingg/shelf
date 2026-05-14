"use client";
import React from "react";
import { FolderVisibility } from "@/app/types/folder";
import FolderPublicEmpty from "@/app/assets/icons/folder/folder-public-empty.svg";
import FolderPublicFull from "@/app/assets/icons/folder/folder-public-full.svg";
import FolderPrivateEmpty from "@/app/assets/icons/folder/folder-private-empty.svg";
import FolderPrivateFull from "@/app/assets/icons/folder/folder-private-full.svg";

interface FolderIconProps {
  visibility: FolderVisibility;
  booksCount: number;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const FolderIcon: React.FC<FolderIconProps> = ({
  visibility,
  booksCount,
  className = "",
  width = 278,
  height = 194,
}) => {
  const isPublic = visibility === "PUBLIC";
  const isEmpty = (booksCount || 0) === 0;

  const getIcon = () => {
    if (isPublic) {
      return isEmpty ? FolderPublicEmpty : FolderPublicFull;
    } else {
      return isEmpty ? FolderPrivateEmpty : FolderPrivateFull;
    }
  };

  const Icon = getIcon();

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      <Icon
        width="100%"
        height="100%"
        style={{ display: 'block' }}
        aria-hidden="true"
      />
    </div>
  );
};
