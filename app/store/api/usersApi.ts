import { baseApi } from "./baseApi";
import {
  User,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserPublic,
} from "../../types/user";
import { Book } from "../../types/book";
import { Folder } from "../../types/folder";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "/users/me",
      providesTags: ["User"],
    }),
    updateMe: builder.mutation<User, UpdateUserRequest>({
      query: (data) => ({
        url: "/users/me",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    uploadAvatar: builder.mutation<User, FormData>({
      query: (data) => ({
        url: "/users/me/avatar",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: "/users/me/password",
        method: "POST",
        body: data,
      }),
    }),
    deleteMe: builder.mutation<void, void>({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
    }),
    getUserByUsername: builder.query<UserPublic, string>({
      query: (username) => `/users/${username}`,
    }),
    getUserBooks: builder.query<Book[], string>({
      query: (username) => `/users/${username}/books`,
    }),
    getUserFolders: builder.query<Folder[], string>({
      query: (username) => `/users/${username}/folders`,
      providesTags: ["Folders"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useDeleteMeMutation,
  useGetUserByUsernameQuery,
  useGetUserBooksQuery,
  useGetUserFoldersQuery,
} = usersApi;
