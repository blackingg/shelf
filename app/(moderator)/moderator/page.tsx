"use client";

import { useGetAdminStatsQuery } from "@/app/services";
import { FiFlag, FiInbox, FiBookOpen, FiFolder } from "react-icons/fi";

export default function ModeratorDashboard() {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  const cards = [
    {
      label: "Pending Books",
      value: stats?.pendingBooks ?? 0,
      icon: <FiInbox className="text-blue-500" />,
      dotColor: "bg-blue-500",
      description: "Awaiting approval",
    },
    {
      label: "Unreviewed Flags",
      value: stats?.unreviewedFlags ?? 0,
      icon: <FiFlag className="text-amber-500" />,
      dotColor: "bg-amber-400",
      description: "Needs attention",
    },
    {
      label: "Total Books",
      value: stats?.totalBooks ?? 0,
      icon: <FiBookOpen className="text-emerald-500" />,
      dotColor: "bg-emerald-500",
      description: "On the platform",
    },
    {
      label: "Total Folders",
      value: stats?.totalFolders ?? 0,
      icon: <FiFolder className="text-purple-500" />,
      dotColor: "bg-purple-500",
      description: "Public collections",
    },
  ];

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-medium text-foreground mb-1">
          Dashboard Overview
        </h2>
        <p className="text-sm text-muted">
          Monitor content health and pending actions.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-6 bg-background border border-line-subtle rounded-md transition-colors hover:bg-wash/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-2 h-2 rounded-full ${card.dotColor}`} />
              <span className="text-lg text-faint">
                {card.icon}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-medium text-foreground">
                {isLoading ? "..." : card.value}
              </p>
              <p className="text-sm font-medium text-foreground">
                {card.label}
              </p>
              <p className="text-xs text-muted">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="p-8 bg-background border border-line-subtle rounded-md">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-6">
            Recent Activity
          </h3>
          <div className="space-y-6">
            <p className="text-sm text-muted italic">
              Activity feed coming soon...
            </p>
          </div>
        </section>

        <section className="p-8 bg-background border border-line-subtle rounded-md">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-6">
            Moderation Policy
          </h3>
          <div className="prose prose-sm dark:prose-invert">
            <p className="text-sm text-muted leading-relaxed">
              Ensure all content follows community guidelines. Prioritize "Inappropriate Content" and "Copyright Violations".
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
