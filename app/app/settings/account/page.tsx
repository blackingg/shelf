"use client";
import React from "react";
import { Button } from "@/app/components/Form/Button";
import { FiMail, FiLock, FiTrash2 } from "react-icons/fi";

export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Contact Info
            </h3>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 rounded-full">
                  <FiMail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Email Address</div>
                  <div className="text-gray-500">sarah@example.com</div>
                </div>
              </div>
              <Button variant="outline" className="text-sm">
                Edit
              </Button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Security
            </h3>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 rounded-full">
                  <FiLock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Password</div>
                  <div className="text-gray-500">Last changed 3 months ago</div>
                </div>
              </div>
              <Button variant="outline" className="text-sm">
                Change
              </Button>
            </div>
          </div>

          <div className="p-6 md:p-8 bg-gray-50/50">
            <h3 className="text-lg font-semibold text-red-600 mb-6">
              Danger Zone
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Delete Account</div>
                <div className="text-sm text-gray-500 mt-1">
                  Permanently remove the account and all associated data.
                </div>
              </div>
              <button className="px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-all shadow-sm">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
