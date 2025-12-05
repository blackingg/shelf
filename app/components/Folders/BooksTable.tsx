import Link from "next/link";
import {
  FiStar,
  FiBookOpen,
  FiMessageSquare,
  FiMoreVertical,
} from "react-icons/fi";

import { Book } from "@/app/types/book";

interface BooksTableProps {
  books: Book[];
  onBookClick: (id: number) => void;
}

const BooksTable = ({ books, onBookClick }: BooksTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pages
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Readers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reviews
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book: any) => (
              <tr
                key={book.id}
                onClick={() => onBookClick(book.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded flex-shrink-0 shadow-sm"></div>
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {book.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {book.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/app/profile/${book.donatedBy}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    {book.donatedBy}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">
                      {book.rating}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <FiBookOpen className="w-4 h-4" />
                    <span className="text-sm">{book.pages}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {book.readingCount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <FiMessageSquare className="w-4 h-4" />
                    <span className="text-sm">{book.reviews}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle menu action
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <FiMoreVertical className="w-5 h-5 text-gray-400" />
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
