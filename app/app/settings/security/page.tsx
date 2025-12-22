"use client";
import React from "react";
import { Button } from "@/app/components/Form/Button";
import { FiShield, FiKey } from "react-icons/fi";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security</h1>
        <p className="text-gray-500 mt-1">
          Protect your account with additional security settings.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <FiKey className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Two-Factor Authentication
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Add an extra layer of security to your account by enabling
              two-factor authentication (2FA).
            </p>
            <Button variant="outline">
              Enable 2FA
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <FiShield className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Active Sessions
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div>
                  <div className="font-medium text-gray-900">
                    Windows PC - Chrome
                  </div>
                  <div className="text-sm text-gray-500">
                    San Francisco, CA • Active now
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                  Current
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900">
                    iPhone 13 - Safari
                  </div>
                  <div className="text-sm text-gray-500">
                    San Francisco, CA • 2 hours ago
                  </div>
                </div>
                <button className="text-red-600 text-sm font-medium hover:text-red-700">
                  Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
