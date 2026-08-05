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
  const { me, hasToken, isAuthenticated, isLoading, isPending, isFetching } =
    useUser();

  const isResolvingSession =
    hasToken && !me && (isLoading || isPending || isFetching);

  useEffect(() => {
    if (isResolvingSession) return;

    if (!hasToken || !isAuthenticated) {
      router.replace("/admin/auth/login");
      return;
    }

    if (!ADMIN_ROLES.includes(me?.role as UserRole)) {
      router.replace("/discover");
    }
  }, [hasToken, isAuthenticated, me, isResolvingSession, router]);

  if (isResolvingSession) return <LoadingScreen />;

  if (
    !hasToken ||
    !isAuthenticated ||
    !ADMIN_ROLES.includes(me?.role as UserRole)
  ) {
    return null;
  }

  return <>{children}</>;
}