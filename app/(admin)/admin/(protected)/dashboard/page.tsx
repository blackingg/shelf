"use client";

import { useGetAdminStatsQuery } from "@/app/services";
import { FiUsers, FiBook, FiFlag, FiInbox } from "react-icons/fi";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  const cards = [
    { 
      label: "Total Users", 
      value: stats?.totalUsers ?? 0, 
      icon: <FiUsers className="text-purple-500" />,
      dotColor: "bg-purple-500"
    },
    { 
      label: "Total Books", 
      value: stats?.totalBooks ?? 0, 
      icon: <FiBook className="text-blue-500" />,
      dotColor: "bg-blue-500"
    },
    { 
      label: "Unreviewed Flags", 
      value: stats?.unreviewedFlags ?? 0, 
      icon: <FiFlag className="text-amber-500" />,
      dotColor: "bg-amber-400"
    },
    { 
      label: "Pending Books", 
      value: stats?.pendingBooks ?? 0, 
      icon: <FiInbox className="text-emerald-500" />,
      dotColor: "bg-emerald-500"
    },
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
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
                {isLoading ? "..." : card.value.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {card.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="p-8 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-6">
            System Performance
          </h3>
          <div className="h-48 flex items-center justify-center text-sm text-gray-400 dark:text-neutral-600 border border-dashed border-gray-100 dark:border-neutral-800 rounded-md">
            Chart Placeholder
          </div>
        </section>
        
        <section className="p-8 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-md">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider mb-6">
            Recent Admin Actions
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-neutral-500 italic">
              Audit log integration coming soon...
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
