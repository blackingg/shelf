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
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 mt-1">
          Choose what messages you want to receive.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <FiBell className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Library Activity
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Folder Updates</div>
                  <div className="text-sm text-gray-500">
                    Notify me when new documents are added to folders I follow
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.emailUpdates}
                  onClick={() => toggle("emailUpdates")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    preferences.emailUpdates ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.emailUpdates ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Folder Invites</div>
                  <div className="text-sm text-gray-500">
                    Receive notifications when invited to private folders
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.pushMessages}
                  onClick={() => toggle("pushMessages")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    preferences.pushMessages ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.pushMessages ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center space-x-3 mb-6">
              <FiMail className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Email Digests
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Weekly Readings</div>
                  <div className="text-sm text-gray-500">
                    A weekly summary of trending books in your department
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.pushReminders}
                  onClick={() => toggle("pushReminders")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    preferences.pushReminders ? "bg-emerald-500" : "bg-gray-200"
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
                  <div className="font-medium text-gray-900">Department News</div>
                  <div className="text-sm text-gray-500">
                     Updates and announcements from your university department
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={preferences.emailPromotions}
                  onClick={() => toggle("emailPromotions")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    preferences.emailPromotions ? "bg-emerald-500" : "bg-gray-200"
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
