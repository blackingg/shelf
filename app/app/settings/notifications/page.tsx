"use client";
import React, { useState } from "react";
import { FiBell, FiMail, FiSmartphone } from "react-icons/fi";
import { Switch } from "@/app/components/Form/Switch";

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
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
          Notifications
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose what messages you want to receive.
        </p>
      </div>

      <div className="space-y-10">
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-sm">
              <FiBell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Library Activity
            </h3>
          </div>

          <div className="space-y-0 border border-gray-100 dark:border-white/5 rounded-sm overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
            <div className="flex items-center justify-between p-6 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Folder Updates
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed max-w-md">
                  Notify me when new documents are added to folders I follow
                </div>
              </div>
              <Switch
                id="emailUpdates"
                checked={preferences.emailUpdates}
                onChange={() => toggle("emailUpdates")}
              />
            </div>

            <div className="flex items-center justify-between p-6 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Folder Invites
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed max-w-md">
                  Receive notifications when invited to private folders
                </div>
              </div>
              <Switch
                id="pushMessages"
                checked={preferences.pushMessages}
                onChange={() => toggle("pushMessages")}
              />
            </div>
          </div>
        </section>

        {/* <section className="opacity-50 grayscale pointer-events-none">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gray-500/10 dark:bg-white/5 rounded-sm">
              <FiMail className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Email Digests
            </h3>
          </div>

          <div className="space-y-0 border border-gray-100 dark:border-white/5 rounded-sm overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
            <div className="flex items-center justify-between p-6">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Weekly Readings
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  A weekly summary of trending books in your department
                </div>
              </div>
              <Switch
                id="pushReminders"
                checked={preferences.pushReminders}
                onChange={() => toggle("pushReminders")}
                disabled={true}
              />
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}
