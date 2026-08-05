import { Skeleton } from "@/app/components/Layout/Skeleton";

export default function AdminUserDetailSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <Skeleton className="h-3 w-28" />

      <section className="flex flex-col md:flex-row gap-8">
        <Skeleton className="w-20 h-20 rounded-full shrink-0" />

        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-64 max-w-full" />
            <Skeleton className="h-5 w-40" />
          </div>

          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-7 w-16 rounded" />
            <Skeleton className="h-7 w-24 rounded" />
          </div>

          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-md" />
            ))}
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12 border-t border-gray-50 dark:border-neutral-800 pt-10">
        {Array.from({ length: 2 }).map((_, section) => (
          <div key={section} className="space-y-6">
            <Skeleton className="h-3 w-32" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
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
    </div>
  );
}
