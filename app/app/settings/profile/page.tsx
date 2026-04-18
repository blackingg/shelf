"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { SingleValue } from "react-select";
import { useTheme } from "next-themes";
import { Button } from "@/app/components/Form/Button";
import { FiCamera, FiBook, FiBriefcase } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, setUser } from "@/app/store";
import {
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadAvatarMutation,
  useGetSchoolsQuery,
  useGetOnboardingDepartmentsQuery,
} from "@/app/services";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";
import { Department } from "@/app/types/departments";
import { FormSelect } from "@/app/components/Form/FormSelect";

interface OptionType {
  value: string;
  label: string;
}

export default function SettingsProfilePage() {
  const { addNotification } = useNotifications();
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const updateMe = useUpdateMeMutation();
  const uploadAvatar = useUploadAvatarMutation();

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
    useGetOnboardingDepartmentsQuery(formData.schoolId);

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
      departmentId: "",
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
      const updatedUser = await updateMe
        .mutateAsync({
          fullName: formData.name,
          username: formData.username,
          bio: formData.bio,
        })
        .unwrap();
      await completeOnboarding({
        schoolId: formData.schoolId,
        departmentId: formData.departmentId,
      });
      dispatch(setUser(updatedUser));
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

    const avatarPayload = new FormData();
    avatarPayload.append("file", file);

    try {
      const updatedUser = await uploadAvatar.mutateAsync(avatarPayload);
      dispatch(setUser(updatedUser));
      addNotification("success", "Avatar updated successfully!");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to upload avatar"),
      );
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Profile Settings
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-1.5 md:text-lg">
          Update your personal details and academic affiliation.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800">
        <div className="p-5 md:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-gray-100 dark:border-neutral-800/50">
              <div className="relative group">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 overflow-hidden border-2 border-white dark:border-neutral-800 shadow-xl shadow-emerald-900/5">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={formData.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      {user?.fullName?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        "?"}
                    </div>
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 dark:bg-emerald-500 rounded-xl border-4 border-white dark:border-neutral-900 shadow-lg flex items-center justify-center text-white hover:bg-emerald-700 dark:hover:bg-emerald-400 transition-all duration-200 cursor-pointer hover:scale-110 active:scale-95"
                >
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploadAvatar.isPending}
                  />
                  {uploadAvatar.isPending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiCamera className="w-5 h-5" />
                  )}
                </label>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  Profile Photo
                </h4>
                <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-xs">
                  Upload a professional photo to help others recognize you. JPG,
                  GIF or PNG. Max size 2MB.
                </p>
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
              <FormSelect<OptionType, false>
                label="University / School"
                icon={<FiBook />}
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
              />
              <FormSelect<OptionType, false>
                label="Department / Major"
                icon={<FiBriefcase />}
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
              />
            </div>

            <div className="pt-8 border-t border-gray-100 dark:border-neutral-800/50 flex justify-end">
              <Button
                type="submit"
                isLoading={updateMe.isPending}
                disabled={!isDirty}
                className="w-full sm:w-auto px-10 py-3 text-base font-bold rounded-xl shadow-lg shadow-emerald-900/10 active:scale-95 transition-all"
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
