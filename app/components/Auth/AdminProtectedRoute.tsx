"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/services";
import { LoadingScreen } from "../Loader/LoadingScreen";

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me, isAuthenticated, isLoading, isHydrated } = useUser();

  useEffect(() => {
    if (isHydrated && !isLoading) {
      if (!isAuthenticated) {
        router.replace("/admin/auth/login");
      } else if (me?.role !== "ADMIN") {
        // If logged in but not admin, send back to main app
        router.replace("/discover");
      }
    }
  }, [isAuthenticated, me, isLoading, isHydrated, router]);

  if (!isHydrated || isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || me?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
