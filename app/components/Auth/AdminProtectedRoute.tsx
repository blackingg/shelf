"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/services";
import { LoadingScreen } from "../Loader/LoadingScreen";
import { UserRole } from "@/app/types/user";

const ADMIN_ROLES: UserRole[] = ["ADMIN", "SUPER_ADMIN"];

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { me, isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/admin/auth/login");
      } else if (!ADMIN_ROLES.includes(me?.role as UserRole)) {
        // If logged in but not admin, send back to main app
        router.replace("/discover");
      }
    }
  }, [isAuthenticated, me, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !ADMIN_ROLES.includes(me?.role as UserRole)) {
    return null;
  }

  return <>{children}</>;
}
