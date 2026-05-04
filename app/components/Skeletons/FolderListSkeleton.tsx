"use client";

interface FolderListSkeletonProps {
  count?: number;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-neutral-800 last:border-b-0">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-32" />
            <div className="h-3 bg-gray-100 dark:bg-neutral-800/50 rounded w-24" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-100 dark:bg-neutral-800/50 rounded w-16" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-6 bg-gray-100 dark:bg-neutral-800/50 rounded-full w-20" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-100 dark:bg-neutral-800/50 rounded w-24" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="h-8 w-8 bg-gray-100 dark:bg-neutral-800/50 rounded-lg ml-auto" />
      </td>
    </tr>
  );
}

export default function FolderListSkeleton({
  count = 5,
}: FolderListSkeletonProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-sm animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/50 dark:bg-neutral-900/30 border-b border-gray-100 dark:border-neutral-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Folder Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Books
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
            {Array.from({ length: count }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
