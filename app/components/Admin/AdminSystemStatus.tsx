"use client";

import { Skeleton } from "@/app/components/Layout/Skeleton";
import { isHealthOperational, useHealthQuery } from "@/app/services";

export function AdminSystemStatus() {
  const { data, isLoading, isError, isFetching } = useHealthQuery();
  const operational = isHealthOperational(data, isError);

  return (
    <div className="bg-gray-50 dark:bg-neutral-800/50 rounded-md p-4">
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1">
        System Status
      </p>
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${
              operational
                ? "bg-emerald-500 animate-pulse"
                : "bg-red-500"
            } ${isFetching && !isLoading ? "opacity-60" : ""}`}
          />
          <span className="text-xs font-medium text-gray-700 dark:text-neutral-300">
            {operational ? "Operational" : "Unavailable"}
          </span>
        </div>
      )}
    </div>
  );
}
