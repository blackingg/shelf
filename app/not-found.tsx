import Link from "next/link";
import { FiBook, FiHome, FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center">
            <FiBook className="w-12 h-12 text-emerald-500 dark:text-emerald-400" />
          </div>
        </div>

        <h1 className="text-7xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-500 dark:text-neutral-400 mb-8 leading-relaxed">
          Oops! The page you&apos;re looking for seems to have wandered off the
          shelf. It might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/app/library"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
          >
            <FiHome className="w-5 h-5" />
            Go to Library
          </Link>
          <Link
            href="/app/search"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-700 dark:text-white font-medium rounded-xl transition-colors"
          >
            <FiSearch className="w-5 h-5" />
            Search Books
          </Link>
        </div>

        <p className="mt-10 text-sm text-gray-400 dark:text-neutral-500">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </main>
  );
}
