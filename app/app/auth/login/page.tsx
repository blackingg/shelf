"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiAlertCircle, FiArrowRight } from "react-icons/fi";
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

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (): Promise<void> => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Login successful:", { ...formData, rememberMe });
      router.push("/app/library");
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: "Invalid email or password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (): void => {
    console.log("Forgot password clicked");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleGoogleAuth = () => {
    addNotification("info", "Google sign-up coming soon!");
    console.log("Google signup clicked");
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

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <FiAlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

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
                error={errors.email}
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
                  error={errors.password}
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
