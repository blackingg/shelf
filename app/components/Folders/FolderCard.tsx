"use client";
import { FiLock, FiGlobe, FiMoreVertical, FiBook } from "react-icons/fi";
import { useState } from "react";
import Image from "next/image";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
    bookCount: number;
    isPublic: boolean;
    coverImages?: string[];
    createdBy?: string;
  };
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  onClick,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer relative"
    >
      {showActions && (
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm"
          >
            <FiMoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="relative pt-6 sm:pt-8 pb-3 sm:pb-4">
        {folder.coverImages && folder.coverImages.length > 0 && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[85%]">
            {folder.coverImages[1] && (
              <div className="absolute top-1.5 sm:top-2 left-1/2 transform -translate-x-1/2 w-[95%] h-24 sm:h-28 md:h-32 rounded-t-lg shadow-md overflow-hidden border-2 border-white">
                <Image
                  src={folder.coverImages[1]}
                  alt="Book cover"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {folder.coverImages[0] && (
              <div className="relative top-3 sm:top-4 left-1/2 transform -translate-x-1/2 w-full h-24 sm:h-28 md:h-32 rounded-t-lg shadow-lg overflow-hidden border-2 border-white">
                <Image
                  src={folder.coverImages[0]}
                  alt="Book cover"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )}

        <div
          className={`absolute top-0 left-4 sm:left-8 w-20 sm:w-24 h-6 sm:h-8 rounded-t-xl transition-all duration-300 ${
            folder.isPublic
              ? "bg-gradient-to-b from-emerald-400 to-emerald-500 group-hover:from-emerald-500 group-hover:to-emerald-600"
              : "bg-gradient-to-b from-gray-400 to-gray-500 group-hover:from-gray-500 group-hover:to-gray-600"
          }`}
          style={{
            clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div
          className={`relative rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 ${
            folder.isPublic
              ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700"
              : "bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700"
          }`}
          style={{
            minHeight:
              folder.coverImages && folder.coverImages.length > 0
                ? "180px"
                : "140px",
          }}
        >
          <div className="p-4 sm:p-5 md:p-6 flex flex-col justify-end h-full">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
              <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                <h3 className="font-bold text-white text-sm sm:text-base md:text-lg leading-tight pr-2">
                  {folder.name}
                </h3>
                {folder.isPublic ? (
                  <FiGlobe className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 flex-shrink-0" />
                ) : (
                  <FiLock className="w-4 h-4 sm:w-5 sm:h-5 text-white/90 flex-shrink-0" />
                )}
              </div>

              <div className="flex py-3 md:py-0 space-y-3 md:space-y-0 flex-col md:flex-row md:items-center justify-between text-white/90">
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <FiBook className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium">
                    {folder.bookCount}{" "}
                    {folder.bookCount === 1 ? "book" : "books"}
                  </span>
                </div>

                {folder.createdBy && (
                  <span className="text-[10px] sm:text-xs text-white/80 truncate max-w-[100px] sm:max-w-none">
                    by {folder.createdBy}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-xl sm:rounded-2xl pointer-events-none" />
        </div>

        <div
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[95%] h-2 sm:h-3 rounded-b-xl -z-10 ${
            folder.isPublic ? "bg-emerald-800/30" : "bg-gray-800/30"
          }`}
          style={{ filter: "blur(8px)" }}
        />
      </div>
    </div>
  );
};
