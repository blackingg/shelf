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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

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

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      addNotification("success", "Login successful! Welcome back.");
      console.log("Login successful:", { ...formData, rememberMe });
      router.push("/app/library");
    } catch (error) {
      console.error("Login failed:", error);
      addNotification("error", "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
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

  const handleGoogleAuth = () => {
    addNotification("info", "Google sign-in coming soon!");
    console.log("Google login clicked");
    // Handle Google OAuth
  };

  return (
    <>
      <AppHeader
        rightContent={
          <button
            onClick={() => router.push("/app/auth/register")}
            className="text-emerald-700 hover:text-emerald-800 font-medium transition-colors cursor-pointer"
          >
            Don&apos;t have an account? Sign Up
          </button>
        }
      />

      <PageContainer>
        <div className="max-w-lg w-full">
          <Card>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-emerald-700 p-3 rounded-lg mb-4">
                <FiLock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Log in to access your library</p>
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
                  <label className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-emerald-700 hover:text-emerald-800 transition-colors"
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
                isLoading={isLoading}
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
            <p className="text-sm text-gray-600">
              New to Shelf?{" "}
              <button
                onClick={() => router.push("/app/auth/register")}
                className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
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
