"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Select, { SingleValue } from "react-select";
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
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

interface OptionType {
  value: string;
  label: string;
}

interface FormData {
  school: string;
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
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    school: "",
    department: "",
    hobbies: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const steps = ["School", "Department", "Interests"];

  const schools: string[] = [
    "University of Ibadan",
    "University of Lagos",
    "Obafemi Awolowo University",
    "Ahmadu Bello University",
    "University of Nigeria, Nsukka",
    "Covenant University",
    "Babcock University",
    "Federal University of Technology, Akure",
    "Lagos State University",
    "Landmark University",
    "University of Ilorin",
    "Pan-Atlantic University",
  ];

  const schoolOptions: OptionType[] = schools.map((school) => ({
    value: school,
    label: school,
  }));

  const departments: string[] = [
    "Computer Science",
    "Engineering",
    "Medicine",
    "Law",
    "Business Administration",
    "Economics",
    "Psychology",
    "Mass Communication",
    "Architecture",
    "Fine Arts",
  ];

  const departmentOptions: OptionType[] = departments.map((dept) => ({
    value: dept,
    label: dept,
  }));

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
    if (currentStep === 0) return formData.school !== "";
    if (currentStep === 1) return formData.department !== "";
    if (currentStep === 2) return formData.hobbies.length >= 3;
    return false;
  };

  const handleFinish = async (): Promise<void> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1500));
    window.location.href = "/app/library";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center space-x-3"
            >
              <div className="bg-emerald-700 p-2 rounded-lg">
                <Image
                  width={20}
                  height={20}
                  src="/logo.svg"
                  alt="Shelf Logo"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">Shelf</span>
            </Link>
            <p className="text-sm text-gray-800">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 transition-all duration-300">
            {/* Step Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-emerald-100 w-14 h-14 rounded-full mb-4">
                {currentStep === 0 && (
                  <FiUser className="w-7 h-7 text-emerald-700" />
                )}
                {currentStep === 1 && (
                  <FiBook className="w-7 h-7 text-emerald-700" />
                )}
                {currentStep === 2 && (
                  <FiHeart className="w-7 h-7 text-emerald-700" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {currentStep === 0
                  ? "Which school do you attend?"
                  : currentStep === 1
                  ? "What’s your department?"
                  : "What interests you?"}
              </h2>
              <p className="text-gray-700">
                {currentStep === 0
                  ? "We’ll personalize your content based on your school."
                  : currentStep === 1
                  ? "Helps us recommend books and resources for your field."
                  : "Choose at least 3 to personalize your experience."}
              </p>
            </div>

            {/* Step 1: School */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <label className="text-gray-800 font-medium">
                  Search your school
                </label>
                <Select<OptionType, false>
                  options={schoolOptions}
                  onChange={(option: SingleValue<OptionType>) =>
                    setFormData({ ...formData, school: option?.value || "" })
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
                  placeholder="Type to search..."
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
                        <button
                          key={hobby.name}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              hobbies: prev.hobbies.includes(hobby.name)
                                ? prev.hobbies.filter((h) => h !== hobby.name)
                                : [...prev.hobbies, hobby.name],
                            }));
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl border-2 text-sm transition-all ${
                            formData.hobbies.includes(hobby.name)
                              ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                              : "border-gray-200 text-gray-800 hover:border-gray-300"
                          }`}
                        >
                          <span className="flex items-center space-x-2">
                            {hobby.icon}
                            <span>{hobby.name}</span>
                          </span>
                          {formData.hobbies.includes(hobby.name) && (
                            <FiCheck className="w-4 h-4 text-emerald-700" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-10">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  currentStep === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FiArrowLeft />
                <span>Back</span>
              </button>

              <button
                onClick={
                  currentStep < steps.length - 1
                    ? () => setCurrentStep((prev) => prev + 1)
                    : handleFinish
                }
                disabled={!canProceed() || isLoading}
                className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-medium transition-all ${
                  canProceed() && !isLoading
                    ? "bg-emerald-700 text-white hover:bg-emerald-800 focus:ring-2 focus:ring-emerald-500 shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {currentStep === steps.length - 1
                        ? "Get Started"
                        : "Continue"}
                    </span>
                    {currentStep === steps.length - 1 ? (
                      <FiCheck className="w-4 h-4" />
                    ) : (
                      <FiArrowRight className="w-4 h-4" />
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
