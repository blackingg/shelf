"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/Form/Button";
import { FiCamera, FiMapPin, FiGlobe } from "react-icons/fi";

export default function SettingsProfilePage() {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "Sarah Chen",
    username: "sarahchen",
    bio: "Book lover, coffee enthusiast, and aspiring writer. Always looking for the next great story.",
    location: "San Francisco, CA",
    website: "sarahchen.com",
    email: "sarah@example.com",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">
          Update your photo and personal details here.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Profile Photo
              </label>
              <div className="flex items-center space-x-6">
                <div className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md">
                  {/* Placeholder for now */}
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                    {formData.name.charAt(0)}
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <FiCamera className="w-4 h-4" />
                  <span>Change Photo</span>
                </button>
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
                  Location
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-4 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <Button
                type="submit"
                isLoading={isLoading}
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
