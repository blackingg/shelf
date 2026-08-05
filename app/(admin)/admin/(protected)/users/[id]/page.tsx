"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiClock,
  FiMail,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useGetAdminUserByIdQuery } from "@/app/services";
import {
  UserActionModals,
  UserActionType,
} from "@/app/components/Admin/UserActionModals";
import AdminUserDetailSkeleton from "@/app/components/Skeletons/Admin/AdminUserDetailSkeleton";

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const { data: user, isLoading } = useGetAdminUserByIdQuery(id);
  const [actionType, setActionType] = useState<UserActionType | null>(null);

  if (isLoading) {
    return <AdminUserDetailSkeleton />;
  }

  if (!user) {
    return (
      <div className="p-12 text-center text-sm text-red-500">
        User not found.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <UserActionModals
        user={user}
        actionType={actionType}
        onClose={() => setActionType(null)}
        onDeleted={() => router.push("/admin/users")}
      />

      <button
        onClick={() => router.push("/admin/users")}
        className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-gray-400 hover:text-primary transition-colors"
      >
        <FiArrowLeft />
        Back to Users
      </button>

      <section className="flex flex-col md:flex-row gap-8">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-2xl shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
              <FiShield />
              <span>User Account</span>
            </div>
            <h1 className="text-3xl font-medium text-foreground">
              {user.fullName}
            </h1>
            <p className="text-lg text-muted">
              @{user.username}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user.isBanned ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-red-50 dark:bg-red-500/10 text-danger border border-red-100 dark:border-red-500/20">
                Banned
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                Active
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 border border-gray-100 dark:border-neutral-700 capitalize">
              {user.role.toLowerCase().replace("_", " ")}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() =>
                setActionType(user.isBanned ? "unban" : "ban")
              }
              className="px-5 py-2 text-xs font-medium uppercase tracking-widest rounded-md border border-line-subtle text-gray-700 dark:text-neutral-300 hover:bg-wash transition-colors"
            >
              {user.isBanned ? "Unban" : "Ban"}
            </button>
            <button
              onClick={() => setActionType("assign")}
              className="px-5 py-2 text-xs font-medium uppercase tracking-widest rounded-md border border-line-subtle text-gray-700 dark:text-neutral-300 hover:bg-wash transition-colors"
            >
              Assign Role
            </button>
            <button
              onClick={() => setActionType("delete")}
              className="px-5 py-2 text-xs font-medium uppercase tracking-widest rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Delete
            </button>
            <Link
              href={`/profile/${user.username}`}
              className="px-5 py-2 text-xs font-medium uppercase tracking-widest rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors"
            >
              View Public Profile
            </Link>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-12 border-t border-gray-50 dark:border-neutral-800 pt-10">
        <div className="space-y-6">
          <h3 className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Account Details
          </h3>
          <div className="space-y-4">
            <MetaItem label="Email" value={user.email} icon={<FiMail />} />
            <MetaItem
              label="Onboarding"
              value={user.onboardingCompleted ? "Completed" : "Incomplete"}
              icon={<FiUser />}
            />
            <MetaItem
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString()}
              icon={<FiClock />}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xs font-medium uppercase tracking-widest text-gray-400">
            Moderation
          </h3>
          <div className="space-y-4">
            <MetaItem label="User ID" value={user.id} icon={<FiUser />} />
            {user.isBanned && (
              <>
                <MetaItem
                  label="Banned At"
                  value={
                    user.bannedAt
                      ? new Date(user.bannedAt).toLocaleString()
                      : "-"
                  }
                  icon={<FiClock />}
                />
                <MetaItem
                  label="Ban Reason"
                  value={user.bannedReason || "-"}
                  icon={<FiShield />}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-faint">{icon}</span>
      <span className="text-gray-500 dark:text-neutral-500 font-medium w-28">
        {label}:
      </span>
      <span className="text-foreground font-mono text-[11px] break-all">
        {value}
      </span>
    </div>
  );
}
