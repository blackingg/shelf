import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { User, UpdateUserRequest, UserPublic } from "../../types/user";
import { Book } from "../../types/book";
import { Folder } from "../../types/folder";
import { PaginatedResponse } from "../../types/common";
import { useNotifications } from "../../context/NotificationContext";
import { getErrorMessage } from "../../helpers/error";
import { discoverKeys } from "../discover";
import { departmentKeys } from "../departments";
import { bookKeys } from "../books";
import { searchKeys } from "../search";
import Cookies from "js-cookie";

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
  const hasToken = !!Cookies.get("accessToken");
  return useQuery<User>({
    queryKey: userKeys.me(),
    queryFn: () => api.get<User>("/users/me"),
    enabled: options?.enabled ?? hasToken,
    staleTime: 5 * 60 * 1000, // 5 minutes — user profile rarely changes mid-session
    gcTime: 30 * 60 * 1000,
    retry: false,
  });
};

export const useUpdateMeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => api.patch<User>("/users/me", data),
    onSuccess: (updatedUser, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });

      // Invalidate personalized content if department or school changed
      if (variables.schoolId || variables.departmentId) {
        queryClient.invalidateQueries({ queryKey: discoverKeys.all });
        queryClient.invalidateQueries({ queryKey: departmentKeys.all });
        queryClient.invalidateQueries({ queryKey: [bookKeys.recommended] });
        queryClient.invalidateQueries({ queryKey: searchKeys.all });
      }

      // Optionally update the byUsername cache immediately if we have it
      if (updatedUser.username) {
        queryClient.setQueryData(
          userKeys.byUsername(updatedUser.username),
          updatedUser,
        );
      }
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => api.post<User>("/users/me/avatar", data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      // Update byUsername cache immediately to avoid flash of old avatar
      if (updatedUser.username) {
        queryClient.setQueryData(
          userKeys.byUsername(updatedUser.username),
          updatedUser,
        );
      }
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
  const hasToken = !!Cookies.get("accessToken");

  const {
    data: me,
    isLoading,
    isFetching,
    error,
  } = useGetMeQuery({
    enabled: options?.enabled ?? hasToken,
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
      addNotification("error", getErrorMessage(err, "Failed to upload avatar"));
    }
  };

  return {
    me: me || null,
    isLoading,
    isFetching,
    error,
    isAuthenticated: !!me,
    // Hydrated when not loading, OR when we definitely don't have a token (guest)
    isHydrated: !isLoading || !hasToken,
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
