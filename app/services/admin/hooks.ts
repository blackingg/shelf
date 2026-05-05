import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { PaginatedResponse } from "../../types/common";
import { UserRole } from "../../types/user";
import {
  AdminUserResponse,
  PlatformStatsResponse,
  AuditLogEntry,
  AdminListUsersParams,
  AdminAuditLogParams,
} from "../../types/admin";

export const adminKeys = {
  all: ["admin"] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
  users: (params: AdminListUsersParams) => [...adminKeys.all, "users", params] as const,
  auditLogs: (params: AdminAuditLogParams) => [...adminKeys.all, "audit-logs", params] as const,
};

export const useGetAdminStatsQuery = () => {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => api.get<PlatformStatsResponse>("/admin/stats"),
  });
};

export const useGetAdminUsersQuery = (params: AdminListUsersParams = {}) => {
  return useQuery({
    queryKey: adminKeys.users(params),
    queryFn: () => api.get<PaginatedResponse<AdminUserResponse>>("/admin/users", { params }),
  });
};

export const useGetAuditLogsQuery = (params: AdminAuditLogParams = {}) => {
  return useQuery({
    queryKey: adminKeys.auditLogs(params),
    queryFn: () => api.get<PaginatedResponse<AuditLogEntry>>("/admin/audit-log", { params }),
  });
};

export const useAdminActions = () => {
  const queryClient = useQueryClient();

  const assignRole = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      api.patch(`/admin/users/${userId}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.users({}) }),
  });

  const banUser = useMutation({
    mutationFn: ({
      userId,
      reason,
      permanent,
    }: {
      userId: string;
      reason: string;
      permanent?: boolean;
    }) => api.post(`/admin/users/${userId}/ban`, { reason, permanent }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.users({}) }),
  });

  const unbanUser = useMutation({
    mutationFn: (userId: string) => api.post(`/admin/users/${userId}/unban`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.users({}) }),
  });

  const deleteUser = useMutation({
    mutationFn: (userId: string) => api.delete(`/admin/users/${userId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.users({}) }),
  });

  return {
    assignRole: assignRole.mutateAsync,
    banUser: banUser.mutateAsync,
    unbanUser: unbanUser.mutateAsync,
    deleteUser: deleteUser.mutateAsync,
    isAssigning: assignRole.isPending,
    isBanning: banUser.isPending,
    isUnbanning: unbanUser.isPending,
    isDeleting: deleteUser.isPending,
  };
};

export const useAdmin = () => {
  const { data: stats, isLoading: isLoadingStats } = useGetAdminStatsQuery();

  return {
    stats,
    isLoading: isLoadingStats,
  };
};
