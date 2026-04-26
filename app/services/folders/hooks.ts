import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import {
  Folder,
  CreateFolderRequest,
  UpdateFolderRequest,
  Collaborator,
  Invite,
  FolderRoles,
  FolderPermission,
  InviteCollaboratorRequest,
  UpdateCollaborationSettingsRequest,
  UpdatePermissionsRequest,
} from "../../types/folder";
import { PaginatedResponse } from "../../types/common";
import { useNotifications } from "../../context/NotificationContext";
import { getErrorMessage } from "../../helpers/error";

export const folderKeys = {
  all: ["folders"] as const,
  me: (params: any) => [...folderKeys.all, "me", params] as const,
  public: (params: any) => [...folderKeys.all, "public", params] as const,
  detail: (id: string) => [...folderKeys.all, "detail", id] as const,
  slug: (slug: string) => [...folderKeys.all, "slug", slug] as const,
  user: (username: string, params: any) =>
    ["user", username, "folders", params] as const,
  collaborators: (id: string) =>
    [...folderKeys.detail(id), "collaborators"] as const,
  invites: (id: string, params?: any) =>
    [...folderKeys.detail(id), "invites", params] as const,
  myInvites: (params?: any) => ["invites", "me", params] as const,
};

export const useGetMeFoldersQuery = (
  params: any,
  options?: { enabled?: boolean },
) => {
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: folderKeys.me(params),
    queryFn: () =>
      api.get<PaginatedResponse<Folder>>("/folders/me", { params }),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
};

export const useGetPublicFoldersQuery = (params: any) => {
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: folderKeys.public(params),
    queryFn: () =>
      api.get<PaginatedResponse<Folder>>("/folders/public", { params }),
    placeholderData: keepPreviousData,
  });
};

export const useGetUserFoldersQuery = (params: {
  username: string;
  page?: number;
  limit?: number;
}) => {
  const { username, ...queryParams } = params;
  return useQuery<PaginatedResponse<Folder>>({
    queryKey: folderKeys.user(username, queryParams),
    queryFn: () =>
      api.get<PaginatedResponse<Folder>>(`/users/${username}/folders`, {
        params: queryParams,
      }),
    enabled: !!username,
  });
};

export const useGetFolderBySlugQuery = (slug: string) => {
  return useQuery<Folder>({
    queryKey: folderKeys.slug(slug),
    queryFn: () => api.get<Folder>(`/folders/slug/${slug}`),
    enabled: !!slug,
    placeholderData: keepPreviousData,
  });
};

export const useCreateFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFolderRequest) =>
      api.post<Folder>("/folders/", data),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

