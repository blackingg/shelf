"use client";

import { useState } from "react";
import { useGetBooksQuery } from "@/app/services";
import { FiSearch, FiFilter, FiBook, FiExternalLink, FiMoreHorizontal } from "react-icons/fi";
import Link from "next/link";

export default function AdminResourcesPage() {
  const [search, setSearch] = useState("");
  const { data: booksData, isLoading } = useGetBooksQuery({
    q: search || undefined,
  });

  const books = booksData?.items;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
          Global Resources Directory
        </h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md text-sm focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-gray-500 dark:text-neutral-400">
            Scanning system index...
          </div>
        ) : books?.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FiBook className="mx-auto text-3xl text-gray-200 dark:text-neutral-800" />
            <p className="text-sm text-gray-500 dark:text-neutral-400 font-medium">
              No resources found in the directory.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-50 dark:border-neutral-800/50">
                  <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500 uppercase text-[10px] tracking-widest">Resource</th>
                  <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500 uppercase text-[10px] tracking-widest">Category</th>
                  <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500 uppercase text-[10px] tracking-widest">Donor</th>
                  <th className="px-6 py-4 font-medium text-gray-400 dark:text-neutral-500 uppercase text-[10px] tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/30">
                {books?.map((book) => (
                  <tr key={book.id} className="group hover:bg-gray-50 dark:hover:bg-neutral-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-14 bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800 rounded-sm overflow-hidden flex-shrink-0">
                          <img src={book.coverImage || "/dummycover.png"} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{book.title}</p>
                          <p className="text-xs text-gray-500 dark:text-neutral-500">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-gray-50 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 border border-gray-100 dark:border-neutral-700 rounded-sm text-[10px] uppercase font-bold tracking-tighter">
                        {book.category || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-600 dark:text-neutral-300">@{book.donor?.username || "anonymous"}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link 
                          href={`/admin/books/${book.id}`}
                          className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                          title="System Details"
                        >
                          <FiExternalLink />
                        </Link>
                        <button className="p-2 text-gray-400 dark:text-neutral-600 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <FiMoreHorizontal />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
