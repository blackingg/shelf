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
      // Optimistic update for folder updates
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        // Update the folder in all cached queries optimistically
        const patchResults = [
          dispatch(
            foldersApi.util.updateQueryData("getFolderById", id, (draft) => {
              Object.assign(draft, data);
            })
          ),
          dispatch(
            foldersApi.util.updateQueryData(
              "getMeFolders",
              undefined,
              (draft) => {
                const folder = draft.find((f) => f.id === id);
                if (folder) Object.assign(folder, data);
              }
            )
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
            }
          )
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
            })
          ),
          dispatch(
            foldersApi.util.updateQueryData(
              "getMeFolders",
              undefined,
              (draft) => {
                const folder = draft.find((f) => f.id === id);
                if (folder) folder.booksCount += 1;
              }
            )
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
            })
          ),
          dispatch(
            foldersApi.util.updateQueryData(
              "getMeFolders",
              undefined,
              (draft) => {
                const folder = draft.find((f) => f.id === id);
                if (folder)
                  folder.booksCount = Math.max(0, folder.booksCount - 1);
              }
            )
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
    bookmarkFolder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/folders/${id}/bookmark`,
        method: "POST",
      }),
      // Optimistic bookmark - immediately add to bookmarked list
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        // Find the folder from public or recommended folders to add to bookmarks
        const state = getState() as { api: ReturnType<typeof baseApi.reducer> };

        // Try to find folder from various caches
        let folderToBookmark: Folder | undefined;

        const publicFolders = foldersApi.endpoints.getPublicFolders.select()(
          state as never
        );
        const recommendedFolders =
          foldersApi.endpoints.getRecommendedFolders.select()(state as never);
        const folderById = foldersApi.endpoints.getFolderById.select(id)(
          state as never
        );

        folderToBookmark =
          folderById.data ||
          publicFolders.data?.find((f) => f.id === id) ||
          recommendedFolders.data?.find((f) => f.id === id);

        const patchResults = [];

        // Update bookmark count in folder detail
        patchResults.push(
          dispatch(
            foldersApi.util.updateQueryData("getFolderById", id, (draft) => {
              draft.bookmarksCount += 1;
            })
          )
        );

        // Update bookmark count in public folders list
        patchResults.push(
          dispatch(
            foldersApi.util.updateQueryData(
              "getPublicFolders",
              undefined,
              (draft) => {
                const folder = draft.find((f) => f.id === id);
                if (folder) folder.bookmarksCount += 1;
              }
            )
          )
        );

        // Add to bookmarked folders list
        if (folderToBookmark) {
          patchResults.push(
            dispatch(
              foldersApi.util.updateQueryData(
                "getBookmarkedFolders",
                undefined,
                (draft) => {
                  // Avoid duplicates
                  if (!draft.some((f) => f.id === id)) {
                    draft.unshift({
                      ...folderToBookmark!,
                      bookmarksCount: folderToBookmark!.bookmarksCount + 1,
                    });
                  }
                }
              )
            )
          );
        }

        try {
          await queryFulfilled;
        } catch {
          // Rollback all patches on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
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
      // Optimistic unbookmark - immediately remove from bookmarked list
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults = [
          // Update bookmark count in folder detail
          dispatch(
            foldersApi.util.updateQueryData("getFolderById", id, (draft) => {
              draft.bookmarksCount = Math.max(0, draft.bookmarksCount - 1);
            })
          ),
          // Update bookmark count in public folders list
          dispatch(
            foldersApi.util.updateQueryData(
              "getPublicFolders",
              undefined,
              (draft) => {
                const folder = draft.find((f) => f.id === id);
                if (folder)
                  folder.bookmarksCount = Math.max(
                    0,
                    folder.bookmarksCount - 1
                  );
              }
            )
          ),
          // Remove from bookmarked folders list
          dispatch(
            foldersApi.util.updateQueryData(
              "getBookmarkedFolders",
              undefined,
              (draft) => {
                const index = draft.findIndex((f) => f.id === id);
                if (index !== -1) draft.splice(index, 1);
              }
            )
          ),
        ];

        try {
          await queryFulfilled;
        } catch {
          // Rollback all patches on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
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
