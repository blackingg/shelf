import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { useNotifications } from "../../context/NotificationContext";
import {
  School,
  Department,
  InterestsResponse,
  OnboardingCompleteRequest,
  OnboardingCompleteResponse,
} from "../../types/onboarding";

export const onboardingKeys = {
  all: ["onboarding"] as const,
  schools: (search?: string) => [...onboardingKeys.all, "schools", { search }] as const,
  departments: (schoolId: string) => [...onboardingKeys.all, "departments", schoolId] as const,
  interests: () => [...onboardingKeys.all, "interests"] as const,
};

export const useGetSchoolsQuery = (search?: string) => {
  return useQuery<School[]>({
    queryKey: onboardingKeys.schools(search),
    queryFn: () => api.get<School[]>("/onboarding/schools", { params: { q: search } }),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetOnboardingDepartmentsQuery = (schoolId: string) => {
  return useQuery<Department[]>({
    queryKey: onboardingKeys.departments(schoolId),
    queryFn: () => api.get<Department[]>(`/onboarding/departments/${schoolId}`),
    enabled: !!schoolId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGetInterestsQuery = () => {
  return useQuery<InterestsResponse>({
    queryKey: onboardingKeys.interests(),
    queryFn: () => api.get<InterestsResponse>("/onboarding/interests"),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useCompleteOnboardingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OnboardingCompleteRequest) =>
      api.post<OnboardingCompleteResponse>("/onboarding/complete", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};

export const useOnboarding = () => {
  const { addNotification } = useNotifications();
  const completeMutation = useCompleteOnboardingMutation();

  const completeOnboarding = async (data: OnboardingCompleteRequest) => {
    try {
      await completeMutation.mutateAsync(data);
      addNotification("success", "Onboarding completed! Welcome to Shelf.");
    } catch (err: any) {
      addNotification("error", err.message || "Failed to complete onboarding");
      throw err;
    }
  };

  return {
    actions: {
      completeOnboarding,
    },
    isCompleting: completeMutation.isPending,
  };
};
