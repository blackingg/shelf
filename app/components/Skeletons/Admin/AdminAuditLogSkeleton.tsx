import { Skeleton } from "@/app/components/Layout/Skeleton";

export default function AdminAuditLogSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-neutral-800/50 last:border-0"
        >
          <div className="flex items-center space-x-3 flex-1">
            <Skeleton className="w-1.5 h-1.5 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-3 w-10 shrink-0" />
        </div>
      ))}
    </div>
  );
}
