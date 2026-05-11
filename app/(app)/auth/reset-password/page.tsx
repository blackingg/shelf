"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { Card } from "@/app/components/Layout/Card";
import { StepHeader } from "@/app/components/Onboarding/StepHeader";
import { FormInput } from "@/app/components/Form/FormInput";
import { NavigationButtons } from "@/app/components/Onboarding/NavigationButtons";
import { useNotifications } from "@/app/context/NotificationContext";
import { useAuthActions } from "@/app/services/auth";
import { FiLock, FiAlertCircle } from "react-icons/fi";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { addNotification } = useNotifications();
  const { resetPassword, isResetPending } = useAuthActions();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link.",
      );
    }
  }, [token]);

  const validatePasswords = (): boolean => {
    if (!newPassword) {
      addNotification("error", "Password is required");
      return false;
    }

    if (newPassword.length < 8) {
      addNotification("error", "Password must be at least 8 characters");
      return false;
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);

    if (!hasLetter || !hasNumber || !hasSymbol) {
      addNotification(
        "error",
        "Password must contain letters, numbers, and symbols",
      );
      return false;
    }

    if (!confirmPassword) {
      addNotification("error", "Please confirm your password");
      return false;
    }

    if (newPassword !== confirmPassword) {
      addNotification("error", "Passwords do not match");
      return false;
    }

    return true;
  };

  const handlePasswordSubmit = async () => {
    if (!token) return;

    if (!validatePasswords()) {
      return;
    }

    try {
      await resetPassword({ token, newPassword });
      router.push("/auth/login");
    } catch (error: any) {
      addNotification("error", error.message || "Failed to reset password");
    }
  };

  if (error) {
    return (
      <Card className="p-4! md:p-8! text-center">
        <StepHeader
          icon={<FiAlertCircle className="w-6 h-6 text-red-500" />}
          title="Invalid Link"
          description={error}
        />
        <Link
          href="/auth/forgot-password"
          className="inline-block mt-6 text-primary font-medium hover:opacity-80 transition-opacity"
        >
          Request new link
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-4! md:p-8!">
      <StepHeader
        icon={<FiLock className="w-6 h-6 text-primary" />}
        title="Reset Password"
        description="Enter your new password below"
      />
      <div className="space-y-6">
        <div className="space-y-3">
          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={
              <FiLock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            }
            placeholder="••••••••"
            autoComplete="new-password"
            showPasswordToggle
          />
        </div>
        <FormInput
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyPress={(e) =>
            e.key === "Enter" &&
            newPassword &&
            confirmPassword &&
            handlePasswordSubmit()
          }
          icon={<FiLock className="w-5 h-5 text-gray-400 dark:text-gray-500" />}
          placeholder="••••••••"
          autoComplete="new-password"
          showPasswordToggle
        />
      </div>

      <NavigationButtons
        onBack={() => router.push("/auth/forgot-password")}
        onNext={handlePasswordSubmit}
        canGoBack={true}
        canProceed={newPassword.length >= 8 && confirmPassword.length >= 8}
        isLastStep={true}
        isLoading={isResetPending}
        nextLabel="Reset Password"
      />
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/10 selection:text-primary">
      <AppHeader
        rightContent={
          <Link
            href="/auth/login"
            className="text-primary hover:opacity-80 text-sm font-medium transition-opacity"
          >
            Sign In
          </Link>
        }
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 md:py-12">
        <div className="w-full max-w-[440px]">
          <Suspense
            fallback={<Card className="!p-8 text-center">Loading...</Card>}
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
