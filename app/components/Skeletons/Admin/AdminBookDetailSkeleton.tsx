import { Skeleton } from "@/app/components/Layout/Skeleton";

export default function AdminBookDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-12 animate-pulse">
      <Skeleton className="h-3 w-40" />

      <section className="flex flex-col md:flex-row gap-10">
        <Skeleton className="w-48 h-64 rounded-md shrink-0" />

        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-9 w-full max-w-md" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12 border-t border-gray-50 dark:border-neutral-800 pt-10">
        {Array.from({ length: 2 }).map((_, section) => (
          <div key={section} className="space-y-6">
            <Skeleton className="h-3 w-32" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-4 h-4 shrink-0" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 flex-1 max-w-xs" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 pt-10 border-t border-gray-50 dark:border-neutral-800">
        <Skeleton className="h-3 w-36" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
