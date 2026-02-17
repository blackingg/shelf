export default function BookDetailSkeleton() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-900 overflow-y-auto">
      <div className="flex-1 flex flex-col">
        <div className="max-w-6xl mx-auto px-6 py-16 w-full grid lg:grid-cols-3 gap-16 animate-pulse">

          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <div className="h-3 w-20 bg-gray-100 dark:bg-neutral-800 rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded-md" />
                <div className="h-4 w-full bg-gray-100 dark:bg-neutral-800 rounded-md" />
                <div className="h-4 w-2/3 bg-gray-100 dark:bg-neutral-800 rounded-md" />
              </div>
            </div>
            <div className="bg-gray-50/50 dark:bg-neutral-800/30 p-8 rounded-lg border border-gray-100 dark:border-neutral-800 space-y-8">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-700 rounded-md" />
                <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-700 rounded-md" />
              </div>
              <div className="space-y-4">
                <div className="h-20 w-full bg-gray-200/50 dark:bg-neutral-700/50 rounded-md" />
                <div className="h-20 w-full bg-gray-200/50 dark:bg-neutral-700/50 rounded-md" />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="h-64 bg-gray-50 dark:bg-neutral-800/50 rounded-lg border border-gray-100 dark:border-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
