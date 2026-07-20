"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { SettingsSidebar } from "@/app/components/Settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // /settings root is the mobile menu page — no sidebar, no back link there.
  const isRoot = pathname === "/settings";

  return (
    <div className="flex flex-col lg:flex-row h-full lg:overflow-hidden lg:bg-gray-50/50 lg:dark:bg-neutral-950/50">
      {!isRoot && <SettingsSidebar />}
      <div className="flex-1 lg:overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl p-4 md:p-8 lg:p-10 mx-auto lg:mx-0">
          {!isRoot && (
            <Link
              href="/settings"
              className="lg:hidden inline-flex items-center gap-2 mb-4 py-2 pr-2 text-sm font-medium text-muted active:text-foreground"
            >
              <FiArrowLeft className="w-4 h-4" />
              Settings
            </Link>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
