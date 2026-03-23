import { baseApi } from "./baseApi";
import { SearchResponse, SearchParams } from "../../types/search";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    search: builder.query<SearchResponse, SearchParams>({
      query: (params) => {
        const { pageSize, limit, ...rest } = params;

        return {
          url: "/search",
          params: {
            ...rest,
            ...(limit || pageSize ? { limit: limit ?? pageSize } : {}),
          },
        };
      },
      providesTags: ["Books", "Folders"],
    }),
  }),
});

export const { useSearchQuery } = searchApi;
