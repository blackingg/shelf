"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/services";

export const PublicNavButtons: React.FC = () => {
  const { isAuthenticated } = useUser();
  const router = useRouter();

  if (isAuthenticated) {
    return (
      <button
        onClick={() => router.push("/discover")}
        className="px-5 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Go to App
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => router.push("/auth/login")}
        className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
      >
        Login
      </button>
      <button
        onClick={() => router.push("/auth/register")}
        className="px-5 py-2 bg-primary text-primary-foreground rounded-sm text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Get Started
      </button>
    </div>
  );
};
