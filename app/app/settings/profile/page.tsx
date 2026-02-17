"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Select, { SingleValue } from "react-select";
import { useTheme } from "next-themes";
import { Button } from "@/app/components/Form/Button";
import { FiCamera, FiBook, FiBriefcase } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/app/store/authSlice";
import {
  useUpdateMeMutation,
  useUploadAvatarMutation,
} from "@/app/store/api/usersApi";
import {
  useGetSchoolsQuery,
  useGetOnboardingDepartmentsQuery,
} from "@/app/store/api/onboardingApi";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";
import { Department } from "@/app/types/departments";

interface OptionType {
  value: string;
  label: string;
}

export default function SettingsProfilePage() {
  const { addNotification } = useNotifications();
  const user = useSelector(selectCurrentUser);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation();

  const [uploadAvatar, { isLoading: isUploadingAvatar }] =
    useUploadAvatarMutation();

  const [schoolSearch, setSchoolSearch] = useState("");
  const { data: schools = [], isLoading: isLoadingSchools } =
    useGetSchoolsQuery(schoolSearch);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    schoolId: "",
    departmentId: "",
    email: "",
    bio: "",
  });

  const { data: departments = [], isLoading: isLoadingDepartments } =
    useGetOnboardingDepartmentsQuery(formData.schoolId, {
      skip: !formData.schoolId,
    });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.fullName || "",
        username: user?.username || "",
        schoolId: user?.school?.id || "",
        departmentId: user?.department?.id || "",
        email: user?.email || "",
        bio: user?.bio || "",
      });
    }
  }, [user]);

  const schoolOptions: OptionType[] = schools?.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  const departmentOptions: OptionType[] = (departments as Department[])?.map(
    (dept) => ({
      value: dept.id,
      label: dept.name,
    }),
  );

  const isDirty =
    formData.name !== (user?.fullName || "") ||
    formData.username !== (user?.username || "") ||
    formData.bio !== (user?.bio || "") ||
    formData.schoolId !== (user?.school?.id || "") ||
    formData.departmentId !== (user?.department?.id || "");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchoolChange = (option: SingleValue<OptionType>) => {
    setFormData((prev) => ({
      ...prev,
      schoolId: option?.value || "",
      departmentId: "", // Reset department when school changes
    }));
  };

  const handleDepartmentChange = (option: SingleValue<OptionType>) => {
    setFormData((prev) => ({
      ...prev,
      departmentId: option?.value || "",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateMe({
        fullName: formData.name,
        username: formData.username,
        bio: formData.bio,
        schoolId: formData.schoolId,
        departmentId: formData.departmentId,
      }).unwrap();
      addNotification("success", "Profile updated successfully!");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update profile"),
      );
    }
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadAvatar(formData).unwrap();
      addNotification("success", "Avatar updated successfully!");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to upload avatar"),
      );
    }
  };

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      paddingLeft: "2rem",
      borderRadius: "0.375rem",
      backgroundColor: isDark ? "#171717" : "#ffffff",
      borderColor: state.isFocused ? "#10b981" : isDark ? "#262626" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 1px #10b981" : "none",
      "&:hover": {
        borderColor: "#10b981",
      },
      minHeight: "42px",
    }),
    input: (base: any) => ({
      ...base,
      color: isDark ? "#ffffff" : "#111827",
      "input:focus": {
        boxShadow: "none",
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDark ? "#ffffff" : "#111827",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDark ? "#737373" : "#9ca3af",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "#171717" : "#ffffff",
      border: isDark ? "1px solid #262626" : "1px solid #e5e7eb",
      boxShadow: isDark
        ? "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
        : "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#10b981"
        : state.isFocused
          ? isDark
            ? "#262626"
            : "#f3f4f6"
          : "transparent",
      color: state.isSelected ? "#ffffff" : isDark ? "#ffffff" : "#111827",
      "&:active": {
        backgroundColor: "#10b981",
      },
    }),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-1">
          Update your photo and academic details here.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
        <div className="p-6 md:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-4">
                Profile Photo
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/40 overflow-hidden border border-gray-200 dark:border-neutral-700">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-medium text-emerald-600 dark:text-emerald-400 uppercase">
                        {user?.fullName?.charAt(0) ||
                          user?.username?.charAt(0) ||
                          "?"}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-neutral-800 rounded-full border border-gray-200 dark:border-neutral-700 shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploadingAvatar}
                    />
                    {isUploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                    ) : (
                      <FiCamera className="w-4 h-4" />
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-400 dark:text-neutral-500 text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  University / School
                </label>
                <div className="relative">
                  <FiBook className="absolute left-3 top-3 z-10 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                  <Select<OptionType, false>
                    options={schoolOptions}
                    isLoading={isLoadingSchools}
                    onInputChange={(val) => setSchoolSearch(val)}
                    value={
                      formData.schoolId
                        ? schoolOptions.find(
                            (opt) => opt.value === formData.schoolId,
                          ) ||
                          (user?.school
                            ? {
                                value: user.school.id as string,
                                label: user.school.name,
                              }
                            : null)
                        : null
                    }
                    onChange={handleSchoolChange}
                    placeholder="Select School"
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                    className="text-gray-900 dark:text-neutral-100"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                  Department / Major
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-3 z-10 text-gray-400 dark:text-neutral-500 pointer-events-none" />
                  <Select<OptionType, false>
                    options={departmentOptions}
                    isLoading={isLoadingDepartments}
                    value={
                      formData.departmentId
                        ? departmentOptions.find(
                            (opt) => opt.value === formData.departmentId,
                          ) ||
                          (user?.department
                            ? {
                                value: user.department.id as string,
                                label: user.department.name,
                              }
                            : null)
                        : null
                    }
                    onChange={handleDepartmentChange}
                    placeholder="Select Department"
                    isDisabled={!formData.schoolId}
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                    className="text-gray-900 dark:text-neutral-100"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-neutral-800 flex justify-end">
              <Button
                type="submit"
                isLoading={isUpdating}
                disabled={!isDirty}
                className="w-auto px-8"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
