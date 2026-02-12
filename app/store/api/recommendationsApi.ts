import { baseApi } from "./baseApi";
import {
  RecommendationsCombinedResponse,
  DiscoveryFeedResponse,
} from "../../types/recommendations";

export const recommendationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendationsCombined: builder.query<
      RecommendationsCombinedResponse,
      { book_limit?: number; folder_limit?: number } | void
    >({
      query: (params) => ({
        url: "/recommendations/combined",
        params: params || undefined,
      }),
      providesTags: ["Books", "Folders"],
    }),
    getDiscoverFeed: builder.query<
      DiscoveryFeedResponse,
      { page?: number; page_size?: number } | void
    >({
      query: (params) => ({
        url: "/recommendations/discover",
        params: params || undefined,
      }),
      providesTags: ["Books", "Folders"],
    }),
  }),
});

export const { useGetRecommendationsCombinedQuery, useGetDiscoverFeedQuery } =
  recommendationsApi;
