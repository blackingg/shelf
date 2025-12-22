"use client";
import React, { useState } from "react";
import { FiMoon, FiSun, FiMonitor } from "react-icons/fi";

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useState("system");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appearance</h1>
        <p className="text-gray-500 mt-1">
          Customize how the app looks and feels.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  theme === "light"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                  <FiSun className="w-6 h-6 text-gray-700" />
                </div>
                <span className="font-medium text-gray-900">Light</span>
              </button>
              
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  theme === "dark"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="p-3 bg-gray-900 rounded-full shadow-sm mb-3">
                  <FiMoon className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-gray-900">Dark</span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  theme === "system"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="p-3 bg-gray-100 rounded-full shadow-sm mb-3">
                  <FiMonitor className="w-6 h-6 text-gray-700" />
                </div>
                <span className="font-medium text-gray-900">System</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
