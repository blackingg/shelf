import { baseApi } from "./baseApi";
import {
  Folder,
  CreateFolderRequest,
  UpdateFolderRequest,
  AddBookToFolderRequest,
  InviteCollaboratorRequest,
  Invite,
  Collaborator,
  UpdatePermissionsRequest,
  UpdateCollaborationSettingsRequest,
  FolderActivity,
  RecommendedFoldersResponse,
  FolderFilterParams,
} from "../../types/folder";
import { PaginatedResponse } from "../../types/common";

export const foldersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeFolders: builder.query<
      Folder[],
      { include_collaborated?: boolean } | void
    >({
      query: (params) => ({
        url: "/folders/me",
        params: params || { include_collaborated: true },
      }),
      providesTags: ["Folders"],
    }),
    getPublicFolders: builder.query<
      PaginatedResponse<Folder>,
      FolderFilterParams | void
    >({
      query: (params) => ({
        url: "/folders/public",
        params: params || undefined,
      }),
      providesTags: ["Folders"],
    }),
    getRecommendedFolders: builder.query<
      RecommendedFoldersResponse,
      { limit?: number } | void
    >({
      query: (params) => ({
        url: "/folders/recommended",
        params: params || undefined,
      }),
      providesTags: ["Folders"],
    }),
    getFolderById: builder.query<Folder, string>({
      query: (id) => `/folders/${id}`,
      providesTags: (result, error, id) => [{ type: "Folders", id }],
    }),
    getFolderBySlug: builder.query<Folder, string>({
      query: (slug) => `/folders/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Folders", id: slug }],
    }),
    createFolder: builder.mutation<Folder, CreateFolderRequest>({
      query: (data) => ({
        url: "/folders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Folders"],
    }),
    updateFolder: builder.mutation<
      void,
      { id: string; data: UpdateFolderRequest }
    >({
      query: ({ id, data }) => ({
        url: `/folders/${id}`,
        method: "PATCH",
        body: data,
      }),
      // Optimistic update for folder updates
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        // Update the folder in all cached queries optimistically
        const patchResults = [
          dispatch(
            foldersApi.util.updateQueryData("getFolderById", id, (draft) => {
              Object.assign(draft, data);
            }),
          ),
          dispatch(
            foldersApi.util.updateQueryData(
              "getMeFolders",
              undefined,
              (draft) => {
                const folder = draft.find((f) => f.id === id);
                if (folder) Object.assign(folder, data);
              },
            ),
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          // Rollback on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { id }) => [
        "Folders",
        { type: "Folders", id },
      ],
    }),
    deleteFolder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/folders/${id}`,
        method: "DELETE",
      }),
      // Optimistic delete
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          foldersApi.util.updateQueryData(
            "getMeFolders",
            undefined,
            (draft) => {
              const index = draft.findIndex((f) => f.id === id);
              if (index !== -1) draft.splice(index, 1);
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Folders"],
    }),
    addBookToFolder: builder.mutation<
      void,
      { id: string; data: AddBookToFolderRequest }
    >({
      query: ({ id, data }) => ({
        url: `/folders/${id}/books`,
        method: "POST",
        body: data,
      }),
      // Optimistic update - increment book count
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResults = [
          dispatch(
            foldersApi.util.updateQueryData("getFolderById", id, (draft) => {
              draft.booksCount += 1;
            }),
          ),
          dispatch(
            foldersApi.util.updateQueryData(
              "getMeFolders",
              undefined,
              (draft) => {
                const folder = draft.find((f) => f.id === id);
                if (folder) folder.booksCount += 1;
              },
            ),
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Folders", id }],
    }),
    removeBookFromFolder: builder.mutation<
      void,
      { id: string; bookId: string }
    >({
      query: ({ id, bookId }) => ({
        url: `/folders/${id}/books/${bookId}`,
        method: "DELETE",
      }),
      // Optimistic update - decrement book count
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const patchResults = [
          dispatch(
            foldersApi.util.updateQueryData("getFolderById", id, (draft) => {
              draft.booksCount = Math.max(0, draft.booksCount - 1);
            }),
          ),
          dispatch(
            foldersApi.util.updateQueryData(
              "getMeFolders",
              undefined,
              (draft) => {
                const folder = draft.find((f) => f.id === id);
                if (folder)
                  folder.booksCount = Math.max(0, folder.booksCount - 1);
              },
            ),
          ),
        ];
        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Folders", id }],
    }),
    uploadFolderCover: builder.mutation<void, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/folders/${id}/cover`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Folders", id }],
    }),
    updateCollaborationSettings: builder.mutation<
      void,
      { id: string; data: UpdateCollaborationSettingsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/folders/${id}/collaboration`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Folders", id }],
    }),
    // Collaboration
    inviteCollaborator: builder.mutation<
      void,
      { id: string; data: InviteCollaboratorRequest }
    >({
      query: ({ id, data }) => ({
        url: `/collaboration/folders/${id}/invite`,
        method: "POST",
        body: data,
      }),
    }),
    getInvites: builder.query<Invite[], void>({
      query: () => "/collaboration/invites",
    }),
    getCollaborators: builder.query<Collaborator[], string>({
      query: (id) => `/collaboration/folders/${id}/collaborators`,
    }),
    updateCollaboratorPermissions: builder.mutation<
      void,
      { id: string; userId: string; data: UpdatePermissionsRequest }
    >({
      query: ({ id, userId, data }) => ({
        url: `/collaboration/folders/${id}/collaborators/${userId}/permissions`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Folders", id }],
    }),
    respondToInvite: builder.mutation<
      Invite,
      { inviteId: string; accept: boolean }
    >({
      query: ({ inviteId, accept }) => ({
        url: `/collaboration/invites/${inviteId}/respond`,
        method: "POST",
        body: { accept },
      }),
      invalidatesTags: ["Folders"],
    }),
    removeCollaborator: builder.mutation<
      void,
      { folderId: string; collaboratorId: string }
    >({
      query: ({ folderId, collaboratorId }) => ({
        url: `/collaboration/folders/${folderId}/collaborators/${collaboratorId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { folderId }) => [
        { type: "Folders", id: folderId },
      ],
    }),
    getFolderActivity: builder.query<
      FolderActivity[],
      { folderId: string; limit?: number }
    >({
      query: ({ folderId, limit = 50 }) => ({
        url: `/collaboration/folders/${folderId}/activity`,
        params: { limit },
      }),
    }),
    checkPermission: builder.query<
      { hasPermission: boolean },
      { folderId: string; permission: string }
    >({
      query: ({ folderId, permission }) =>
        `/collaboration/folders/${folderId}/check-permission/${permission}`,
    }),
  }),
});

export const {
  useGetMeFoldersQuery,
  useGetPublicFoldersQuery,
  useGetRecommendedFoldersQuery,
  useGetFolderByIdQuery,
  useGetFolderBySlugQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
  useAddBookToFolderMutation,
  useRemoveBookFromFolderMutation,
  useUploadFolderCoverMutation,
  useUpdateCollaborationSettingsMutation,
  useInviteCollaboratorMutation,
  useGetInvitesQuery,
  useGetCollaboratorsQuery,
  useUpdateCollaboratorPermissionsMutation,
  useRespondToInviteMutation,
  useRemoveCollaboratorMutation,
  useGetFolderActivityQuery,
  useCheckPermissionQuery,
} = foldersApi;
