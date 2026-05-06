"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsHydrated } from "@/app/store";
import { useUser } from "@/app/services";
import { LoadingScreen } from "../Loader/LoadingScreen";

const PUBLIC_PATHS = [
  "/",
  "/privacy",
  "/terms",
  "/discover",
  "/folders",
];

const PUBLIC_DYNAMIC_PREFIXES = [
  "/folders",
  "/books",
  "/profile/",
  "/library/departments",
  "/library/categories",
];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isHydrated = useSelector(selectIsHydrated);
  const { me: currentUser, isAuthenticated, isLoading: isLoadingMe, error: meError } = useUser();

  const isPublicPath = useMemo(() => {
    if (!pathname) return true;
    if (PUBLIC_PATHS.includes(pathname)) return true;
    if (pathname.startsWith("/auth")) return true;

    // Check for sensitive keywords across ALL routes
    const isSensitive =
      pathname.includes("/edit") ||
      pathname.includes("/read") ||
      pathname.includes("/upload");
    if (isSensitive) return false;

    const segments = pathname.split("/").filter(Boolean);

    return PUBLIC_DYNAMIC_PREFIXES.some((prefix) => {
      if (!pathname.startsWith(prefix)) return false;

      // Depth validation
      if (
        prefix === "/books" ||
        prefix === "/folders" ||
        prefix === "/profile/"
      ) {
        return segments.length <= 3;
      }

      if (prefix.startsWith("/library/")) {
        return segments.length <= 4;
      }

      return true;
    });
  }, [pathname]);

  // Wait for hydration before doing anything
  const isChecking = !isHydrated;

  // Handle 401/403 — token is expired or invalid, force logout
  useEffect(() => {
    if (!meError || isPublicPath) return;
    const status = (meError as { status?: number })?.status;
    const detail = (meError as { data?: { detail?: string } })?.data?.detail;

    if (status === 401 || (status === 403 && detail === "Not authenticated")) {
      dispatch(logout());
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`,
      );
    }
  }, [meError, dispatch, router, pathname, isPublicPath]);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (isChecking || !pathname || isPublicPath) return;

    if (!isAuthenticated) {
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(pathname)}`,
      );
    }
  }, [isAuthenticated, pathname, router, isPublicPath, isChecking]);

  if (isPublicPath) return <>{children}</>;
  if (isChecking) return <LoadingScreen />;
  if (!isAuthenticated) return null;
  if (isLoadingMe && !currentUser) return <LoadingScreen />;

  return <>{children}</>;
}
