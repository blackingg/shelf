import { Skeleton } from "@/app/components/Layout/Skeleton";

interface AdminTableSkeletonProps {
  rows?: number;
}

export default function AdminTableSkeleton({ rows = 8 }: AdminTableSkeletonProps) {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-50 dark:border-neutral-800/50">
            {Array.from({ length: 4 }).map((_, i) => (
              <th key={i} className="px-6 py-4">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-neutral-800/30">
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row}>
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-6 py-4">
                <Skeleton className="h-5 w-14 rounded" />
              </td>
              <td className="px-6 py-4 text-right">
                <Skeleton className="h-8 w-8 rounded-md ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
