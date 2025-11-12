"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Select, { SingleValue } from "react-select";
import {
  FiHeart,
  FiUser,
  FiBook,
  FiBriefcase,
  FiMusic,
  FiFilm,
  FiCode,
  FiGlobe,
} from "react-icons/fi";
import {
  FaBrain,
  FaBookReader,
  FaRunning,
  FaPaintBrush,
  FaLaptopCode,
  FaCamera,
  FaGamepad,
  FaPodcast,
} from "react-icons/fa";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { PageContainer } from "@/app/components/Layout/PageContainer";
import { Card } from "@/app/components/Layout/Card";
import { StepHeader } from "@/app/components/Onboarding/StepHeader";
import { InterestButton } from "@/app/components/Onboarding/InterestButton";
import { NavigationButtons } from "@/app/components/Onboarding/NavigationButtons";
import { SCHOOLS, getDepartmentsBySchoolId, School } from "@/app/types/schools";

interface OptionType {
  value: string;
  label: string;
}

interface FormData {
  schoolId: string;
  schoolName: string;
  department: string;
  hobbies: string[];
}

interface Hobby {
  name: string;
  icon: React.ReactNode;
  category: string;
}

interface GroupedHobbies {
  [key: string]: Hobby[];
}

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    schoolId: "",
    schoolName: "",
    department: "",
    hobbies: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const steps = ["School", "Department", "Interests"];

  // Generate school options from SCHOOLS data
  const schoolOptions: OptionType[] = SCHOOLS.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  // Generate department options based on selected school
  const departmentOptions: OptionType[] = useMemo(() => {
    if (!formData.schoolId) return [];
    const departments = getDepartmentsBySchoolId(formData.schoolId);
    return departments.map((dept) => ({
      value: dept,
      label: dept,
    }));
  }, [formData.schoolId]);

  const hobbies: Hobby[] = [
    // Academics
    { name: "Research", icon: <FaBrain />, category: "Academics" },
    { name: "AI & Machine Learning", icon: <FiCode />, category: "Academics" },
    { name: "Philosophy", icon: <FiBook />, category: "Academics" },
    { name: "Science & Tech", icon: <FaLaptopCode />, category: "Academics" },
    { name: "Literature", icon: <FaBookReader />, category: "Academics" },

    // Career & Skills
    {
      name: "Entrepreneurship",
      icon: <FiBriefcase />,
      category: "Career & Skills",
    },
    {
      name: "Product Design",
      icon: <FaPaintBrush />,
      category: "Career & Skills",
    },
    { name: "Marketing", icon: <FiGlobe />, category: "Career & Skills" },
    { name: "Finance", icon: <FaBrain />, category: "Career & Skills" },
    { name: "Coding", icon: <FaLaptopCode />, category: "Career & Skills" },

    // Lifestyle
    { name: "Fitness", icon: <FaRunning />, category: "Lifestyle" },
    { name: "Cooking", icon: <FiBook />, category: "Lifestyle" },
    { name: "Travel", icon: <FiGlobe />, category: "Lifestyle" },
    { name: "Fashion", icon: <FaPaintBrush />, category: "Lifestyle" },
    { name: "Wellness", icon: <FiHeart />, category: "Lifestyle" },

    // Creativity
    { name: "Writing", icon: <FaBookReader />, category: "Creativity" },
    { name: "Photography", icon: <FaCamera />, category: "Creativity" },
    { name: "Music", icon: <FiMusic />, category: "Creativity" },
    { name: "Film", icon: <FiFilm />, category: "Creativity" },
    { name: "Art", icon: <FaPaintBrush />, category: "Creativity" },

    // Entertainment
    { name: "Movies", icon: <FiFilm />, category: "Entertainment" },
    { name: "Anime", icon: <FaBrain />, category: "Entertainment" },
    { name: "Gaming", icon: <FaGamepad />, category: "Entertainment" },
    { name: "Podcasts", icon: <FaPodcast />, category: "Entertainment" },

    // Reading
    { name: "Fiction", icon: <FiBook />, category: "Reading" },
    { name: "Self-Help", icon: <FaBookReader />, category: "Reading" },
    { name: "Biography", icon: <FiUser />, category: "Reading" },
    { name: "Poetry", icon: <FaBookReader />, category: "Reading" },
    { name: "Comics", icon: <FaPaintBrush />, category: "Reading" },
  ];

  const groupedHobbies: GroupedHobbies = hobbies.reduce((acc, hobby) => {
    acc[hobby.category] = acc[hobby.category] || [];
    acc[hobby.category].push(hobby);
    return acc;
  }, {} as GroupedHobbies);

  const canProceed = (): boolean => {
    if (currentStep === 0) return formData.schoolId !== "";
    if (currentStep === 1) return formData.department !== "";
    if (currentStep === 2) return formData.hobbies.length >= 3;
    return false;
  };

  const handleFinish = async (): Promise<void> => {
    setIsLoading(true);
    console.log("Onboarding completed:", formData);
    await new Promise((res) => setTimeout(res, 1500));
    router.push("/app/library");
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

  const handleSchoolChange = (option: SingleValue<OptionType>) => {
    const school = SCHOOLS.find((s: School) => s.id === option?.value);
    setFormData({
      ...formData,
      schoolId: option?.value || "",
      schoolName: school?.name || "",
      department: "",
    });
  };

  const toggleHobby = (hobbyName: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobbyName)
        ? prev.hobbies.filter((h) => h !== hobbyName)
        : [...prev.hobbies, hobbyName],
    }));
  };

  const getStepIcon = () => {
    if (currentStep === 0)
      return <FiUser className="w-7 h-7 text-emerald-700" />;
    if (currentStep === 1)
      return <FiBook className="w-7 h-7 text-emerald-700" />;
    return <FiHeart className="w-7 h-7 text-emerald-700" />;
  };

  const getStepTitle = () => {
    if (currentStep === 0) return "Which school do you attend?";
    if (currentStep === 1) return "What's your department?";
    return "What interests you?";
  };

  const getStepDescription = () => {
    if (currentStep === 0)
      return "We'll personalize your content based on your school.";
    if (currentStep === 1)
      return "Helps us recommend books and resources for your field.";
    return "Choose at least 3 to personalize your experience.";
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
              icon={getStepIcon()}
              title={getStepTitle()}
              description={getStepDescription()}
            />

            {/* Step 1: School */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <label className="text-gray-800 font-medium">
                  Search your school
                </label>
                <Select<OptionType, false>
                  options={schoolOptions}
                  onChange={handleSchoolChange}
                  value={
                    formData.schoolId
                      ? schoolOptions.find(
                          (opt) => opt.value === formData.schoolId
                        )
                      : null
                  }
                  placeholder="Start typing..."
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
                  onChange={(option: SingleValue<OptionType>) =>
                    setFormData({
                      ...formData,
                      department: option?.value || "",
                    })
                  }
                  value={
                    formData.department
                      ? departmentOptions.find(
                          (opt) => opt.value === formData.department
                        )
                      : null
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
                {Object.entries(groupedHobbies).map(([category, list]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {list.map((hobby) => (
                        <InterestButton
                          key={hobby.name}
                          name={hobby.name}
                          icon={hobby.icon}
                          isSelected={formData.hobbies.includes(hobby.name)}
                          onClick={() => toggleHobby(hobby.name)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <NavigationButtons
              onBack={handleBack}
              onNext={handleNext}
              canGoBack={currentStep > 0}
              canProceed={canProceed()}
              isLastStep={currentStep === steps.length - 1}
              isLoading={isLoading}
            />
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
