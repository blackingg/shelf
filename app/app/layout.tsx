"use client";

import { usePathname } from "next/navigation";
import { useContext } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import { PageHeader } from "@/app/components/PageHeader";
import { PWAInstallPrompt } from "@/app/components/PWAInstallPrompt";
import { FileBufferContext } from "@/app/context/FileBufferContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { fileType } = useContext(FileBufferContext);

  // Define paths that should NOT have the chrome (sidebar/header)
  const isAuth = pathname?.startsWith("/app/auth");
  const isOnboarding = pathname?.startsWith("/app/onboarding");
  const isReader = pathname?.includes("/read");
  const isLocalReader =
    pathname.includes("/upload-and-read") && fileType !== "";

  if (isAuth || isOnboarding || isReader || isLocalReader) {
    return <>{children}</>;
  }

  // Use the "app-like" layout structure (h-screen, overflow-hidden)
  // This prevents window scrolling and delegates scrolling to the content area
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-neutral-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <PageHeader />
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {children}
        </div>
        <PWAInstallPrompt />
      </main>
    </div>
  );
}
