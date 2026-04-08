import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";

export const notificationKeys = {
  all: ["notifications"] as const,
};

export const useGetNotificationsQuery = () => {
  return useQuery<any[]>({
    queryKey: notificationKeys.all,
    queryFn: () => api.get<any[]>("/notifications"),
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.post("/notifications/read-all", {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useUserNotifications = () => {
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  return {
    notifications: notifications || [],
    unreadCount: notifications?.filter((n) => !n.isRead).length || 0,
    isLoading,
    actions: {
      markAsRead: markReadMutation.mutate,
      markAllAsRead: markAllReadMutation.mutate,
    },
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
  };
};
