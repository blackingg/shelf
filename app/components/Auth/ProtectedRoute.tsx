"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/app/store/authSlice";
import { useGetMeQuery } from "@/app/store/api/usersApi";
import { LoadingScreen } from "../Loader/LoadingScreen";

const PUBLIC_PATHS = ["/", "/docs/privacy", "/docs/terms"];

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const [isChecking, setIsChecking] = useState(true);
  const isPublicPath = pathname
    ? PUBLIC_PATHS.includes(pathname) || pathname.startsWith("/app/auth")
    : true;

  const { error: meError, isLoading: isLoadingMe } = useGetMeQuery(undefined, {
    skip: !isAuthenticated || isPublicPath,
  });

  useEffect(() => {
    const status = (meError as { status?: number } | undefined)?.status;
    const detail = (meError as { data?: { detail?: string } } | undefined)?.data
      ?.detail;

    if (status === 401 || (status === 403 && detail === "Not authenticated")) {
      dispatch(logout());
      router.replace(
        `/app/auth/login?redirect=${encodeURIComponent(pathname ?? "/")}`,
      );
    }
  }, [meError, dispatch, router, pathname]);

  useEffect(() => {
    if (!pathname) return;

    if (!isAuthenticated && !isPublicPath) {
      router.replace(
        `/app/auth/login?redirect=${encodeURIComponent(pathname)}`,
      );
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, pathname, router, isPublicPath]);

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (isChecking) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoadingMe && !currentUser) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
