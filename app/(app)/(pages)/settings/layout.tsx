"use client";

import React from "react";
import { SettingsSidebar } from "@/app/components/Settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-full md:overflow-hidden bg-gray-50/50 dark:bg-neutral-950/50">
      <SettingsSidebar />
      <div className="flex-1 md:overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl p-4 md:p-8 lg:p-10 mx-auto md:mx-0">
          {children}
        </div>
      </div>
    </div>
  );
}
