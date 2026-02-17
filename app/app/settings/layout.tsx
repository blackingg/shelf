"use client";

import React from "react";
import { SettingsSidebar } from "@/app/components/Settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-full">
      <SettingsSidebar />
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
