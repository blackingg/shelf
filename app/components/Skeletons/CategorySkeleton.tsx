import { BookCardSkeleton } from "@/app/components/Library/BookCard";

export default function CategorySkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">


            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <div className="max-w-3xl flex-1">
                <div className="w-32 h-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-md animate-pulse mb-6" />
                <div className="w-3/4 h-12 bg-gray-100 dark:bg-neutral-900 rounded-md animate-pulse mb-6" />
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-50 dark:bg-neutral-900/50 rounded-md animate-pulse" />
                  <div className="w-2/3 h-4 bg-gray-50 dark:bg-neutral-900/50 rounded-md animate-pulse" />
                </div>
              </div>

              <div className="w-52 h-24 bg-gray-50/50 dark:bg-neutral-900/40 rounded-md border border-gray-100 dark:border-neutral-800/50 animate-pulse" />
            </div>
          </div>

          <div className="flex gap-4 mb-16">
            <div className="w-96 h-12 bg-gray-50 dark:bg-neutral-900/50 rounded-md animate-pulse" />
            <div className="w-40 h-12 bg-gray-50 dark:bg-neutral-900/50 rounded-md animate-pulse" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <BookCardSkeleton count={10} />
          </div>
        </div>
      </main>
    </div>
  );
}
