"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { PageContainer } from "@/app/components/Layout/PageContainer";
import { Card } from "@/app/components/Layout/Card";
import { FormInput } from "@/app/components/Form/FormInput";
import { Button } from "@/app/components/Form/Button";
import { Checkbox } from "@/app/components/Form/Checkbox";
import { Divider } from "@/app/components/Form/Divider";
import { SocialLoginButton } from "@/app/components/Form/SocialLoginButton";
import { useNotifications } from "@/app/context/NotificationContext";
import { useLoginMutation } from "@/app/store/api/authApi";
import { useAppDispatch } from "@/app/store/store";
import { setCredentials } from "@/app/store/authSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleAuthMutation } from "@/app/store/api/authApi";
import { getErrorMessage } from "@/app/helpers/error";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();
  const dispatch = useAppDispatch();

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      const userInfoRes = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        },
      );
      const userInfo = await userInfoRes.json();

      const result = await googleLogin({
        googleId: userInfo.sub,
        email: userInfo.email,
        fullName: userInfo.name,
        avatar: userInfo.picture,
      }).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          expiresIn: result.tokens.expiresIn,
          rememberMe: true, // Google login is usually remembered
        }),
      );

      addNotification("success", "Login successful! Welcome.");
      if (result.user.onboardingCompleted) {
        router.push("/app/discover");
      } else {
        router.push("/app/onboarding");
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      addNotification(
        "error",
        getErrorMessage(error, "Google login failed. Please try again."),
      );
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
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe,
      }).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          expiresIn: result.tokens.expiresIn,
          rememberMe,
        }),
      );

      addNotification("success", "Login successful! Welcome back.");

      if (result.user.onboardingCompleted) {
        router.push("/app/discover");
      } else {
        addNotification("info", "Please complete the onboarding process.");
        router.push("/app/onboarding");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      addNotification(
        "error",
        getErrorMessage(error, "Invalid email or password. Please try again."),
      );
    }
  };

  const handleForgotPassword = (): void => {
    router.push("/app/auth/forgot-password");
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
            href="/app/auth/register"
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

          <Card className="!p-8">
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
                isLoading={isLoginLoading}
                className="py-4"
              >
                Log In
              </Button>
            </form>

            <Divider text="or sign in with" />

            <SocialLoginButton
              provider="google"
              onClick={handleGoogleAuth}
            />
          </Card>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/app/auth/register"
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
