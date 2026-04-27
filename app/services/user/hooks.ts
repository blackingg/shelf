import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { User, UpdateUserRequest, UserPublic } from "../../types/user";
import { Book } from "../../types/book";
import { Folder } from "../../types/folder";
import { PaginatedResponse } from "../../types/common";
import { useNotifications } from "../../context/NotificationContext";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  selectIsAuthenticated,
  selectIsHydrated,
} from "../../store/authSlice";
import { getErrorMessage } from "../../helpers/error";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  byUsername: (username: string) => [...userKeys.all, username] as const,
  books: (username: string) =>
    [...userKeys.byUsername(username), "books"] as const,
  folders: (username: string) =>
    [...userKeys.byUsername(username), "folders"] as const,
};

export const useGetMeQuery = (options?: { enabled?: boolean }) => {
  return useQuery<User>({
    queryKey: userKeys.me(),
    queryFn: () => api.get<User>("/users/me"),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 minutes — user profile rarely changes mid-session
    gcTime: 30 * 60 * 1000,
  });
};

export const useUpdateMeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => api.patch<User>("/users/me", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => api.post<User>("/users/me/avatar", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: any) => api.post("/users/me/password", data),
  });
};

export const useDeleteMeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete("/users/me"),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useGetUserByUsernameQuery = (username: string, options?: any) => {
  return useQuery<UserPublic>({
    queryKey: userKeys.byUsername(username),
    queryFn: () => api.get<UserPublic>(`/users/${username}`),
    enabled: !!username,
    ...options,
  });
};

export const useUser = (options?: { enabled?: boolean }) => {
  const { addNotification } = useNotifications();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isHydrated = useAppSelector(selectIsHydrated);

  const {
    data: me,
    isLoading,
    isFetching,
    error,
  } = useGetMeQuery({
    enabled: options?.enabled ?? (isAuthenticated && isHydrated),
  });

  const updateMutation = useUpdateMeMutation();
  const avatarMutation = useUploadAvatarMutation();

  const updateProfile = async (data: UpdateUserRequest) => {
    try {
      await updateMutation.mutateAsync(data);
      addNotification("success", "Profile updated successfully");
    } catch (err: any) {
      addNotification(
        "error",
        getErrorMessage(err, "Failed to update profile"),
      );
    }
  };

  const uploadAvatar = async (formData: FormData) => {
    try {
      await avatarMutation.mutateAsync(formData);
      addNotification("success", "Avatar updated successfully");
    } catch (err: any) {
      addNotification(
        "error",
        getErrorMessage(err, "Failed to upload avatar"),
      );
    }
  };

  return {
    me: me || null,
    isLoading: isLoading || !isHydrated,
    isFetching,
    error,
    isAuthenticated,
    isHydrated,
    actions: {
      updateProfile,
      uploadAvatar,
      isUpdating: updateMutation.isPending,
      isUploading: avatarMutation.isPending,
    },
  };
};

export const useUserByUsername = (username: string) => {
  const {
    data: user,
    isLoading,
    isFetching,
    error,
  } = useGetUserByUsernameQuery(username);

  return {
    user: user || null,
    isLoading,
    isFetching,
    error,
  };
};
