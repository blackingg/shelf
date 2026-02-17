"use client";
import { Sidebar } from "@/app/components/Sidebar";
import { PageHeader } from "@/app/components/PageHeader";
import { PWAInstallPrompt } from "@/app/components/PWAInstallPrompt";

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white dark:bg-neutral-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PageHeader />
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
        <PWAInstallPrompt />
      </main>
    </div>
  );
}
