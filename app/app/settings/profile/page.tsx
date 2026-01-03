"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Select, { SingleValue } from "react-select";
import { Button } from "@/app/components/Form/Button";
import { FiCamera, FiBook, FiBriefcase } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectCurrentUser, setUser } from "@/app/store/authSlice";
import { useAppDispatch } from "@/app/store/store";
import {
  useUpdateMeMutation,
  useUploadAvatarMutation,
} from "@/app/store/api/usersApi";
import {
  useGetSchoolsQuery,
  useGetDepartmentsQuery,
} from "@/app/store/api/onboardingApi";
import { useNotifications } from "@/app/context/NotificationContext";
import { getErrorMessage } from "@/app/helpers/error";

interface OptionType {
  value: string;
  label: string;
}

export default function SettingsProfilePage() {
  const dispatch = useAppDispatch();
  const { addNotification } = useNotifications();
  const user = useSelector(selectCurrentUser);
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
    useGetDepartmentsQuery(formData.schoolId, { skip: !formData.schoolId });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.fullName || "",
        username: user?.username || "",
        schoolId: user?.schoolId || "",
        departmentId: user?.departmentId || "",
        email: user?.email || "",
        bio: user?.bio || "",
      });
    }
  }, [user]);

  const schoolOptions: OptionType[] = schools?.map((school) => ({
    value: school.id,
    label: school.name,
  }));

  const departmentOptions: OptionType[] = departments?.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  const isDirty =
    formData.name !== (user?.fullName || "") ||
    formData.username !== (user?.username || "") ||
    formData.bio !== (user?.bio || "") ||
    formData.schoolId !== (user?.schoolId || "") ||
    formData.departmentId !== (user?.departmentId || "");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      dispatch(setUser(updatedUser));
      addNotification("success", "Profile updated successfully!");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to update profile")
      );
    }
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const updatedUser = await uploadAvatar(formData).unwrap();
      dispatch(setUser(updatedUser));
      addNotification("success", "Avatar updated successfully!");
    } catch (error) {
      addNotification(
        "error",
        getErrorMessage(error, "Failed to upload avatar")
      );
    }
  };

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      paddingLeft: "2rem", // Make room for the icon
      borderRadius: "0.75rem",
      borderColor: state.isFocused ? "#10b981" : "#e5e7eb", // emerald-500 : gray-200
      boxShadow: state.isFocused ? "0 0 0 1px #10b981" : "none",
      "&:hover": {
        borderColor: "#10b981",
      },
      minHeight: "42px",
    }),
    input: (base: any) => ({
      ...base,
      "input:focus": {
        boxShadow: "none",
      },
    }),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">
          Update your photo and academic details here.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 md:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Profile Photo
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative w-24 h-24 rounded-full bg-emerald-100 overflow-hidden border-2 border-white shadow-md">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={formData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-emerald-600 uppercase">
                      {user?.fullName?.charAt(0) ||
                        user?.username?.charAt(0) ||
                        "?"}
                    </div>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isUploadingAvatar}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2 cursor-pointer ${
                      isUploadingAvatar ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <FiCamera className="w-4 h-4" />
                    <span>Change Photo</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-gray-400">
                    @
                  </span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  University / School
                </label>
                <div className="relative">
                  <FiBook className="absolute left-3 top-3 z-10 text-gray-400 pointer-events-none" />
                  <Select<OptionType, false>
                    options={schoolOptions}
                    isLoading={isLoadingSchools}
                    onInputChange={(val) => setSchoolSearch(val)}
                    value={
                      formData.schoolId
                        ? schoolOptions.find(
                            (opt) => opt.value === formData.schoolId
                          ) ||
                          (user?.school
                            ? {
                                value: user.schoolId as string,
                                label: user.school.name,
                              }
                            : null)
                        : null
                    }
                    onChange={handleSchoolChange}
                    placeholder="Select School"
                    styles={customSelectStyles}
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Department / Major
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-3 z-10 text-gray-400 pointer-events-none" />
                  <Select<OptionType, false>
                    options={departmentOptions}
                    isLoading={isLoadingDepartments}
                    value={
                      formData.departmentId
                        ? departmentOptions.find(
                            (opt) => opt.value === formData.departmentId
                          ) ||
                          (user?.department
                            ? {
                                value: user.departmentId as string,
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
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
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
