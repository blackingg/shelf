"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import Link from "next/link";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { Card } from "@/app/components/Layout/Card";
import { FormInput } from "@/app/components/Form/FormInput";
import { Button } from "@/app/components/Form/Button";
import { Checkbox } from "@/app/components/Form/Checkbox";
import { Divider } from "@/app/components/Form/Divider";
import { SocialLoginButton } from "@/app/components/Form/SocialLoginButton";
import { useNotifications } from "@/app/context/NotificationContext";
import { useAuthActions } from "@/app/services";
import { useGoogleLogin } from "@react-oauth/google";
import { SpinnerLoader } from "@/app/components/Loader/SpinnerLoader";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-white dark:bg-black" />}
    >
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const {
    login: performLogin,
    googleAuth,
    isLoading,
    isLoginPending,
    isGooglePending,
  } = useAuthActions();

  const redirectParam = searchParams.get("redirect");
  const getPostLoginRoute = (onboardingCompleted: boolean) => {
    if (!onboardingCompleted) return "/onboarding";

    if (
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("/auth")
    ) {
      return redirectParam;
    }

    return "/discover";
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      const userInfoRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        },
      );
      const userInfo = await userInfoRes.json();

      const result = await googleAuth({
        googleId: userInfo.sub,
        email: userInfo.email,
        fullName: userInfo.name,
        avatar: userInfo.picture,
      });

      router.push(getPostLoginRoute(result.user.onboardingCompleted));
    } catch (error: any) {
      console.error("Google Auth Error:", error);
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => addNotification("error", "Google login was unsuccessful"),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      addNotification("error", "Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      addNotification("error", "Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      addNotification("error", "Password is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await performLogin({
        email: formData.email,
        password: formData.password,
        rememberMe,
      });

      router.push(getPostLoginRoute(result.user.onboardingCompleted));
    } catch (error: any) {
      console.error("Login failed:", error);
    }
  };

  const handleForgotPassword = (): void => {
    router.push("/auth/forgot-password");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-onest">
      <AppHeader
        rightContent={
          <Link
            href="/auth/register"
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 text-sm font-medium transition-colors"
          >
            Sign Up
          </Link>
        }
      />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Log in to your account to continue
            </p>
          </div>

          <Card className="p-8!">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-6"
            >
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                icon={<FiMail className="w-5 h-5 text-gray-400" />}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <FormInput
                  label=""
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  icon={<FiLock className="w-5 h-5 text-gray-400" />}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  showPasswordToggle={true}
                />
              </div>

              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onChange={setRememberMe}
                label="Keep me logged in"
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoginPending}
                disabled={isLoading}
                className="py-4"
                loader={<SpinnerLoader />}
              >
                Log In
              </Button>
            </form>

            <Divider text="or sign in with" />

            <SocialLoginButton
              provider="google"
              onClick={handleGoogleAuth}
              isLoading={isGooglePending}
              disabled={isLoading}
              loader={<SpinnerLoader />}
            />
          </Card>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