export const useRemoveBookFromFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bookId }: { id: string; bookId: string }) =>
      api.delete(`/folders/${id}/books/${bookId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

export const useUploadFolderCoverMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      api.post<Folder>(`/folders/${id}/cover`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

export const useUpdateFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderRequest }) =>
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
    queryFn: () =>
      api.get<Collaborator[]>(`/collaboration/folders/${id}/collaborators`),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
};

export const useInviteCollaboratorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: InviteCollaboratorRequest;
    }) => api.post(`/collaboration/folders/${id}/invite`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

export const useRemoveCollaboratorMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      folderId,
      collaboratorId,
    }: {
      folderId: string;
      collaboratorId: string;
    }) =>
      api.delete(
        `/collaboration/folders/${folderId}/collaborators/${collaboratorId}`,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

export const useGetFolderInvitesQuery = (
  id: string,
  params?: { status?: string },
) => {
  return useQuery<any[]>({
    queryKey: folderKeys.invites(id, params),
    queryFn: () =>
      api.get<any[]>(`/collaboration/folders/${id}/invites`, { params }),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
};

export const useGetMyInvitesQuery = (params?: { status?: string }) => {
  return useQuery<Invite[]>({
    queryKey: folderKeys.myInvites(params),
    queryFn: () => api.get<Invite[]>("/collaboration/invites", { params }),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });
};

export const useRespondToInviteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ inviteId, accept }: { inviteId: string; accept: boolean }) =>
      api.post(`/collaboration/invites/${inviteId}/respond`, { accept }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      queryClient.invalidateQueries({ queryKey: folderKeys.myInvites() });
    },
  });
};

export const useUpdateCollaborationSettingsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCollaborationSettingsRequest;
    }) => api.patch(`/folders/${id}/collaboration`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

export const useUpdatePermissionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      folderId,
      collaboratorId,
      data,
    }: {
      folderId: string;
      collaboratorId: string;
      data: UpdatePermissionsRequest;
    }) =>
      api.patch(
        `/collaboration/folders/${folderId}/collaborators/${collaboratorId}/permissions`,
        data,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
    },
  });
};

export const useMeFolders = (params: any = {}) => {
  const { enabled, ...queryParams } = params || {};
  const { data, isLoading, isFetching, isError, error } = useGetMeFoldersQuery(
    queryParams,
    { enabled: enabled ?? true },
  );

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

export const useUserFolders = (params: {
  username: string;
  page?: number;
  limit?: number;
}) => {
  const { data, isLoading, isFetching, isError, error } =
    useGetUserFoldersQuery(params);

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
  const {
    data: folder,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetFolderBySlugQuery(slug);
  return { folder, isLoading, isFetching, isError, error };
};

export const useFolders = (params: any = {}) => {
  const { data, isLoading, isFetching, isError, error, isPlaceholderData } =
    useGetPublicFoldersQuery(params);

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
  const {
    data: collaborators = [],
    isLoading,
    isError,
    error,
  } = useGetCollaboratorsQuery(id);
  return { collaborators, isLoading, isError, error };
};

export const useFolderInvites = (id: string, params?: { status?: string }) => {
  const {
    data: invites = [],
    isLoading,
    isError,
    error,
  } = useGetFolderInvitesQuery(id, params);
  return { invites, isLoading, isError, error };
};

export const useMyInvites = (params?: { status?: string }) => {
  const {
    data: invites = [],
    isLoading,
    isError,
    error,
  } = useGetMyInvitesQuery(params);
  const respondMutation = useRespondToInviteMutation();

  const respondToInvite = async (inviteId: string, accept: boolean) => {
    return respondMutation.mutateAsync({ inviteId, accept });
  };

  return {
    invites,
    isLoading,
    isError,
    error,
    actions: {
      respondToInvite,
    },
    isResponding: respondMutation.isPending,
  };
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
  const updatePermissionsMutation = useUpdatePermissionsMutation();

  const createFolder = async (data: CreateFolderRequest) => {
    try {
      const folder = await createMutation.mutateAsync(data);
      addNotification(
        "success",
        "Folder created successfully",
        "Your new folder is ready. Start adding books to organize your library.",
        1200000,
        `/app/folders/${folder.slug}`,
      );
      return folder;
    } catch (err: any) {
      addNotification("error", getErrorMessage(err, "Failed to create folder"));
    }
  };

  const updateFolder = async (
    id: string,
    data: Partial<CreateFolderRequest>,
  ) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      addNotification("success", "Folder updated successfully");
    } catch (err: any) {
      addNotification("error", getErrorMessage(err, "Failed to update folder"));
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      addNotification("success", "Folder deleted successfully");
    } catch (err: any) {
      addNotification("error", getErrorMessage(err, "Failed to delete folder"));
    }
  };

  const addBookToFolder = async (
    folderId: string,
    bookId: string,
    bookTitle?: string,
  ) => {
    try {
      await addBookMutation.mutateAsync({ folderId, bookId });
      addNotification(
        "success",
        "Book added to folder",
        bookTitle
          ? `${bookTitle} was successfully added to your collection.`
          : "The book was successfully added to your collection.",
        1200000,
        `/app/folders/${folderId}`,
      );
    } catch (err: any) {
      addNotification("error", getErrorMessage(err, "Failed to add book"));
    }
  };

  const removeBookFromFolder = async (folderId: string, bookId: string) => {
    try {
      await removeBookMutation.mutateAsync({ id: folderId, bookId });
      addNotification("success", "Book removed from folder");
    } catch (err: any) {
      addNotification("error", getErrorMessage(err, "Failed to remove book"));
    }
  };

  const uploadCover = async (folderId: string, data: FormData) => {
    try {
      await uploadCoverMutation.mutateAsync({ id: folderId, data });
      addNotification("success", "Cover updated successfully");
    } catch (err: any) {
      addNotification("error", getErrorMessage(err, "Failed to update cover"));
    }
  };

  const inviteCollaborator = async (
    id: string,
    userId: string,
    role: Exclude<FolderRoles, "OWNER">,
    permissions?: FolderPermission[],
  ) => {
    try {
      await inviteMutation.mutateAsync({
        id,
        data: { userId, role, permissions },
      });
      addNotification(
        "success",
        "Collaborator invited",
        "An invitation has been sent. They will appear as a collaborator once they accept.",
      );
    } catch (err: any) {
      addNotification(
        "error",
        getErrorMessage(err, "Failed to invite collaborator"),
      );
    }
  };

  const removeCollaborator = async (
    folderId: string,
    collaboratorId: string,
  ) => {
    try {
      await uninviteMutation.mutateAsync({ folderId, collaboratorId });
      addNotification("success", "Collaborator removed");
    } catch (err: any) {
      addNotification(
        "error",
        getErrorMessage(err, "Failed to remove collaborator"),
      );
    }
  };

  const updateSettings = async (
    id: string,
    data: { allowCollaboration: boolean; requireApproval: boolean },
  ) => {
    try {
      await settingsMutation.mutateAsync({ id, data });
    } catch (err: any) {
      addNotification(
        "error",
        getErrorMessage(err, "Failed to update settings"),
      );
      throw err; // Re-throw for local rollback if needed
    }
  };

  const updatePermissions = async (
    folderId: string,
    collaboratorId: string,
    data: UpdatePermissionsRequest,
  ) => {
    try {
      await updatePermissionsMutation.mutateAsync({
        folderId,
        collaboratorId,
        data,
      });
      addNotification("success", "Permissions updated");
    } catch (err: any) {
      addNotification(
        "error",
        getErrorMessage(err, "Failed to update permissions"),
      );
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
      updatePermissions,
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
    isUpdatingPermissions: updatePermissionsMutation.isPending,
  };
};
