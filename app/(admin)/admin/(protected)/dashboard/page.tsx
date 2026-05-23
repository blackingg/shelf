"use client";

import { useGetAdminStatsQuery, useGetAuditLogsQuery } from "@/app/services";
import {
  FiUsers,
  FiBook,
  FiFlag,
  FiInbox,
  FiFolder,
  FiSlash,
} from "react-icons/fi";
import { Skeleton } from "@/app/components/Layout/Skeleton";
import AdminAuditLogSkeleton from "@/app/components/Skeletons/Admin/AdminAuditLogSkeleton";
import { ModeratorOverview } from "@/app/components/Admin/ModeratorOverview";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useGetAdminStatsQuery();
  const {
    data: auditLogs,
    isLoading: isGettingAudit,
  } = useGetAuditLogsQuery();

  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: <FiUsers className="text-purple-500" />,
      dotColor: "bg-purple-500",
    },
    {
      label: "Total Books",
      value: stats?.totalBooks ?? 0,
      icon: <FiBook className="text-blue-500" />,
      dotColor: "bg-blue-500",
    },
    {
      label: "Total Folders",
      value: stats?.totalFolders ?? 0,
      icon: <FiFolder className="text-teal-500" />,
      dotColor: "bg-teal-500",
    },
    {
      label: "Unreviewed Flags",
      value: stats?.unreviewedFlags ?? 0,
      icon: <FiFlag className="text-amber-500" />,
      dotColor: "bg-amber-400",
    },
    {
      label: "Pending Books",
      value: stats?.pendingBooks ?? 0,
      icon: <FiInbox className="text-primary" />,
      dotColor: "bg-primary",
    },
    {
      label: "Banned Users",
      value: stats?.bannedUsers ?? 0,
      icon: <FiSlash className="text-red-500" />,
      dotColor: "bg-red-500",
    },
  ];

  const formatAction = (action: string) => {
    return action
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-1">
          Platform Overview
        </h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Real-time metrics and system health.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-800 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="w-5 h-5 rounded" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            ))
          : cards.map((card, i) => (
              <div
                key={i}
                className="p-6 bg-white dark:bg-neutral-900 rounded-md border border-gray-100 dark:border-neutral-800 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-2 h-2 rounded-full ${card.dotColor}`} />
                  <span className="text-lg text-gray-400 dark:text-neutral-500">
                    {card.icon}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-medium text-gray-900 dark:text-white">
                    {card.value.toLocaleString()}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {card.label}
                  </p>
                </div>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ModeratorOverview />

        <section className="p-8 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-6">
            Recent Admin Actions
          </h3>
          <div className="space-y-1">
            {isGettingAudit ? (
              <AdminAuditLogSkeleton />
            ) : auditLogs?.items && auditLogs.items.length > 0 ? (
              auditLogs.items.slice(0, 8).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-neutral-800/50 last:border-0"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {formatAction(log.action)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-500">
                        by @{log.actor?.username || "system"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-neutral-600 shrink-0 ml-4">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-neutral-500 italic">
                No recent actions recorded.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
