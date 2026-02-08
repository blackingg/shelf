import { baseApi } from "./baseApi";
import { BookmarkResponse, BookmarkedStatus, Book } from "../../types/book";
import { Folder } from "../../types/folder";
import { PaginatedResponse } from "../../types/common";

export const bookmarksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    bookmarkBook: builder.mutation<BookmarkResponse, string>({
      query: (id) => ({
        url: `/books/${id}/bookmark`,
        method: "POST",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          bookmarksApi.util.updateQueryData(
            "getIsBookBookmarked",
            id,
            (draft) => {
              draft.bookmarked = true;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Bookmarks"],
    }),
    unbookmarkBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/books/${id}/bookmark`,
        method: "DELETE",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          bookmarksApi.util.updateQueryData(
            "getIsBookBookmarked",
            id,
            (draft) => {
              draft.bookmarked = false;
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Bookmarks"],
    }),
    getIsBookBookmarked: builder.query<BookmarkedStatus, string>({
      query: (id) => `/books/${id}/bookmarked`,
      providesTags: (result, error, id) => ["Bookmarks"],
    }),
    getBookmarkedBooks: builder.query<
      PaginatedResponse<Book>,
      { page?: number; pageSize?: number } | void
    >({
      query: (params) => ({
        url: "/bookmarks/books",
        params: params || undefined,
      }),
      providesTags: ["Bookmarks"],
    }),
    getBookmarkedFolders: builder.query<Folder[], void>({
      query: () => "/folders/bookmarked",
      providesTags: ["Bookmarks"],
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

        const publicFolders = (
          baseApi.endpoints as any
        ).getPublicFolders?.select()(state as never);
        const recommendedFolders = (
          baseApi.endpoints as any
        ).getRecommendedFolders?.select()(state as never);
        const folderById = (baseApi.endpoints as any).getFolderById?.select(id)(
          state as never,
        );

        folderToBookmark =
          folderById?.data ||
          publicFolders?.data?.items.find((f: Folder) => f.id === id) ||
          recommendedFolders?.data?.items.find((f: Folder) => f.id === id);

        const patchResults = [];

        // Update bookmark count in folder detail
        if ((baseApi.endpoints as any).getFolderById) {
          patchResults.push(
            dispatch(
              (baseApi.util as any).updateQueryData(
                "getFolderById",
                id,
                (draft: any) => {
                  draft.bookmarksCount += 1;
                },
              ),
            ),
          );
        }

        // Update bookmark count in public folders list
        if ((baseApi.endpoints as any).getPublicFolders) {
          patchResults.push(
            dispatch(
              (baseApi.util as any).updateQueryData(
                "getPublicFolders",
                undefined,
                (draft: any) => {
                  const folder = draft.items.find((f: Folder) => f.id === id);
                  if (folder) folder.bookmarksCount += 1;
                },
              ),
            ),
          );
        }

        // Add to bookmarked folders list
        if (folderToBookmark) {
          patchResults.push(
            dispatch(
              bookmarksApi.util.updateQueryData(
                "getBookmarkedFolders",
                undefined,
                (draft) => {
                  // Avoid duplicates
                  if (!draft.some((f) => f.id === id)) {
                    draft.unshift({
                      ...folderToBookmark!,
                      bookmarksCount:
                        (folderToBookmark!.bookmarksCount || 0) + 1,
                    });
                  }
                },
              ),
            ),
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
        "Bookmarks",
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
            (baseApi.util as any).updateQueryData(
              "getFolderById",
              id,
              (draft: any) => {
                draft.bookmarksCount = Math.max(0, draft.bookmarksCount - 1);
              },
            ),
          ),
          // Update bookmark count in public folders list
          dispatch(
            (baseApi.util as any).updateQueryData(
              "getPublicFolders",
              undefined,
              (draft: any) => {
                const folder = draft.items.find((f: Folder) => f.id === id);
                if (folder)
                  folder.bookmarksCount = Math.max(
                    0,
                    folder.bookmarksCount - 1,
                  );
              },
            ),
          ),
          // Remove from bookmarked folders list
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getBookmarkedFolders",
              undefined,
              (draft) => {
                const index = draft.findIndex((f) => f.id === id);
                if (index !== -1) draft.splice(index, 1);
              },
            ),
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
        "Bookmarks",
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useBookmarkBookMutation,
  useUnbookmarkBookMutation,
  useGetIsBookBookmarkedQuery,
  useGetBookmarkedBooksQuery,
  useGetBookmarkedFoldersQuery,
  useBookmarkFolderMutation,
  useUnbookmarkFolderMutation,
} = bookmarksApi;
