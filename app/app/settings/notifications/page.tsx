"use client";
import React, { useState } from "react";
import { FiBell, FiMail, FiSmartphone } from "react-icons/fi";

export default function NotificationsSettingsPage() {
  const [preferences, setPreferences] = useState({
    emailUpdates: true,
    emailPromotions: false,
    pushMessages: true,
    pushReminders: true,
  });

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-1">
          Choose what messages you want to receive.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <FiBell className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Library Activity
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Folder Updates
                  </div>
                  <div className="text-sm text-gray-500 dark:text-neutral-400">
                    Notify me when new documents are added to folders I follow
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.emailUpdates}
                  onClick={() => toggle("emailUpdates")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
                    preferences.emailUpdates
                      ? "bg-emerald-500"
                      : "bg-gray-200 dark:bg-neutral-800"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.emailUpdates
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    Folder Invites
                  </div>
                  <div className="text-sm text-gray-500 dark:text-neutral-400">
                    Receive notifications when invited to private folders
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.pushMessages}
                  onClick={() => toggle("pushMessages")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
                    preferences.pushMessages
                      ? "bg-emerald-500"
                      : "bg-gray-200 dark:bg-neutral-800"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.pushMessages
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <FiMail className="w-5 h-5 text-gray-400 dark:text-neutral-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Email Digests
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Weekly Readings</div>
                  <div className="text-sm text-gray-500 dark:text-neutral-400">
                    A weekly summary of trending books in your department
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.pushReminders}
                  onClick={() => toggle("pushReminders")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
                    preferences.pushReminders ? "bg-emerald-500" : "bg-gray-200 dark:bg-neutral-800"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.pushReminders ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Department News</div>
                  <div className="text-sm text-gray-500 dark:text-neutral-400">
                     Updates and announcements from your university department
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.emailPromotions}
                  onClick={() => toggle("emailPromotions")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 ${
                    preferences.emailPromotions ? "bg-emerald-500" : "bg-gray-200 dark:bg-neutral-800"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.emailPromotions ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
