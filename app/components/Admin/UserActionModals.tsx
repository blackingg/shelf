"use client";

import { useEffect, useState } from "react";
import { ConfirmModal } from "@/app/components/Shared/ConfirmModal";
import { useAdminActions, useUser } from "@/app/services";
import { AdminUserResponse } from "@/app/types/admin";
import { UserRole } from "@/app/types/user";

export type UserActionType = "ban" | "unban" | "delete" | "assign";

const roleTypes: UserRole[] = ["USER", "MODERATOR", "ADMIN", "SUPER_ADMIN"];

interface UserActionModalsProps {
  user: AdminUserResponse | null;
  actionType: UserActionType | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export function UserActionModals({
  user,
  actionType,
  onClose,
  onDeleted,
}: UserActionModalsProps) {
  const {
    isAssigning,
    isBanning,
    isDeleting,
    isUnbanning,
    banUser,
    deleteUser,
    assignRole,
    unbanUser,
  } = useAdminActions();
  const { me } = useUser();
  const isSuperAdmin = me?.role === "SUPER_ADMIN";

  const [roleState, setRoleState] = useState<UserRole>("USER");
  const [banPermanent, setBanPermanent] = useState(true);
  const [banReason, setBanReason] = useState("");

  useEffect(() => {
    if (user) {
      setRoleState(user.role);
      setBanPermanent(true);
      setBanReason("");
    }
  }, [user, actionType]);

  if (!user || !actionType) return null;

  const handleSuccess = () => {
    onClose();
  };

  const handleBan = async () => {
    try {
      await banUser({
        userId: user.id,
        reason: banReason,
        permanent: banPermanent,
      });
      handleSuccess();
    } catch {}
  };

  const handleUnban = async () => {
    try {
      await unbanUser(user.id);
      handleSuccess();
    } catch {}
  };

  const handleDelete = async () => {
    if (!isSuperAdmin) return;
    try {
      await deleteUser(user.id);
      handleSuccess();
      onDeleted?.();
    } catch {}
  };

  const handleAssignRole = async () => {
    try {
      await assignRole({ userId: user.id, role: roleState });
      handleSuccess();
    } catch {}
  };

  return (
    <>
      <ConfirmModal
        isOpen={actionType === "ban"}
        onClose={onClose}
        onConfirm={handleBan}
        isLoading={isBanning}
        isDanger
        title="Ban User"
        confirmText="Confirm Ban"
        message={
          <div className="space-y-4">
            <p>
              You are about to ban{" "}
              <span className="font-medium text-foreground">
                @{user.username}
              </span>
              . Proceed with caution.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 dark:text-neutral-500 uppercase tracking-wider block">
                Reason for Ban
              </label>
              <input
                type="text"
                placeholder="Enter ban reason..."
                value={banReason}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-md text-sm focus:outline-none focus:border-primary/50 transition-colors text-foreground"
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 dark:text-neutral-500 uppercase tracking-wider block">
                Ban Duration
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-neutral-300">
                  <input
                    type="radio"
                    name="banType"
                    checked={!banPermanent}
                    onChange={() => setBanPermanent(false)}
                    className="accent-primary"
                  />
                  Temporary
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 dark:text-neutral-300">
                  <input
                    type="radio"
                    name="banType"
                    checked={banPermanent}
                    onChange={() => setBanPermanent(true)}
                    className="accent-primary"
                  />
                  Permanent
                </label>
              </div>
            </div>
          </div>
        }
      />

      <ConfirmModal
        isOpen={actionType === "unban"}
        onClose={onClose}
        onConfirm={handleUnban}
        isLoading={isUnbanning}
        title="Unban User"
        confirmText="Confirm Unban"
        message={
          <p>
            Are you sure you want to unban{" "}
            <span className="font-medium text-foreground">
              @{user.username}
            </span>
            ? They will regain access to the platform.
          </p>
        }
      />

      <ConfirmModal
        isOpen={actionType === "assign"}
        onClose={onClose}
        onConfirm={handleAssignRole}
        isLoading={isAssigning}
        title="Assign Role"
        confirmText="Confirm Role"
        message={
          <div className="space-y-4">
            <p>
              Select a new role for{" "}
              <span className="font-medium text-foreground">
                @{user.username}
              </span>
              .
            </p>
            <div className="grid grid-cols-2 gap-2">
              {roleTypes.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setRoleState(role)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    roleState === role
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-line-subtle text-muted hover:bg-wash"
                  }`}
                >
                  {role.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <ConfirmModal
        isOpen={actionType === "delete"}
        onClose={onClose}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        isDanger
        title="Delete User"
        confirmText="Confirm Delete"
        message={
          <div className="space-y-3">
            <p>
              You are about to permanently delete{" "}
              <span className="font-medium text-foreground">
                @{user.username}
              </span>
              . All associated data will be removed.
            </p>
            {!isSuperAdmin && (
              <p className="text-xs text-red-500 font-medium">
                Only Super Admins can delete user accounts.
              </p>
            )}
          </div>
        }
      />
    </>
  );
}
