"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select, { SingleValue } from "react-select";
import { FiHeart, FiUser, FiBook } from "react-icons/fi";
import { useNotifications } from "@/app/context/NotificationContext";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { PageContainer } from "@/app/components/Layout/PageContainer";
import { Card } from "@/app/components/Layout/Card";
import { StepHeader } from "@/app/components/Onboarding/StepHeader";
import { InterestButton } from "@/app/components/Onboarding/InterestButton";
import { NavigationButtons } from "@/app/components/Onboarding/NavigationButtons";
import {
  useGetSchoolsQuery,
  useGetDepartmentsQuery,
  useGetInterestsQuery,
  useCompleteOnboardingMutation,
} from "@/app/store/api/onboardingApi";
import { useAppDispatch } from "@/app/store/store";
import { setOnboardingStatus } from "@/app/store/authSlice";
import { InterestCategory } from "@/app/types/onboarding";
import * as Icons from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
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
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    schoolId: "",
    departmentId: "",
    interestIds: [],
  });
  const [schoolSearch, setSchoolSearch] = useState("");

  // Restore session data on mount
  useEffect(() => {
    const savedStep = sessionStorage.getItem("onboarding_step");
    const savedData = sessionStorage.getItem("onboarding_data");
    if (savedStep) setCurrentStep(parseInt(savedStep));
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  // Save session data on change
  useEffect(() => {
    sessionStorage.setItem("onboarding_step", currentStep.toString());
    sessionStorage.setItem("onboarding_data", JSON.stringify(formData));
  }, [currentStep, formData]);

  const steps = ["School", "Department", "Interests"];

  // API Hooks
  const { data: schools = [], isLoading: isLoadingSchools } =
    useGetSchoolsQuery(schoolSearch);
  const { data: departments = [], isLoading: isLoadingDepartments } =
    useGetDepartmentsQuery(formData.schoolId, { skip: !formData.schoolId });
  const { data: interestsResponse, isLoading: isLoadingInterests } =
    useGetInterestsQuery();
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

  const canProceed = (): boolean => {
    if (currentStep === 0) return formData.schoolId !== "";
    if (currentStep === 1) return formData.departmentId !== "";
    if (currentStep === 2) return formData.interestIds.length >= 3;
    return false;
  };

  const handleFinish = async (): Promise<void> => {
    try {
      await completeOnboarding({
        schoolId: formData.schoolId,
        departmentId: formData.departmentId,
        interestIds: formData.interestIds,
      }).unwrap();

      dispatch(setOnboardingStatus(true));
      sessionStorage.removeItem("onboarding_step");
      sessionStorage.removeItem("onboarding_data");
      addNotification(
        "success",
        "Welcome to Shelf! Your profile is now set up."
      );
      router.push("/app/library");
    } catch (error: any) {
      console.error("Onboarding failed:", error);
      addNotification("error", getErrorMessage(error, "Failed to complete onboarding. Please try again."));
    }
  };

  const handleNext = () => {
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
    setFormData((prev) => ({
      ...prev,
      interestIds: prev.interestIds.includes(interestId)
        ? prev.interestIds.filter((id) => id !== interestId)
        : [...prev.interestIds, interestId],
    }));
  };

  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return <FiHeart />;
    // Simple mapping logic if icons are strings from API
    const FiIcon = (Icons as any)[iconName];
    const FaIcon = (FaIcons as any)[iconName];
    return FiIcon ? <FiIcon /> : FaIcon ? <FaIcon /> : <FiHeart />;
  };

  return (
    <>
      <AppHeader
        rightContent={
          <p className="text-sm text-gray-800">
            Step {currentStep + 1} of {steps.length}
          </p>
        }
      />

      <PageContainer>
        <div className="max-w-lg w-full">
          <Card>
            <StepHeader
              icon={
                currentStep === 0 ? (
                  <FiUser className="w-7 h-7 text-emerald-700" />
                ) : currentStep === 1 ? (
                  <FiBook className="w-7 h-7 text-emerald-700" />
                ) : (
                  <FiHeart className="w-7 h-7 text-emerald-700" />
                )
              }
              title={
                currentStep === 0
                  ? "Which school do you attend?"
                  : currentStep === 1
                  ? "What's your department?"
                  : "What interests you?"
              }
              description={
                currentStep === 0
                  ? "We'll personalize your content based on your school."
                  : currentStep === 1
                  ? "Helps us recommend books and resources for your field."
                  : "Choose at least 3 to personalize your experience."
              }
            />

            {/* Step 1: School */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <label className="text-gray-800 font-medium">
                  Search your school
                </label>
                <Select<OptionType, false>
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
                      (opt) => opt.value === formData.schoolId
                    ) || null
                  }
                  placeholder="Start typing school name..."
                  classNamePrefix="react-select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "0.75rem",
                      borderColor: "#d1d5db",
                      padding: "2px",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#059669" },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#d1fae5"
                        : state.isFocused
                        ? "#ecfdf5"
                        : "white",
                      color: "#111827",
                    }),
                  }}
                />
              </div>
            )}

            {/* Step 2: Department */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <label className="text-gray-800 font-medium">
                  Search your department
                </label>
                <Select<OptionType, false>
                  options={departmentOptions}
                  isLoading={isLoadingDepartments}
                  onChange={(opt) =>
                    setFormData({ ...formData, departmentId: opt?.value || "" })
                  }
                  value={
                    departmentOptions.find(
                      (opt) => opt.value === formData.departmentId
                    ) || null
                  }
                  placeholder="Type to search..."
                  classNamePrefix="react-select"
                  isDisabled={!formData.schoolId}
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "0.75rem",
                      borderColor: "#d1d5db",
                      padding: "2px",
                      boxShadow: "none",
                      "&:hover": { borderColor: "#059669" },
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#d1fae5"
                        : state.isFocused
                        ? "#ecfdf5"
                        : "white",
                      color: "#111827",
                    }),
                  }}
                />
                {!formData.schoolId && (
                  <p className="text-sm text-gray-500">
                    Please select a school first
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Interests */}
            {currentStep === 2 && (
              <div className="space-y-5 max-h-80 overflow-y-auto">
                {isLoadingInterests ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700"></div>
                  </div>
                ) : (
                  interestsResponse &&
                  Object.entries(interestsResponse).map(([category, list]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        {category}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {list.map((interest) => (
                          <InterestButton
                            key={interest.id}
                            name={interest.name}
                            icon={getIconComponent(interest.icon)}
                            isSelected={formData.interestIds.includes(
                              interest.id
                            )}
                            onClick={() => toggleInterest(interest.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <NavigationButtons
              onBack={handleBack}
              onNext={handleNext}
              canGoBack={currentStep > 0}
              canProceed={canProceed()}
              isLastStep={currentStep === steps.length - 1}
              isLoading={isSubmitting}
            />
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
