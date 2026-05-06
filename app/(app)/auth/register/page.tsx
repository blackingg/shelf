"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { AppHeader } from "@/app/components/Layout/AppHeader";
import { Card } from "@/app/components/Layout/Card";
import { FormInput } from "@/app/components/Form/FormInput";
import { Button } from "@/app/components/Form/Button";
import { Checkbox } from "@/app/components/Form/Checkbox";
import { Divider } from "@/app/components/Form/Divider";
import { SocialLoginButton } from "@/app/components/Form/SocialLoginButton";
import { PasswordStrengthIndicator } from "@/app/components/Form/PasswordStrengthIndicator";
import { useNotifications } from "@/app/context/NotificationContext";
import { SpinnerLoader } from "@/app/components/Loader/SpinnerLoader";
import { useAuthActions } from "@/app/services";
import { useGoogleLogin } from "@react-oauth/google";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const {
    register,
    googleAuth,
    isLoading,
    isRegisterPending,
    isGooglePending,
  } = useAuthActions();

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

      if (result.user.onboardingCompleted) {
        router.push("/discover");
      } else {
        router.push("/onboarding");
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
    }
  };

  const handleGoogleAuth = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () =>
      addNotification("error", "Google registration was unsuccessful"),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      addNotification("error", "First name is required");
      return false;
    }

    if (!formData.lastName.trim()) {
      addNotification("error", "Last name is required");
      return false;
    }

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

    if (formData.password.length < 8) {
      addNotification("error", "Password must be at least 8 characters");
      return false;
    }

    if (!formData.confirmPassword) {
      addNotification("error", "Please confirm your password");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      addNotification("error", "Passwords do not match");
      return false;
    }

    if (!acceptTerms) {
      addNotification("error", "Please accept the terms and conditions");
      return false;
    }

    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        agreeToTerms: acceptTerms,
      });

      router.push("/onboarding");
    } catch (error: any) {
      console.error("Signup failed:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black selection:bg-primary/10 selection:text-primary">
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

      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-4 md:py-6">
        <div className="w-full max-w-[440px]">
          <div className="mb-4 md:mb-6 text-center">
            <h1 className="text-3xl font-medium text-gray-900 dark:text-white mb-3 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Join thousands of students and readers
            </p>
          </div>

          <Card className="p-4 md:p-8!">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              className="space-y-4 md:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <FormInput
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  icon={<FiUser className="w-5 h-5 text-gray-400" />}
                  placeholder="John"
                  autoComplete="given-name"
                />

                <FormInput
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  icon={<FiUser className="w-5 h-5 text-gray-400" />}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>

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

              <div className="space-y-3 md:space-y-4">
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  icon={<FiLock className="w-5 h-5 text-gray-400" />}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  showPasswordToggle={true}
                />
                <PasswordStrengthIndicator password={formData.password} />
              </div>

              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                icon={<FiLock className="w-5 h-5 text-gray-400" />}
                placeholder="••••••••"
                autoComplete="new-password"
                showPasswordToggle={true}
              />

              <Checkbox
                id="accept-terms"
                checked={acceptTerms}
                onChange={setAcceptTerms}
                label={
                  <span className="text-xs text-gray-500">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-primary font-medium hover:opacity-80 transition-opacity"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary font-medium hover:opacity-80 transition-opacity"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                }
              />

              <Button
                type="submit"
                variant="primary"
                isLoading={isRegisterPending}
                disabled={isLoading}
                className="py-4"
                loader={<SpinnerLoader />}
              >
                Create Account
              </Button>
            </form>

            <Divider text="or sign up with" />

            <SocialLoginButton
              provider="google"
              onClick={handleGoogleAuth}
              isLoading={isGooglePending}
              disabled={isLoading}
              loader={<SpinnerLoader />}
            />
          </Card>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:opacity-80 transition-opacity"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
