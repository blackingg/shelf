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
import { useNotifications } from "@/app/context/NotificationContext";
import { SpinnerLoader } from "@/app/components/Loader/SpinnerLoader";
import { useAuthActions } from "@/app/services";
import { useGoogleLogin } from "@react-oauth/google";
import { FiCheckCircle } from "react-icons/fi";
import { StepHeader } from "@/app/components/Onboarding/StepHeader";
import { useOpenPanel } from "@openpanel/nextjs";
import { getErrorMessage } from "@/app/helpers/error";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const openPanel = useOpenPanel();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
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

      openPanel.identify({
        profileId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
      });

      if (result.user.onboardingCompleted) {
        router.push("/discover");
      } else {
        router.push("/onboarding");
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      addNotification(
        "error",
        getErrorMessage(error, "Google signup was unsuccessful"),
      );
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

    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSymbol = /[^A-Za-z0-9]/.test(formData.password);

    if (!hasLetter || !hasNumber || !hasSymbol) {
      addNotification(
        "error",
        "Password must contain letters, numbers, and symbols",
      );
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

      openPanel.track("signup_completed");
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Signup failed:", error);
      addNotification(
        "error",
        getErrorMessage(error, "Signup failed. Please try again."),
      );
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
            <h1 className="text-3xl font-medium text-foreground mb-3 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Join thousands of students and readers
            </p>
          </div>

          {isSubmitted ? (
            <Card className="p-4! md:p-8! text-center">
              <StepHeader
                icon={
                  <FiCheckCircle className="w-12 h-12 text-emerald-500 mb-2" />
                }
                title="Verify Your Email"
                description={`We've sent a verification link to ${formData.email}. Please check your inbox and click the link to activate your account.`}
              />

              <div className="mt-8 space-y-4">
                <Button
                  variant="primary"
                  className="w-full py-4"
                  onClick={() => router.push("/auth/login")}
                >
                  Continue to Login
                </Button>

                <p className="text-sm text-gray-500">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => handleSubmit()}
                    disabled={isRegisterPending}
                    className="text-primary font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    Resend verification link
                  </button>
                </p>
              </div>
            </Card>
          ) : (
            <Card className="p-4! md:p-8!">
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
          )}

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
