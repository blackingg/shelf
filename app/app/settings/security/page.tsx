"use client";
import React from "react";
import { Button } from "@/app/components/Form/Button";
import { FiShield, FiKey } from "react-icons/fi";

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Security
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-1">
          Protect your account with additional security settings.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-6 md:p-8 space-y-16">
          {/* <div>
            <div className="flex items-center space-x-3 mb-6">
              <FiKey className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Two-Factor Authentication
              </h3>
            </div>
            <p className="text-gray-600 dark:text-neutral-300 mb-6">
              Add an extra layer of security to your account by enabling
              two-factor authentication (2FA).
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div> */}

          <div className="border-t border-gray-200 dark:border-neutral-800">
            <div className="flex items-center space-x-3 mb-6">
              <FiShield className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Active Sessions
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-neutral-700 rounded-xl bg-gray-50 dark:bg-neutral-800">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Windows PC - Chrome
                  </div>
                  <div className="text-sm text-gray-500 dark:text-neutral-400">
                    San Francisco, CA • Active now
                  </div>
                </div>
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-1 rounded-full font-medium">
                  Current
                </span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-neutral-700 rounded-xl dark:bg-neutral-800/50">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    iPhone 13 - Safari
                  </div>
                  <div className="text-sm text-gray-500 dark:text-neutral-400">
                    San Francisco, CA • 2 hours ago
                  </div>
                </div>
                <button className="text-red-600 dark:text-red-400 text-sm font-medium hover:text-red-700 dark:hover:text-red-300">
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
