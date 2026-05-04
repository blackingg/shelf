"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrate } from "@/app/store/authSlice";

/**
 * A client-only component that handles restoring auth state from localStorage.
 * This MUST be rendered at the root of the app, inside the Redux Provider.
 */
export default function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Perform hydration on the client only after mount
    dispatch(hydrate());
  }, [dispatch]);

  return <>{children}</>;
}
