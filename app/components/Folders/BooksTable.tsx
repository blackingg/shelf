import Link from "next/link";
import { FiMoreVertical, FiFile } from "react-icons/fi";

import { Book } from "@/app/types/book";

interface BooksTableProps {
  books: Book[];
  onBookClick: (id: string) => void;
}

const BooksTable = ({ books, onBookClick }: BooksTableProps) => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-neutral-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Book List
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pages
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-gray-800">
            {books.map((book) => (
              <tr
                key={book.id}
                onClick={() => onBookClick(book.id)}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg flex-shrink-0 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm group-hover:shadow transition-all">
                      <FiFile className="w-5 h-5" />
                    </div>
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {book.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {book.description || "No description available"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-300 font-medium">
                    {book.author}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 capitalize">
                    {book.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {book.department?.replace(/-/g, " ")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {book.pages}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle menu action
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiMoreVertical className="w-5 h-5" />
                  </button>
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
