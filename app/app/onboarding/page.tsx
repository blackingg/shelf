"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { FiHeart, FiBook, FiBriefcase } from "react-icons/fi";
import { useNotifications } from "@/app/context/NotificationContext";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { Card } from "@/app/components/Layout/Card";
import { StepHeader } from "@/app/components/Onboarding/StepHeader";
import { Skeleton } from "@/app/components/Layout/Skeleton";
import { InterestButton } from "@/app/components/Onboarding/InterestButton";
import { NavigationButtons } from "@/app/components/Onboarding/NavigationButtons";
import { FormSelect } from "@/app/components/Form/FormSelect";
import { storage } from "@/app/helpers/storage";
import {
  useGetSchoolsQuery,
  useGetOnboardingDepartmentsQuery,
  useGetInterestsQuery,
  useCompleteOnboardingMutation,
} from "@/app/store/api/onboardingApi";
import { useAppDispatch, useAppSelector } from "@/app/store/store";
import { setOnboardingStatus, selectCurrentUser } from "@/app/store/authSlice";
import { getErrorMessage } from "@/app/helpers/error";

interface OptionType {
  value: string;
  label: string;
}

interface FormData {
  schoolId: string;
  departmentId: string;
  interestIds: string[];
}

export default function Onboarding() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const dispatch = useAppDispatch();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    schoolId: "",
    departmentId: "",
    interestIds: [],
  });
  const [schoolSearch, setSchoolSearch] = useState("");

  const user = useAppSelector(selectCurrentUser);

  // Redirect if already completed
  useEffect(() => {
    if (user?.onboardingCompleted) {
      router.replace("/app/discover");
    }
  }, [user, router]);

  // Restore session data on mount
  useEffect(() => {
    const savedStep = storage.get("onboarding_step");
    const savedData = storage.get("onboarding_data");
    if (savedStep) setCurrentStep(parseInt(savedStep));
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  // Save session data on change
  useEffect(() => {
    storage.set("onboarding_step", currentStep.toString());
    storage.set("onboarding_data", JSON.stringify(formData));
  }, [currentStep, formData]);

  const steps = ["School", "Department", "Interests"];

  // API Hooks
  const { data: schools = [], isLoading: isLoadingSchools } =
    useGetSchoolsQuery(schoolSearch);
  const { data: departments = [], isLoading: isLoadingDepartments } =
    useGetOnboardingDepartmentsQuery(formData.schoolId, {
      skip: !formData.schoolId,
    });
  const {
    data: interestsResponse,
    isLoading: isLoadingInterests,
    isError: isInterestError,
    refetch: refetchInterests,
  } = useGetInterestsQuery();
  const [completeOnboarding, { isLoading: isSubmitting }] =
    useCompleteOnboardingMutation();

  const schoolOptions: OptionType[] = schools.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  const departmentOptions: OptionType[] = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  const canProceedResult = useMemo((): boolean => {
    if (currentStep === 0) return formData.schoolId !== "";
    if (currentStep === 1) return formData.departmentId !== "";
    if (currentStep === 2)
      return (
        formData.interestIds.length >= 3 && formData.interestIds.length <= 10
      );
    return false;
  }, [
    currentStep,
    formData.schoolId,
    formData.departmentId,
    formData.interestIds,
  ]);

  const handleFinish = async (): Promise<void> => {
    try {
      await completeOnboarding({
        schoolId: formData.schoolId,
        departmentId: formData.departmentId,
        interestIds: formData.interestIds,
      }).unwrap();

      dispatch(setOnboardingStatus(true));
      storage.remove("onboarding_step");
      storage.remove("onboarding_data");
      addNotification(
        "success",
        "Welcome to Shelf! Your profile is now set up.",
      );
      router.push("/app/discover");
    } catch (error: any) {
      console.error("Onboarding failed:", error);

      // If the user already completed onboarding, just redirect them
      if (user?.onboardingCompleted) {
        dispatch(setOnboardingStatus(true));
        storage.remove("onboarding_step");
        storage.remove("onboarding_data");
        router.push("/app/discover");
        return;
      }

      addNotification(
        "error",
        getErrorMessage(
          error,
          "Failed to complete onboarding. Please try again.",
        ),
      );
    }
  };

  const handleNext = () => {
    if (currentStep === 0 && !formData.schoolId) {
      addNotification("error", "Please select a school to continue");
      return;
    }
    if (currentStep === 1) {
      if (!formData.schoolId) {
        addNotification("error", "Missing school selection. Please go back.");
        return;
      }
      if (!formData.departmentId) {
        addNotification("error", "Please select a department to continue");
        return;
      }
    }
    if (currentStep === 2 && formData.interestIds.length < 3) {
      addNotification("error", "Please select at least 3 interests");
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const toggleInterest = (interestId: string) => {
    setFormData((prev) => {
      const isSelected = prev.interestIds.includes(interestId);
      if (!isSelected && prev.interestIds.length >= 10) {
        addNotification(
          "warning",
          "You can select up to 10 interests maximum.",
        );
        return prev;
      }
      return {
        ...prev,
        interestIds: isSelected
          ? prev.interestIds.filter((id) => id !== interestId)
          : [...prev.interestIds, interestId],
      };
    });
  };

  const getIconComponent = (iconName: string) => {
    return <span className="text-lg">{iconName}</span>;
  };

  const formatCategory = (category: string) => {
    return category
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-onest">
      <AppHeader
        rightContent={
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            Step {currentStep + 1} of {steps.length}
          </p>
        }
      />

      <div className="flex flex-col items-center min-h-[calc(100vh-64px)] px-6 py-12">
        <div className="w-full max-w-[480px]">
          <Card className="p-10">
            <StepHeader
              icon={
                currentStep === 0 ? (
                  <FiBook className="w-6 h-6 text-emerald-600" />
                ) : currentStep === 1 ? (
                  <FiBriefcase className="w-6 h-6 text-emerald-600" />
                ) : (
                  <FiHeart className="w-6 h-6 text-emerald-600" />
                )
              }
              title={
                currentStep === 0
                  ? "Which school?"
                  : currentStep === 1
                    ? "Study field?"
                    : "Interests"
              }
              description={
                currentStep === 0
                  ? "Select your current university or institution"
                  : currentStep === 1
                    ? "What is your major or area of study?"
                    : "Pick 3 to 10 topics to personalize your feed"
              }
            />

            <div className="mt-8">
              {/* Step 1: School */}
              {currentStep === 0 && (
                <FormSelect<OptionType, false>
                  label="Search school"
                  icon={<FiBook />}
                  options={schoolOptions}
                  isLoading={isLoadingSchools}
                  onInputChange={(val) => setSchoolSearch(val)}
                  onChange={(opt) =>
                    setFormData({
                      ...formData,
                      schoolId: opt?.value || "",
                      departmentId: "",
                    })
                  }
                  value={
                    schoolOptions.find(
                      (opt) => opt.value === formData.schoolId,
                    ) || null
                  }
                  placeholder="Enter institution name..."
                />
              )}

              {/* Step 2: Department */}
              {currentStep === 1 && (
                <FormSelect<OptionType, false>
                  label="Department"
                  icon={<FiBriefcase />}
                  options={departmentOptions}
                  isLoading={isLoadingDepartments}
                  onChange={(opt) =>
                    setFormData({ ...formData, departmentId: opt?.value || "" })
                  }
                  value={
                    departmentOptions.find(
                      (opt) => opt.value === formData.departmentId,
                    ) || null
                  }
                  placeholder="Select your department..."
                  isDisabled={!formData.schoolId}
                />
              )}

              {/* Step 3: Interests */}
              {currentStep === 2 && (
                <div className="space-y-6 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingInterests ? (
                    <div className="space-y-8">
                      {[1, 2, 3].map((i) => (
                        <div key={i}>
                          <Skeleton className="h-4 w-24 mb-4" />
                          <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((j) => (
                              <Skeleton
                                key={j}
                                className="h-10 w-full rounded-sm"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isInterestError || !interestsResponse ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-100 dark:border-white/5 rounded-sm">
                      <p className="text-sm text-gray-500 mb-4">
                        Failed to load interests
                      </p>
                      <button
                        onClick={() => refetchInterests()}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium font-onest uppercase tracking-widest"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    Object.entries(interestsResponse).map(
                      ([category, list]) => (
                        <div
                          key={category}
                          className="mb-8 last:mb-0"
                        >
                          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                            {formatCategory(category)}
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {list.map((interest) => (
                              <InterestButton
                                key={interest.id}
                                name={interest.name}
                                icon={getIconComponent(interest.icon)}
                                isSelected={formData.interestIds.includes(
                                  interest.id,
                                )}
                                onClick={() => toggleInterest(interest.id)}
                              />
                            ))}
                          </div>
                        </div>
                      ),
                    )
                  )}
                </div>
              )}
            </div>

            <NavigationButtons
              onBack={handleBack}
              onNext={handleNext}
              canGoBack={currentStep > 0}
              canProceed={canProceedResult}
              isLastStep={currentStep === steps.length - 1}
              isLoading={isSubmitting}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
