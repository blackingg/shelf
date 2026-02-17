"use client";
import React from "react";
import { Sidebar } from "@/app/components/Sidebar";
import { PageHeader } from "@/app/components/PageHeader";
import { PWAInstallPrompt } from "@/app/components/PWAInstallPrompt";
import { SettingsSidebar } from "@/app/components/Settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-neutral-900">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <PageHeader />
        <div className="flex flex-1 flex-col md:flex-row">
          <SettingsSidebar />
          <div className="flex-1 p-6 md:p-8">
            <div className="max-w-4xl">{children}</div>
          </div>
        </div>
        <PWAInstallPrompt />
      </main>
    </div>
  );
}
