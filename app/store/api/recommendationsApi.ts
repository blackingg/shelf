import { baseApi } from "./baseApi";
import { RecommendationsCombinedResponse } from "../../types/recommendations";

export const recommendationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendationsCombined: builder.query<RecommendationsCombinedResponse, void>({
      query: () => "/recommendations/combined",
      providesTags: ["Books", "Folders"],
    }),
    getBooksByCategory: builder.query<any, string>({
      query: (slug) => `/recommendations/discover`,
      providesTags: ["Books"],
    }),
  }),
});

export const {
  useGetRecommendationsCombinedQuery,
  useGetBooksByCategoryQuery,
} = recommendationsApi;
