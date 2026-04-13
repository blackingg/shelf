import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { Folder, CreateFolderRequest, Collaborator } from "../../types/folder";
import { PaginatedResponse } from "../../types/common";
import { useNotifications } from "../../context/NotificationContext";

export const folderKeys = {
  all: ["folders"] as const,
  me: (params: any) => [...folderKeys.all, "me", params] as const,
  public: (params: any) => [...folderKeys.all, "public", params] as const,
  detail: (id: string) => [...folderKeys.all, "detail", id] as const,
  slug: (slug: string) => [...folderKeys.all, "slug", slug] as const,
  user: (username: string, params: any) => ["user", username, "folders", params] as const,
  collaborators: (id: string) => [...folderKeys.detail(id), "collaborators"] as const,
};

export const useGetMeFoldersQuery = (params: any) => {
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: folderKeys.me(params),
    queryFn: () => api.get<PaginatedResponse<Folder>>("/folders/me", { params }),
    placeholderData: keepPreviousData,
  });
};

export const useGetPublicFoldersQuery = (params: any) => {
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: folderKeys.public(params),
    queryFn: () => api.get<PaginatedResponse<Folder>>("/folders/public", { params }),
    placeholderData: keepPreviousData,
  });
};

export const useGetUserFoldersQuery = (params: { username: string; page?: number; limit?: number }) => {
  const { username, ...queryParams } = params;
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: folderKeys.user(username, queryParams),
    queryFn: () => api.get<PaginatedResponse<Folder>>(`/users/${username}/folders`, { params: queryParams }),
    enabled: !!username,
  });
};

export const useGetFolderBySlugQuery = (slug: string) => {
  return useQuery<Folder>({
    queryKey: folderKeys.slug(slug),
    queryFn: () => api.get<Folder>(`/folders/slug/${slug}`),
    enabled: !!slug,
  });
};

export const useCreateFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFolderRequest) => api.post<Folder>("/folders/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

export const useAddBookToFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, bookId }: { folderId: string; bookId: string }) =>
      api.post(`/folders/${folderId}/books`, { bookId }),
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.detail(folderId) });
    },
  });
};

export const useRemoveBookFromFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bookId }: { id: string; bookId: string }) =>
      api.delete(`/folders/${id}/books/${bookId}`),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.detail(id) });
    },
  });
};

export const useUploadFolderCoverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      api.post<Folder>(`/folders/${id}/cover`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.detail(id) });
    },
  });
};

export const useUpdateFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateFolderRequest> }) =>
      api.patch<Folder>(`/folders/${id}/`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      queryClient.invalidateQueries({ queryKey: folderKeys.detail(id) });
    },
  });
};

export const useDeleteFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/folders/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

export const useGetCollaboratorsQuery = (id: string) => {
  return useQuery<Collaborator[]>({
    queryKey: folderKeys.collaborators(id),
    queryFn: () => api.get<Collaborator[]>(`/collaboration/folders/${id}/collaborators`),
    enabled: !!id,
  });
};

export const useInviteCollaboratorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { userId: string; role: string } }) =>
      api.post(`/collaboration/folders/${id}/invite`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.collaborators(id) });
    },
  });
};

export const useRemoveCollaboratorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, collaboratorId }: { folderId: string; collaboratorId: string }) =>
      api.delete(`/collaboration/folders/${folderId}/collaborators/${collaboratorId}`),
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.collaborators(folderId) });
    },
  });
};

export const useUpdateCollaborationSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { allowCollaboration: boolean; requireApproval: boolean } }) =>
      api.patch(`/folders/${id}/collaboration`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.detail(id) });
    },
  });
};

export const useMeFolders = (params: any = {}) => {
  const { data, isLoading, isFetching, isError, error } = useGetMeFoldersQuery(params);
  
  return {
    folders: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    isError,
    error,
  };
};

export const useUserFolders = (params: { username: string; page?: number; limit?: number }) => {
  const { data, isLoading, isFetching, isError, error } = useGetUserFoldersQuery(params);
  
  return {
    folders: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    isError,
    error,
  };
};

export const useFolderBySlug = (slug: string) => {
  const { data: folder, isLoading, isError, error } = useGetFolderBySlugQuery(slug);
  return { folder, isLoading, isError, error };
};

export const useFolders = (params: any = {}) => {
  const { data, isLoading, isFetching, isError, error, isPlaceholderData } = useGetPublicFoldersQuery(params);
  
  return {
    folders: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error,
  };
};

export const useCollaborators = (id: string) => {
  const { data: collaborators = [], isLoading, isError, error } = useGetCollaboratorsQuery(id);
  return { collaborators, isLoading, isError, error };
};

export const useFolderActions = () => {
  const { addNotification } = useNotifications();
  const createMutation = useCreateFolderMutation();
  const updateMutation = useUpdateFolderMutation();
  const deleteMutation = useDeleteFolderMutation();
  const addBookMutation = useAddBookToFolderMutation();
  const removeBookMutation = useRemoveBookFromFolderMutation();
  const uploadCoverMutation = useUploadFolderCoverMutation();
  const inviteMutation = useInviteCollaboratorMutation();
  const uninviteMutation = useRemoveCollaboratorMutation();
  const settingsMutation = useUpdateCollaborationSettingsMutation();

  const createFolder = async (data: CreateFolderRequest) => {
    try {
      await createMutation.mutateAsync(data);
      addNotification("success", "Folder created successfully");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to create folder");
    }
  };

  const updateFolder = async (id: string, data: Partial<CreateFolderRequest>) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      addNotification("success", "Folder updated successfully");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to update folder");
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      addNotification("success", "Folder deleted successfully");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to delete folder");
    }
  };

  const addBookToFolder = async (folderId: string, bookId: string) => {
    try {
      await addBookMutation.mutateAsync({ folderId, bookId });
      addNotification("success", "Book added to folder");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to add book");
    }
  };

  const removeBookFromFolder = async (folderId: string, bookId: string) => {
    try {
      await removeBookMutation.mutateAsync({ id: folderId, bookId });
      addNotification("success", "Book removed from folder");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to remove book");
    }
  };

  const uploadCover = async (folderId: string, data: FormData) => {
    try {
      await uploadCoverMutation.mutateAsync({ id: folderId, data });
      addNotification("success", "Cover updated successfully");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to update cover");
    }
  };

  const inviteCollaborator = async (id: string, userId: string, role: string) => {
    try {
      await inviteMutation.mutateAsync({ id, data: { userId, role } });
      addNotification("success", "Collaborator invited");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to invite collaborator");
    }
  };

  const removeCollaborator = async (folderId: string, collaboratorId: string) => {
    try {
      await uninviteMutation.mutateAsync({ folderId, collaboratorId });
      addNotification("success", "Collaborator removed");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to remove collaborator");
    }
  };

  const updateSettings = async (id: string, data: { allowCollaboration: boolean; requireApproval: boolean }) => {
    try {
      await settingsMutation.mutateAsync({ id, data });
      addNotification("success", "Settings updated");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to update settings");
      throw err; // Re-throw for local rollback if needed
    }
  };

  return {
    actions: {
      createFolder,
      updateFolder,
      deleteFolder,
      addBookToFolder,
      removeBookFromFolder,
      uploadCover,
      inviteCollaborator,
      removeCollaborator,
      updateSettings,
    },
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAdding: addBookMutation.isPending,
    isRemoving: removeBookMutation.isPending,
    isUploadingCover: uploadCoverMutation.isPending,
    isInviting: inviteMutation.isPending,
    isUninviting: uninviteMutation.isPending,
    isUpdatingSettings: settingsMutation.isPending,
  };
};
