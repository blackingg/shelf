"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FiArrowRight, FiArrowLeft, FiCheck, FiSearch } from "react-icons/fi";

interface FormData {
  school: string;
  department: string;
  hobbies: string[];
}

interface Hobby {
  name: string;
  icon: string;
  category: string;
}

interface GroupedHobbies {
  [key: string]: Hobby[];
}

export default function ShelfOnboarding() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    school: "",
    department: "",
    hobbies: [],
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const steps: string[] = ["School", "Department", "Interests"];

  // Sample data - in real app, these would come from API
  const schools: string[] = [
    "University of Ibadan",
    "University of Lagos",
    "Obafemi Awolowo University",
    "University of Nigeria, Nsukka",
    "Ahmadu Bello University",
    "Federal University of Technology, Akure",
    "Lagos State University",
    "Covenant University",
    "Babcock University",
    "Landmark University",
  ];

  const departments: string[] = [
    "Computer Science",
    "Engineering",
    "Medicine",
    "Law",
    "Business Administration",
    "Economics",
    "Psychology",
    "Literature",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Political Science",
    "History",
    "Philosophy",
    "Mass Communication",
    "Architecture",
    "Fine Arts",
  ];

  const hobbies: Hobby[] = [
    { name: "Fiction", icon: "📚", category: "Reading" },
    { name: "Self-Help", icon: "💪", category: "Reading" },
    { name: "Science", icon: "🔬", category: "Reading" },
    { name: "History", icon: "🏛️", category: "Reading" },
    { name: "Biography", icon: "👤", category: "Reading" },
    { name: "Fantasy", icon: "🐉", category: "Reading" },
    { name: "Mystery", icon: "🔍", category: "Reading" },
    { name: "Romance", icon: "💕", category: "Reading" },
    { name: "Comics", icon: "💥", category: "Visual" },
    { name: "Manga", icon: "🎌", category: "Visual" },
    { name: "Magazines", icon: "📰", category: "Visual" },
    { name: "Art Books", icon: "🎨", category: "Visual" },
    { name: "Photography", icon: "📸", category: "Visual" },
    { name: "Fashion", icon: "👗", category: "Lifestyle" },
    { name: "Travel", icon: "✈️", category: "Lifestyle" },
    { name: "Food & Cooking", icon: "🍳", category: "Lifestyle" },
    { name: "Technology", icon: "💻", category: "Professional" },
    { name: "Business", icon: "💼", category: "Professional" },
    { name: "Entrepreneurship", icon: "🚀", category: "Professional" },
    { name: "Health & Fitness", icon: "🏃", category: "Wellness" },
    { name: "Mindfulness", icon: "🧘", category: "Wellness" },
    { name: "Poetry", icon: "📝", category: "Creative" },
  ];

  const filteredSchools: string[] = schools.filter((school: string) =>
    school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDepartments: string[] = departments.filter((dept: string) =>
    dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedHobbies: GroupedHobbies = hobbies.reduce(
    (acc: GroupedHobbies, hobby: Hobby) => {
      if (!acc[hobby.category]) acc[hobby.category] = [];
      acc[hobby.category].push(hobby);
      return acc;
    },
    {}
  );

  const handleNext = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSearchQuery("");
    }
  };

  const handleBack = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSearchQuery("");
    }
  };

  const handleSchoolSelect = (school: string): void => {
    setFormData({ ...formData, school });
  };

  const handleDepartmentSelect = (department: string): void => {
    setFormData({ ...formData, department });
  };

  const handleHobbyToggle = (hobbyName: string): void => {
    const updatedHobbies: string[] = formData.hobbies.includes(hobbyName)
      ? formData.hobbies.filter((h: string) => h !== hobbyName)
      : [...formData.hobbies, hobbyName];
    setFormData({ ...formData, hobbies: updatedHobbies });
  };

  const handleFinish = (): void => {
    console.log("Onboarding completed:", formData);
    // Navigate to main app or show success
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return formData.school !== "";
      case 1:
        return formData.department !== "";
      case 2:
        return formData.hobbies.length >= 3;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-700 p-2 rounded-lg">
                <Image
                  width={20}
                  height={20}
                  src="/logo.svg"
                  alt="Shelf Logo"
                  className="text-white"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900">Shelf</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full">
          {/* Step 0: School Selection */}
          {currentStep === 0 && (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Which school do you attend?
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                This helps us show you relevant academic content
              </p>

              <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for your school..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredSchools.map((school) => (
                  <button
                    key={school}
                    onClick={() => handleSchoolSelect(school)}
                    className={`p-4 text-left rounded-lg border-2 transition-colors ${
                      formData.school === school
                        ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {school}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Department Selection */}
          {currentStep === 1 && (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                What's your department?
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                We'll recommend textbooks and resources for your field of study
              </p>

              <div className="relative mb-6">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for your department..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {filteredDepartments.map((department: string) => (
                  <button
                    key={department}
                    onClick={() => handleDepartmentSelect(department)}
                    className={`p-4 text-left rounded-lg border-2 transition-colors ${
                      formData.department === department
                        ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {department}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Interests Selection */}
          {currentStep === 2 && (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                What are you interested in?
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Choose at least 3 interests to personalize your experience
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Selected: {formData.hobbies.length} / 3 minimum
              </p>

              <div className="space-y-6">
                {Object.entries(groupedHobbies).map(
                  ([category, categoryHobbies]: [string, Hobby[]]) => (
                    <div
                      key={category}
                      className="text-left"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {category}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categoryHobbies.map((hobby: Hobby) => (
                          <button
                            key={hobby.name}
                            onClick={() => handleHobbyToggle(hobby.name)}
                            className={`p-3 rounded-lg border-2 transition-colors flex items-center space-x-3 ${
                              formData.hobbies.includes(hobby.name)
                                ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <span className="text-lg">{hobby.icon}</span>
                            <span className="text-sm font-medium">
                              {hobby.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>Continue</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canProceed()}
                className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <span>Get Started</span>
                <FiCheck className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
