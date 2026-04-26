"use client";
import Link from "next/link";
import { FiHome, FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full border border-gray-200 dark:border-neutral-800 rounded-md bg-white dark:bg-neutral-900 px-6 py-10 sm:px-8 sm:py-12">
        <div className="max-w-xl text-left space-y-5">
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>404 page missing</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-medium text-gray-900 dark:text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
            The page you are looking for does not exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/app/discover"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-md text-sm font-medium transition-colors hover:bg-emerald-700"
            >
              <FiHome className="w-4 h-4" />
              Back to Library
            </Link>
            <Link
              href="/app/search"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <FiSearch className="w-4 h-4" />
              Search Library
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
