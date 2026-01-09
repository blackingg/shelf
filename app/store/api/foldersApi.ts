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
} from "../../types/folder";

export const foldersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeFolders: builder.query<Folder[], void>({
      query: () => "/folders/me",
      providesTags: ["Folders"],
    }),
    getPublicFolders: builder.query<Folder[], void>({
      query: () => "/folders/public",
      providesTags: ["Folders"],
    }),
    getRecommendedFolders: builder.query<Folder[], void>({
      query: () => "/folders/recommended",
      providesTags: ["Folders"],
    }),
    getBookmarkedFolders: builder.query<Folder[], void>({
      query: () => "/folders/bookmarked",
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
      invalidatesTags: (result, error, { id }) => [{ type: "Folders", id }],
    }),
    bookmarkFolder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/folders/${id}/bookmark`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Folders", id },
        "Folders",
      ],
    }),
    unbookmarkFolder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/folders/${id}/bookmark`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Folders", id },
        "Folders",
      ],
    }),
    uploadFolderCover: builder.mutation<void, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/folders/${id}/cover`,
        method: "POST",
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
    }),
  }),
});

export const {
  useGetMeFoldersQuery,
  useGetPublicFoldersQuery,
  useGetRecommendedFoldersQuery,
  useGetBookmarkedFoldersQuery,
  useGetFolderByIdQuery,
  useGetFolderBySlugQuery,
  useCreateFolderMutation,
  useUpdateFolderMutation,
  useDeleteFolderMutation,
  useAddBookToFolderMutation,
  useRemoveBookFromFolderMutation,
  useBookmarkFolderMutation,
  useUnbookmarkFolderMutation,
  useUploadFolderCoverMutation,
  useUpdateCollaborationSettingsMutation,
  useInviteCollaboratorMutation,
  useGetInvitesQuery,
  useGetCollaboratorsQuery,
  useUpdateCollaboratorPermissionsMutation,
} = foldersApi;
