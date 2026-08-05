"use client";

import Link from "next/link";
import {
  FiArrowRight,
  FiBook,
  FiFlag,
  FiFolder,
  FiInbox,
} from "react-icons/fi";
import {
  useGetAdminStatsQuery,
  useGetFlaggedContentQuery,
  useGetPendingBooksQuery,
} from "@/app/services";
import { Skeleton } from "@/app/components/Layout/Skeleton";
import { PlatformStatsResponse } from "@/app/types/admin";

function ProgressRow({
  label,
  value,
  total,
  accentClass,
}: {
  label: string;
  value: number;
  total: number;
  accentClass: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-foreground tabular-nums">
          {value.toLocaleString()}
          {total > 0 && (
            <span className="text-faint font-normal">
              {" "}
              / {total.toLocaleString()}
            </span>
          )}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${accentClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatLink({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 rounded-md border border-line-subtle hover:bg-wash/50 transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-faint group-hover:text-primary transition-colors">
          {icon}
        </span>
        <span className="text-sm text-gray-700 dark:text-neutral-300">
          {label}
        </span>
      </div>
      <span className="text-sm font-medium text-foreground tabular-nums">
        {value.toLocaleString()}
      </span>
    </Link>
  );
}

function ModeratorOverviewContent({ stats }: { stats: PlatformStatsResponse }) {
  const { data: flaggedBooks } = useGetFlaggedContentQuery("books", {
    reviewed: false,
    limit: 1,
  });
  const { data: flaggedFolders } = useGetFlaggedContentQuery("folders", {
    reviewed: false,
    limit: 1,
  });
  const { data: pendingData, isLoading: isPendingLoading } =
    useGetPendingBooksQuery({ limit: 3 });

  const pendingBooks = pendingData?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <ProgressRow
          label="Unreviewed flags"
          value={stats.unreviewedFlags}
          total={stats.totalFlags}
          accentClass="bg-amber-500"
        />
        <ProgressRow
          label="Pending book reviews"
          value={stats.pendingBooks}
          total={stats.totalBooks}
          accentClass="bg-primary"
        />
      </div>

      <div className="space-y-2">
        <StatLink
          href="/moderator/flags"
          icon={<FiFlag className="w-4 h-4" />}
          label="Flagged books"
          value={flaggedBooks?.total ?? 0}
        />
        <StatLink
          href="/moderator/flags"
          icon={<FiFolder className="w-4 h-4" />}
          label="Flagged folders"
          value={flaggedFolders?.total ?? 0}
        />
        <StatLink
          href="/moderator/pending"
          icon={<FiInbox className="w-4 h-4" />}
          label="Pending approvals"
          value={stats.pendingBooks}
        />
      </div>

      {isPendingLoading ? (
        <div className="space-y-2 pt-2 border-t border-gray-50 dark:border-neutral-800">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      ) : pendingBooks.length > 0 ? (
        <div className="pt-4 border-t border-gray-50 dark:border-neutral-800 space-y-2">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
            Awaiting review
          </p>
          {pendingBooks.map((book) => (
            <Link
              key={book.id}
              href={`/moderator/books/${book.id}`}
              className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors truncate"
            >
              <FiBook className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{book.title}</span>
            </Link>
          ))}
        </div>
      ) : null}

      <Link
        href="/moderator"
        className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary hover:opacity-80 transition-opacity"
      >
        Open Moderator Center
        <FiArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export function ModeratorOverview() {
  const { data: stats, isLoading } = useGetAdminStatsQuery();

  return (
    <section className="p-8 bg-background border border-line-subtle rounded-md h-full flex flex-col">
      <h3 className="text-sm font-medium text-foreground uppercase tracking-wider mb-6">
        Moderator Overview
      </h3>

      {isLoading || !stats ? (
        <div className="space-y-6 animate-pulse flex-1">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </div>
      ) : (
        <ModeratorOverviewContent stats={stats} />
      )}
    </section>
  );
}
