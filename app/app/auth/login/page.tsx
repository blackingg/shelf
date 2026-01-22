"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
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
          rememberMe: true, // Google login is usually remembered
        }),
      );

      addNotification("success", "Login successful! Welcome.");
      if (result.user.onboardingCompleted) {
        router.push("/app/library");
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
          rememberMe,
        }),
      );

      addNotification("success", "Login successful! Welcome back.");

      if (result.user.onboardingCompleted) {
        router.push("/app/library");
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
    <>
      <AppHeader
        rightContent={
          <button
            onClick={() => router.push("/app/auth/register")}
            className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium transition-colors cursor-pointer"
          >
            Don&apos;t have an account? Sign Up
          </button>
        }
      />

      <PageContainer>
        <div className="max-w-lg w-full">
          <Card>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-emerald-700 dark:bg-emerald-600 p-3 rounded-lg mb-4">
                <FiLock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-neutral-400">
                Log in to access your library
              </p>
            </div>

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
                icon={<FiMail className="w-5 h-5" />}
                placeholder="Enter your email"
                autoComplete="email"
              />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
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
                  icon={<FiLock className="w-5 h-5" />}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  showPasswordToggle={true}
                />
              </div>

              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onChange={setRememberMe}
                label="Remember me for 30 days"
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoginLoading}
                icon={<FiArrowRight className="w-4 h-4" />}
              >
                Log In
              </Button>
            </form>

            <Divider />

            <div className="grid grid-cols-1 gap-3">
              <SocialLoginButton
                provider="google"
                onClick={handleGoogleAuth}
              />
            </div>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              New to Shelf?{" "}
              <button
                onClick={() => router.push("/app/auth/register")}
                className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-medium cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
