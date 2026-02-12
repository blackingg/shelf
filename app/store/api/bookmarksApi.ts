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
              if (draft) draft.bookmarked = true;
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
              if (draft) draft.bookmarked = false;
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
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const state = getState() as { api: ReturnType<typeof baseApi.reducer> };

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

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getIsFolderBookmarked",
              id,
              (draft) => {
                if (draft) draft.bookmarked = true;
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getMeFolders" as any,
              undefined,
              (draft: any) => {
                if (!draft) return;
                const folder = draft.find((f: any) => f.id === id);
                if (folder) folder.bookmarksCount = (folder.bookmarksCount || 0) + 1;
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getPublicFolders" as any,
              undefined,
              (draft: any) => {
                if (!draft?.items) return;
                const folder = draft.items.find((f: any) => f.id === id);
                if (folder) folder.bookmarksCount = (folder.bookmarksCount || 0) + 1;
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getRecommendedFolders" as any,
              undefined,
              (draft: any) => {
                if (!draft?.items) return;
                const folder = draft.items.find((f: any) => f.id === id);
                if (folder) folder.bookmarksCount = (folder.bookmarksCount || 0) + 1;
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getFolderById" as any,
              id,
              (draft: any) => {
                if (draft) draft.bookmarksCount = (draft.bookmarksCount || 0) + 1;
              },
            ),
          ),
        );

        const folderSlug = folderById?.data?.slug;
        if (folderSlug) {
          patchResults.push(
            dispatch(
              bookmarksApi.util.updateQueryData(
                "getFolderBySlug" as any,
                folderSlug,
                (draft: any) => {
                  if (draft) draft.bookmarksCount = (draft.bookmarksCount || 0) + 1;
                },
              ),
            ),
          );
        }


        if (folderToBookmark) {
          patchResults.push(
            dispatch(
              bookmarksApi.util.updateQueryData(
                "getBookmarkedFolders",
                undefined,
                (draft) => {
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
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const state = getState() as { api: ReturnType<typeof baseApi.reducer> };
        const folderById = (baseApi.endpoints as any).getFolderById?.select(id)(
          state as never,
        );
        const folderSlug = folderById?.data?.slug;

        const patchResults = [];

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getIsFolderBookmarked",
              id,
              (draft) => {
                if (draft) draft.bookmarked = false;
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getMeFolders" as any,
              undefined,
              (draft: any) => {
                if (!draft) return;
                const folder = draft.find((f: any) => f.id === id);
                if (folder)
                  folder.bookmarksCount = Math.max(
                    0,
                    (folder.bookmarksCount || 0) - 1,
                  );
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getPublicFolders" as any,
              undefined,
              (draft: any) => {
                if (!draft?.items) return;
                const folder = draft.items.find((f: any) => f.id === id);
                if (folder)
                  folder.bookmarksCount = Math.max(
                    0,
                    (folder.bookmarksCount || 0) - 1,
                  );
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getRecommendedFolders" as any,
              undefined,
              (draft: any) => {
                if (!draft?.items) return;
                const folder = draft.items.find((f: any) => f.id === id);
                if (folder)
                  folder.bookmarksCount = Math.max(
                    0,
                    (folder.bookmarksCount || 0) - 1,
                  );
              },
            ),
          ),
        );

        patchResults.push(
          dispatch(
            bookmarksApi.util.updateQueryData(
              "getFolderById" as any,
              id,
              (draft: any) => {
                if (draft)
                  draft.bookmarksCount = Math.max(
                    0,
                    (draft.bookmarksCount || 0) - 1,
                  );
              },
            ),
          ),
        );

        if (folderSlug) {
          patchResults.push(
            dispatch(
              bookmarksApi.util.updateQueryData(
                "getFolderBySlug" as any,
                folderSlug,
                (draft: any) => {
                  if (draft)
                    draft.bookmarksCount = Math.max(
                      0,
                      (draft.bookmarksCount || 0) - 1,
                    );
                },
              ),
            ),
          );
        }

        patchResults.push(
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
        );

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: "Folders", id },
        "Folders",
        "Bookmarks",
      ],
    }),
    getIsFolderBookmarked: builder.query<{ bookmarked: boolean }, string>({
      query: (id) => `/folders/${id}/bookmarked`,
      providesTags: (result, error, id) => ["Bookmarks"],
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
  useGetIsFolderBookmarkedQuery,
} = bookmarksApi;
