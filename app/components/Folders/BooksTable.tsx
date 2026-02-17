import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  FiMoreVertical,
  FiFile,
  FiBookOpen,
  FiTrash2,
  FiInfo,
} from "react-icons/fi";
import { Book } from "@/app/types/book";

interface BooksTableProps {
  books: Book[];
  onBookClick: (id: string) => void;
  folderId?: string;
  onRemoveBook?: (bookId: string) => void;
  canEdit?: boolean;
}

const BooksTable = ({
  books,
  onBookClick,
  folderId,
  onRemoveBook,
  canEdit = false,
}: BooksTableProps) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-white/5">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5">
              <th className="px-6 py-4 text-left text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                Resource
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                Author
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                Category
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                Department
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                Pages
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {books.map((book) => (
              <tr
                key={book.id}
                onClick={() => onBookClick(book.id)}
                className="hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-10 bg-emerald-50 dark:bg-emerald-900/10 rounded-sm flex-shrink-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/20 dark:border-emerald-500/10">
                      <FiFile className="w-4 h-4" />
                    </div>
                    <div className="max-w-[200px]">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {book.title}
                      </div>
                      <div className="text-[10px] text-gray-400 dark:text-neutral-500 truncate mt-0.5">
                        {book.description || "No description available"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[13px] text-gray-600 dark:text-neutral-400">
                    {book.author}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[11px] text-gray-500 dark:text-neutral-500 uppercase tracking-tight">
                    {book.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-[11px] text-gray-500 dark:text-neutral-500 uppercase tracking-tight">
                    {book.department?.replace(/-/g, " ") || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-[13px] text-gray-600 dark:text-neutral-400">
                    {book.pages}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(
                        activeMenuId === book.id ? null : book.id,
                      );
                    }}
                    className="p-1.5 hover:bg-white dark:hover:bg-neutral-800 rounded-md transition-colors text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 border border-transparent hover:border-gray-100 dark:hover:border-white/10"
                  >
                    <FiMoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === book.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-10 w-48 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/10 rounded-md py-1.5 z-[100] text-left shadow-none"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onBookClick(book.id)}
                        className="w-full px-4 py-2 text-[12px] text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center space-x-2 transition-colors"
                      >
                        <FiBookOpen className="w-3.5 h-3.5" />
                        <span>Read Book</span>
                      </button>
                      <Link
                        href={`/app/books/${book.slug}`}
                        className="w-full px-4 py-2 text-[12px] text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center space-x-2 transition-colors"
                      >
                        <FiInfo className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </Link>
                      {canEdit && onRemoveBook && (
                        <>
                          <div className="border-t border-gray-50 dark:border-white/5 my-1" />
                          <button
                            onClick={() => {
                              onRemoveBook(book.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-4 py-2 text-[12px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center space-x-2 transition-colors"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                            <span>Remove from Folder</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BooksTable;
