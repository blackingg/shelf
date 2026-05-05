"use client";

export default function FolderDetailSkeleton({
  hideHeader,
}: {
  hideHeader?: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900 animate-pulse">
      <div className="p-4 md:p-8 space-y-6">
        {/* Back button skeleton */}
        {!hideHeader && (
          <div className="h-6 bg-gray-100 dark:bg-neutral-800 rounded w-16" />
        )}

        <div className="space-y-6 md:space-y-10">
          {/* Header section */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
              {/* Folder icon skeleton */}
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 dark:bg-neutral-800 rounded-2xl flex-shrink-0" />

              <div className="space-y-4">
                {/* Title skeleton */}
                <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded-lg w-64" />

                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 dark:bg-neutral-800/50 rounded w-96 max-w-full" />
                  <div className="h-4 bg-gray-100 dark:bg-neutral-800/50 rounded w-72 max-w-full" />
                </div>

                {/* Meta info skeleton */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="h-5 bg-gray-100 dark:bg-neutral-800/50 rounded w-20" />
                  <div className="h-5 bg-gray-100 dark:bg-neutral-800/50 rounded w-32" />
                  <div className="h-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-full w-16" />
                </div>
              </div>
            </div>

            {/* Menu button skeleton */}
            <div className="h-10 w-10 bg-gray-100 dark:bg-neutral-800 rounded-lg self-end lg:self-start" />
          </div>

          {/* Books table skeleton */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-neutral-800">
              <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded w-32" />
            </div>

            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-4 flex items-center gap-4"
                >
                  {/* Book cover */}
                  <div className="w-12 h-16 bg-gray-200 dark:bg-neutral-800 rounded flex-shrink-0" />

                  {/* Book info */}
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded w-48" />
                    <div className="h-4 bg-gray-100 dark:bg-neutral-800/50 rounded w-32" />
                  </div>

                  {/* Category badge */}
                  <div className="h-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-full w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
