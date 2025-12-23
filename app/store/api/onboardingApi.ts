import { baseApi } from "./baseApi";
import {
  School,
  Department,
  InterestsResponse,
  OnboardingCompleteRequest,
  OnboardingCompleteResponse,
  Interest,
} from "../../types/onboarding";

export const onboardingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchools: builder.query<School[], string>({
      query: (search) => ({
        url: "/onboarding/schools",
        params: { q: search },
      }),
    }),
    getDepartments: builder.query<Department[], string>({
      query: (schoolId) => `/onboarding/departments/${schoolId}`,
    }),
    getInterests: builder.query<InterestsResponse, void>({
      query: () => "/onboarding/interests",
    }),
    completeOnboarding: builder.mutation<
      OnboardingCompleteResponse,
      OnboardingCompleteRequest
    >({
      query: (data) => ({
        url: "/onboarding/complete",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    getMyInterests: builder.query<Interest[], void>({
      query: () => "/onboarding/my-interests",
    }),
    updateInterests: builder.mutation<void, string[]>({
      query: (interestIds) => ({
        url: "/onboarding/interests",
        method: "PUT",
        body: { interestIds },
      }),
    }),
  }),
});

export const {
  useGetSchoolsQuery,
  useLazyGetSchoolsQuery,
  useGetDepartmentsQuery,
  useGetInterestsQuery,
  useCompleteOnboardingMutation,
  useGetMyInterestsQuery,
  useUpdateInterestsMutation,
} = onboardingApi;
