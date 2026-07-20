"use client";

import { useState } from "react";
import { useGetBooksQuery } from "@/app/services";
import {
  FiSearch,
  FiBook,
  FiExternalLink,
  FiMoreHorizontal,
} from "react-icons/fi";
import Link from "next/link";
import { Pagination } from "@/app/components/Library/Pagination";
import AdminTableSkeleton from "@/app/components/Skeletons/Admin/AdminTableSkeleton";

export default function AdminResourcesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const { data: booksData, isLoading } = useGetBooksQuery({
    q: search || undefined,
    page,
    limit: 10,
  });

  const books = booksData?.items;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-medium text-foreground mb-1">
          Global Resources Directory
        </h2>
        <p className="text-sm text-muted">
          Oversee and manage all books and documents across the platform.
        </p>
      </section>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources by title, author, or ID..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-background border border-line-subtle rounded-md text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-background border border-line-subtle rounded-md overflow-hidden flex flex-col">
        {isLoading ? (
          <AdminTableSkeleton rows={10} />
        ) : books?.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FiBook className="mx-auto text-3xl text-gray-200 dark:text-neutral-800" />
            <p className="text-sm text-muted font-medium">
              No resources found in the directory.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-neutral-800/50">
                    <th className="px-6 py-4 font-medium text-faint uppercase text-[10px] tracking-widest">
                      Resource
                    </th>
                    <th className="px-6 py-4 font-medium text-faint uppercase text-[10px] tracking-widest">
                      Category
                    </th>
                    <th className="px-6 py-4 font-medium text-faint uppercase text-[10px] tracking-widest">
                      Donor
                    </th>
                    <th className="px-6 py-4 font-medium text-faint uppercase text-[10px] tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/30">
                  {books?.map((book) => (
                    <tr
                      key={book.id}
                      className="group hover:bg-wash/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-14 bg-gray-50 dark:bg-neutral-800 border border-line-subtle rounded-sm overflow-hidden shrink-0">
                            <img
                              src={book.coverImage || "/dummycover.png"}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">
                              {book.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-neutral-500">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-gray-50 dark:bg-neutral-800 text-muted border border-gray-100 dark:border-neutral-700 rounded-sm text-[10px] uppercase font-medium tracking-wider">
                          {book.category || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-600 dark:text-neutral-300">
                          @{book.donor?.username || "anonymous"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Link
                            href={`/admin/books/${book.id}`}
                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                            title="System Details"
                          >
                            <FiExternalLink />
                          </Link>
                          <button className="p-2 text-faint hover:text-gray-900 dark:hover:text-white transition-colors">
                            <FiMoreHorizontal />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {booksData && booksData.totalPages > 1 && (
              <div className="border-t border-line-subtle bg-gray-50/30 dark:bg-neutral-900/30 px-6">
                <Pagination
                  currentPage={page}
                  totalPages={booksData.totalPages}
                  onPageChange={(p) => setPage(p)}
                  isLoading={isLoading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
