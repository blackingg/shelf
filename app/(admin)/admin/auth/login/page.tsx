"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/Form/Button";
import { FiShield } from "react-icons/fi";
import { useAuthActions } from "@/app/services";
import { useNotifications } from "@/app/context/NotificationContext";
import { SpinnerLoader } from "@/app/components/Loader/SpinnerLoader";
import { UserRole } from "@/app/types/user";

const ADMIN_ROLES: UserRole[] = ["ADMIN", "SUPER_ADMIN"];

export default function AdminLoginPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const { login, isLoginPending, isLoading } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      addNotification("error", "Email is required");
      return;
    }
    if (!password) {
      addNotification("error", "Password is required");
      return;
    }

    try {
      const result = await login({ email, password });

      if (!ADMIN_ROLES.includes(result.user.role as UserRole)) {
        addNotification(
          "error",
          "Access denied. Admin privileges required.",
        );
        return;
      }

      addNotification("success", "Welcome back, Admin.");
      router.push("/admin/dashboard");
    } catch (error: any) {
      const message =
        error?.data?.message || "Authentication failed. Please try again.";
      addNotification("error", message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-md flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <FiShield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-medium text-gray-900 dark:text-white tracking-tight">
            Admin Access
          </h1>
          <p className="text-gray-500 dark:text-neutral-500 mt-2 font-medium">
            Authorized personnel only
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-8 rounded-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-widest px-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-md px-4 py-3 text-gray-900 dark:text-white focus:border-primary outline-none transition-colors font-medium"
                placeholder="admin@shelf.ng"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-widest px-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-md px-4 py-3 text-gray-900 dark:text-white focus:border-primary outline-none transition-colors font-medium"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              isLoading={isLoginPending}
              disabled={isLoading}
              className="w-full py-4 text-base font-medium rounded-md"
              loader={<SpinnerLoader />}
            >
              Authenticate
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
