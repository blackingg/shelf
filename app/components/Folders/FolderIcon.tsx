import React from "react";
import Image from "next/image";
import { FolderVisibility } from "@/app/types/folder";

interface FolderIconProps {
  visibility: FolderVisibility;
  booksCount: number;
  className?: string;
  width?: number;
  height?: number;
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

  const getImagePath = () => {
    if (isPublic) {
      return isEmpty
        ? "/folder/folder-public-empty.svg"
        : "/folder/folder-public-full.svg";
    } else {
      return isEmpty
        ? "/folder/folder-private-empty.svg"
        : "/folder/folder-private-full.svg";
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Image
        src={getImagePath()}
        alt={`${isPublic ? "Public" : "Private"} folder (${isEmpty ? "empty" : "full"})`}
        width={width}
        height={height}
        className="w-full h-auto"
        priority={width > 200} // Prioritize large icons (cards)
      />
    </div>
  );
};
