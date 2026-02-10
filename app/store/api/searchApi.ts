import { baseApi } from "./baseApi";
import { SearchResponse, SearchParams } from "../../types/search";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, SearchParams>({
      query: (params) => ({
        url: "/search",
        params: params || undefined,
      }),
      providesTags: ["Books", "Folders"],
    }),
  }),
});

export const { useSearchQuery } = searchApi;
