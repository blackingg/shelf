import { baseApi } from './baseApi';
import { Folder } from '../../types/folder';

export const bookmarksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    bookmarkBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/books/${id}/bookmark`,
        method: 'POST',
      }),
      invalidatesTags: ['Bookmarks'],
    }),
    unbookmarkBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/books/${id}/bookmark`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookmarks'],
    }),
    getBookmarkedFolders: builder.query<Folder[], void>({
      query: () => '/folders/bookmarked',
      providesTags: ['Bookmarks'],
    }),
    bookmarkFolder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/folders/${id}/bookmark`,
        method: 'POST',
      }),
      invalidatesTags: ['Bookmarks'],
    }),
    unbookmarkFolder: builder.mutation<void, string>({
      query: (id) => ({
        url: `/folders/${id}/bookmark`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bookmarks'],
    }),
  }),
});

export const {
  useBookmarkBookMutation,
  useUnbookmarkBookMutation,
  useGetBookmarkedFoldersQuery,
  useBookmarkFolderMutation,
  useUnbookmarkFolderMutation,
} = bookmarksApi;
