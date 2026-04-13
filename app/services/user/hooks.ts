import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { User, UpdateUserRequest, UserPublic } from "../../types/user";
import { Book } from "../../types/book";
import { Folder } from "../../types/folder";
import { PaginatedResponse } from "../../types/common";
import { useNotifications } from "../../context/NotificationContext";
import { useAppDispatch } from "../../store/store";
import { setUser } from "../../store/authSlice";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  byUsername: (username: string) => [...userKeys.all, username] as const,
  books: (username: string) => [...userKeys.byUsername(username), "books"] as const,
  folders: (username: string) => [...userKeys.byUsername(username), "folders"] as const,
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

export const useGetUserBooksQuery = (params: {
  username: string;
  page?: number;
  limit?: number;
}, options?: any) => {
  const { username, ...queryParams } = params;
  return useQuery<PaginatedResponse<Book>>({
    queryKey: [...userKeys.books(username), queryParams],
    queryFn: () => api.get<PaginatedResponse<Book>>(`/users/${username}/books`, { params: queryParams }),
    enabled: !!username && (options?.enabled ?? true),
    ...options,
  });
};

export const useGetUserFoldersQuery = (params: {
  username: string;
  page?: number;
  limit?: number;
}) => {
  const { username, ...queryParams } = params;
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: [...userKeys.folders(username), queryParams],
    queryFn: () => api.get<PaginatedResponse<Folder>>(`/users/${username}/folders`, { params: queryParams }),
    enabled: !!username,
  });
};

export const useUser = () => {
  const { addNotification } = useNotifications();
  const { data: me, isLoading, isFetching } = useGetMeQuery();
  const updateMutation = useUpdateMeMutation();
  const avatarMutation = useUploadAvatarMutation();
  const dispatch = useAppDispatch();

  const updateProfile = async (data: UpdateUserRequest) => {
    try {
      const updatedUser = await updateMutation.mutateAsync(data);
      dispatch(setUser(updatedUser));
      addNotification("success", "Profile updated successfully");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to update profile");
    }
  };

  const uploadAvatar = async (formData: FormData) => {
    try {
      const updatedUser = await avatarMutation.mutateAsync(formData);
      dispatch(setUser(updatedUser));
      addNotification("success", "Avatar updated successfully");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to upload avatar");
    }
  };

  return {
    me: me || null,
    isLoading,
    isFetching,
    actions: {
      updateProfile,
      uploadAvatar,
      isUpdating: updateMutation.isPending,
      isUploading: avatarMutation.isPending,
    },
  };
};

export const useUserByUsername = (username: string) => {
  const { data: user, isLoading, isFetching, error } = useGetUserByUsernameQuery(username);
  
  return {
    user: user || null,
    isLoading,
    isFetching,
    error
  };
};

