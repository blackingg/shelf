"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/app/components/Sidebar";
import { PageHeader } from "@/app/components/PageHeader";
import { PWAInstallPrompt } from "@/app/components/PWAInstallPrompt";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define paths that should NOT have the chrome (sidebar/header)
  const isAuth = pathname?.startsWith("/app/auth");
  const isOnboarding = pathname?.startsWith("/app/onboarding");
  const isReader = pathname?.includes("/read");

  if (isAuth || isOnboarding || isReader) {
    return <>{children}</>;
  }

  // Use the "app-like" layout structure (h-screen, overflow-hidden)
  // This prevents window scrolling and delegates scrolling to the content area
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-neutral-900 overflow-hidden">
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
