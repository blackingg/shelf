"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { FiMoon, FiSun, FiMonitor } from "react-icons/fi";

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  // Avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          Appearance
        </h1>
        <p className="hidden lg:block text-muted mt-1">
          Customize how the app looks and feels.
        </p>
      </div>

      <div className="lg:bg-white lg:dark:bg-neutral-900 lg:rounded-lg lg:border lg:border-gray-200 lg:dark:border-neutral-800 lg:overflow-hidden">
        <div className="lg:p-8 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Theme
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center p-4 rounded-md border transition-colors duration-150 ${
                  theme === "light"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 dark:bg-neutral-800"
                }`}
              >
                <div className="p-3 bg-white rounded-full border border-line-subtle mb-3">
                  <FiSun className="w-6 h-6 text-gray-700" />
                </div>
                <span className="font-medium text-foreground">
                  Light
                </span>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center p-4 rounded-md border transition-colors duration-150 ${
                  theme === "dark"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 dark:bg-neutral-800"
                }`}
              >
                <div className="p-3 bg-gray-900 rounded-full mb-3">
                  <FiMoon className="w-6 h-6 text-white" />
                </div>
                <span className="font-medium text-foreground">
                  Dark
                </span>
              </button>

              <button
                onClick={() => setTheme("system")}
                className={`flex flex-col items-center p-4 rounded-md border transition-colors duration-150 ${
                  theme === "system"
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 dark:bg-neutral-800"
                }`}
              >
                <div className="p-3 bg-gray-100 dark:bg-neutral-800 rounded-full mb-3">
                  <FiMonitor className="w-6 h-6 text-gray-700 dark:text-neutral-300" />
                </div>
                <span className="font-medium text-foreground">
                  System
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
