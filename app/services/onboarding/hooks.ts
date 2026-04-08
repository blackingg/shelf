import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/fetcher";
import { useNotifications } from "../../context/NotificationContext";

export const onboardingKeys = {
  all: ["onboarding"] as const,
  schools: (search?: string) => [...onboardingKeys.all, "schools", { search }] as const,
  departments: (schoolId: string) => [...onboardingKeys.all, "departments", schoolId] as const,
  interests: () => [...onboardingKeys.all, "interests"] as const,
};

export const useGetSchoolsQuery = (search?: string) => {
  return useQuery<any[]>({
    queryKey: onboardingKeys.schools(search),
    queryFn: () => api.get<any[]>("/onboarding/schools", { params: { q: search } }),
  });
};

export const useGetOnboardingDepartmentsQuery = (schoolId: string) => {
  return useQuery<any[]>({
    queryKey: onboardingKeys.departments(schoolId),
    queryFn: () => api.get<any[]>(`/onboarding/departments/${schoolId}`),
    enabled: !!schoolId,
  });
};

export const useGetInterestsQuery = () => {
  return useQuery<Record<string, any[]>>({
    queryKey: onboardingKeys.interests(),
    queryFn: () => api.get<Record<string, any[]>>("/onboarding/interests"),
  });
};

export const useCompleteOnboardingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post("/onboarding/complete", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};

export const useOnboarding = () => {
  const { addNotification } = useNotifications();
  const completeMutation = useCompleteOnboardingMutation();

  const completeOnboarding = async (data: any) => {
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
